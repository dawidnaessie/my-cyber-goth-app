import { AIStreamOptions, AIStreamResult } from './types';
import { generateGeminiStream } from './geminiProvider';
import { generateGroqStream } from './groqProvider';
import { generateEmergencyBufferStream } from './emergencyBuffer';

/**
 * Ustrukturyzowany rejestrator zdarzeń klastra AI z oczyszczaniem surowych błędów API.
 */
function logAiEvent(
  level: 'info' | 'warn' | 'error',
  event: string,
  details: Record<string, unknown>
): void {
  const sanitizeMessage = (msg: unknown): string => {
    if (typeof msg !== 'string') return '';
    if (msg.includes('QuotaFailure') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return 'API Rate Limit / Quota Exceeded (429)';
    }
    if (msg.includes('model_not_found') || msg.includes('does not exist')) {
      return 'Model Not Found on Provider';
    }
    return msg.length > 150 ? `${msg.slice(0, 147)}...` : msg;
  };

  const sanitizedDetails: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(details)) {
    if (key.toLowerCase().includes('error')) {
      sanitizedDetails[key] = sanitizeMessage(val);
    } else {
      sanitizedDetails[key] = val;
    }
  }

  const logPayload = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    subsystem: 'AI_FALLBACK_CHAIN',
    event,
    ...sanitizedDetails,
  };

  const formatted = JSON.stringify(logPayload);
  if (level === 'error') {
    // Rejestrujemy jako ostrzeżenie systemowe telemetrii, by nie spamować konsoli krytycznymi wyjątkami
    console.warn(`[CLUSTER_TELEMETRY] ${formatted}`);
  } else if (level === 'warn') {
    console.warn(`[CLUSTER_TELEMETRY] ${formatted}`);
  } else {
    console.info(`[CLUSTER_TELEMETRY] ${formatted}`);
  }
}

/**
 * Główny koordynator łańcucha odpornego na awarie (Fail-Safe Provider Chain):
 * 1. Główny dostawca: Google Gemini API (@google/genai)
 * 2. Zapasowy dostawca (transparentny fallback): Groq API (llama-3.3-70b-versatile, qwen/qwen3.8-27b)
 * 3. Bufor awaryjny (graceful degradation): lokalny generator fabularny Sektor-7
 */
export async function executeWithFallbackChain(
  options: AIStreamOptions
): Promise<AIStreamResult> {
  // KROK 1: Próba wykonania zapytania przez Google Gemini API
  try {
    const result = await generateGeminiStream(options);
    logAiEvent('info', 'GEMINI_INFERENCE_SUCCESS', {
      model: result.model,
      stage: options.stage,
      messagesCount: options.messages.length,
    });
    return result;
  } catch (geminiError: unknown) {
    const geminiErrMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
    logAiEvent('warn', 'GEMINI_INFERENCE_FAILED_TRIGGERING_GROQ_FALLBACK', {
      error: geminiErrMsg,
      stage: options.stage,
    });

    // KROK 2: Transparentny fallback do Groq API
    try {
      const groqResult = await generateGroqStream(options);
      logAiEvent('info', 'GROQ_FALLBACK_INFERENCE_SUCCESS', {
        model: groqResult.model,
        stage: options.stage,
      });
      return groqResult;
    } catch (groqError: unknown) {
      const groqErrMsg = groqError instanceof Error ? groqError.message : String(groqError);
      logAiEvent('error', 'ALL_EXTERNAL_PROVIDERS_FAILED_ACTIVATING_EMERGENCY_BUFFER', {
        geminiError: geminiErrMsg,
        groqError: groqErrMsg,
        stage: options.stage,
      });

      // KROK 3: Graceful degradation – lokalny bufor awaryjny (nigdy nie rzuca błędu, nie zwraca pustego dymka)
      return generateEmergencyBufferStream(options);
    }
  }
}
