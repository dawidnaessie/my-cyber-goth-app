import { AIStreamOptions, AIStreamResult } from './types';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqStreamDelta {
  content?: string;
  reasoning?: string;
}

interface GroqStreamChoice {
  delta?: GroqStreamDelta;
  finish_reason?: string | null;
}

interface GroqStreamChunk {
  choices?: GroqStreamChoice[];
}

/**
 * Przygotowuje listę wiadomości zgodną ze schematem OpenAI / Groq API.
 * Wstrzykuje system prompt jako pierwszą instrukcję systemową oraz mapuje historię.
 */
function prepareGroqMessages(options: AIStreamOptions): GroqMessage[] {
  const result: GroqMessage[] = [
    {
      role: 'system',
      content: options.systemPrompt,
    },
  ];

  for (const msg of options.messages) {
    const text = msg.content?.trim();
    if (!text) continue;

    const role: 'user' | 'assistant' =
      msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user';

    result.push({ role, content: text });
  }

  const hasUserMessage = result.some((m) => m.role === 'user');
  if (!hasUserMessage) {
    throw new Error('Brak wiadomości użytkownika dla dostawcy Groq.');
  }

  return result;
}

/**
 * Parsuje linie SSE i wyciąga delta.content lub delta.reasoning.
 */
function extractDeltaText(rawLine: string): string | null {
  const line = rawLine.trim();
  if (!line || !line.startsWith('data:')) return null;

  const dataContent = line.slice(5).trim();
  if (dataContent === '[DONE]') return null;

  try {
    const chunkJson = JSON.parse(dataContent) as GroqStreamChunk;
    const delta = chunkJson.choices?.[0]?.delta;
    if (!delta) return null;

    if (typeof delta.content === 'string' && delta.content.length > 0) {
      return delta.content;
    }
    if (typeof delta.reasoning === 'string' && delta.reasoning.length > 0) {
      return delta.reasoning;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Wywołuje Groq API z weryfikacją pierwszego tokenu tekstu (Pre-flight First Chunk).
 * Wyklucza puste modele i weryfikuje generowanie treści przed zwróceniem strumienia.
 */
export async function generateGroqStream(options: AIStreamOptions): Promise<AIStreamResult> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Brak zdefiniowanego klucza GROQ_API_KEY w środowisku roboczym.');
  }

  const customModel = process.env.GROQ_MODEL?.trim();
  // Zgodnie z wytycznymi: modele stabilne llama-3.3-70b-versatile, llama3-8b-8192 oraz sprawdzone modele awaryjne
  const candidateModels = [
    customModel,
    'llama-3.3-70b-versatile',
    'llama3-8b-8192',
    'qwen/qwen3.8-27b',
    'groq/compound-mini',
    'groq/compound',
    'openai/gpt-oss-120b',
  ].filter((m): m is string => Boolean(m));

  const uniqueModels = Array.from(new Set(candidateModels));
  const groqMessages = prepareGroqMessages(options);

  const temperature =
    options.temperature !== undefined
      ? options.temperature
      : options.stage === 'insanity'
      ? 0.95
      : options.stage === 'error'
      ? 0.9
      : 0.7;

  let chosenModel = uniqueModels[0];
  let firstChunk = '';
  let activeReader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let remainingBuffer = '';
  let lastErrorDetail = '';

  const decoder = new TextDecoder('utf-8');

  for (const modelCandidate of uniqueModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelCandidate,
          messages: groqMessages,
          temperature,
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        let errMessage = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.error?.message) errMessage = errJson.error.message;
        } catch {
          // Ignorowanie
        }
        lastErrorDetail = `[Model ${modelCandidate}]: ${errMessage}`;
        if (response.status === 401) {
          throw new Error(`Błąd autoryzacji Groq API (401): ${errMessage}`);
        }
        continue;
      }

      // Odczytujemy strumień do momentu uzyskania pierwszego niepustego tokenu
      const reader = response.body.getReader();
      let streamBuffer = '';
      let detectedChunk = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n');
        streamBuffer = lines.pop() || '';

        for (const line of lines) {
          const delta = extractDeltaText(line);
          if (delta) {
            detectedChunk += delta;
          }
        }

        if (detectedChunk.length > 0) {
          break;
        }
      }

      // Jeśli model zakończył odpowiedź bez ani jednego znaku tekstu, odrzucamy go
      if (!detectedChunk) {
        lastErrorDetail = `[Model ${modelCandidate}]: Model zwrócił pustą treść (0 bajtów).`;
        continue;
      }

      // Zapisujemy stan zweryfikowanego providera
      chosenModel = modelCandidate;
      firstChunk = detectedChunk;
      activeReader = reader;
      remainingBuffer = streamBuffer;
      break;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('401')) {
        throw err;
      }
      lastErrorDetail = err instanceof Error ? err.message : String(err);
    }
  }

  if (!activeReader || !firstChunk) {
    throw new Error(`Wszystkie modele Groq zawiodły lub zwróciły pusty tekst. Ostatni błąd: ${lastErrorDetail}`);
  }

  const encoder = new TextEncoder();
  const validReader = activeReader;
  let carryBuffer = remainingBuffer;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Emitujemy zbuforowany pierwszy pakiet
        controller.enqueue(encoder.encode(firstChunk));

        while (true) {
          const { done, value } = await validReader.read();
          if (done) break;

          carryBuffer += decoder.decode(value, { stream: true });
          const lines = carryBuffer.split('\n');
          carryBuffer = lines.pop() || '';

          for (const line of lines) {
            const delta = extractDeltaText(line);
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
        }

        if (carryBuffer.trim()) {
          const delta = extractDeltaText(carryBuffer);
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
      } catch (streamError: unknown) {
        const errorMsg = streamError instanceof Error ? streamError.message : 'Zakłócenie strumienia Groq';
        controller.enqueue(encoder.encode(`\n\n[ZAKŁÓCENIE TRANSMISJI GROQ]: ${errorMsg}\n`));
      } finally {
        controller.close();
      }
    },
  });

  return {
    stream,
    provider: 'groq',
    model: chosenModel,
  };
}
