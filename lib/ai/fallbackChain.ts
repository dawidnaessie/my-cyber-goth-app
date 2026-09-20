import { AIStreamOptions, AIStreamResult } from './types';
import { generateGeminiStream } from './geminiProvider';
import { generateGroqStream } from './groqProvider';
import { generateEmergencyBufferStream } from './emergencyBuffer';

/**
 * Ustrukturyzowany rejestrator zdarzeń klastra AI.
 */
function logAiEvent(
  level: 'info' | 'warn' | 'error',
  event: string,
  details: Record<string, unknown>
): void {
  const logPayload = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    subsystem: 'AI_FALLBACK_CHAIN',
    event,
    ...details,
  };

  const formatted = JSON.stringify(logPayload);
  if (level === 'error') {
    console.error(`[CLUSTER_TELEMETRY] ${formatted}`);
  } else if (level === 'warn') {
    console.warn(`[CLUSTER_TELEMETRY] ${formatted}`);
  } else {
    console.info(`[CLUSTER_TELEMETRY] ${formatted}`);
  }
}

/**
 * Główny koordynator łańcucha odpornego na awarie (Fail-Safe Provider Chain):
 * 1. Główny dostawca: Google Gemini API (@google/genai)
 * 2. Zapasowy dostawca (transparentny fallback): Groq API (llama-3.1-8b-instant)
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

      // KROK 3: Graceful degradation – lokalny bufor awaryjny
      return generateEmergencyBufferStream(options);
    }
  }
}
