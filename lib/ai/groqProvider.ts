import { AIStreamOptions, AIStreamResult } from './types';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqStreamDelta {
  content?: string;
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

  // Wymóg obecności przynajmniej jednej wiadomości użytkownika
  const hasUserMessage = result.some((m) => m.role === 'user');
  if (!hasUserMessage) {
    throw new Error('Brak wiadomości użytkownika dla dostawcy Groq.');
  }

  return result;
}

/**
 * Wywołuje Groq API przez endpoint https://api.groq.com/openai/v1/chat/completions
 * ze strumieniowaniem odpowiedzi (Server-Sent Events / SSE) i natychmiastowym parsowaniem tokenów.
 * Obsługuje listę modeli zapasowych (fallback models), co zabezpiecza przed wycofaniem
 * lub zmianą dostępności modeli w chmurze Groq.
 */
export async function generateGroqStream(options: AIStreamOptions): Promise<AIStreamResult> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Brak zdefiniowanego klucza GROQ_API_KEY w środowisku roboczym.');
  }

  const customModel = process.env.GROQ_MODEL?.trim();
  const candidateModels = [
    customModel,
    'llama-3.1-8b-instant',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-20b',
    'groq/compound-mini',
  ].filter((m): m is string => Boolean(m));

  // Usuwamy duplikaty zachowując kolejność priorytetów
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

  let activeResponse: Response | null = null;
  let activeModel = uniqueModels[0];
  let lastErrorDetail = '';

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

      if (response.ok && response.body) {
        activeResponse = response;
        activeModel = modelCandidate;
        break;
      }

      let errMessage = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.error?.message) {
          errMessage = errorJson.error.message;
        }
      } catch {
        // Ignorowanie błędu JSON
      }

      lastErrorDetail = `[Model ${modelCandidate}]: ${errMessage}`;
      // Jeśli błąd to 401 (błędny klucz API), nie ma sensu próbować innych modeli
      if (response.status === 401) {
        throw new Error(`Błąd autoryzacji Groq API (401): ${errMessage}`);
      }
    } catch (fetchErr: unknown) {
      if (fetchErr instanceof Error && fetchErr.message.includes('401')) {
        throw fetchErr;
      }
      lastErrorDetail = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
    }
  }

  if (!activeResponse || !activeResponse.body) {
    throw new Error(`Wszystkie modele Groq zawiodły. Ostatni błąd: ${lastErrorDetail}`);
  }

  const responseBody = activeResponse.body;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = responseBody.getReader();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line || !line.startsWith('data:')) continue;

            const dataContent = line.slice(5).trim();
            if (dataContent === '[DONE]') {
              continue;
            }

            try {
              const chunkJson = JSON.parse(dataContent) as GroqStreamChunk;
              const deltaText = chunkJson.choices?.[0]?.delta?.content;
              if (deltaText) {
                controller.enqueue(encoder.encode(deltaText));
              }
            } catch {
              // Pomijamy uszkodzone pakiety pojedynczych linii SSE
            }
          }
        }

        if (buffer.trim().startsWith('data:')) {
          const dataContent = buffer.trim().slice(5).trim();
          if (dataContent !== '[DONE]') {
            try {
              const chunkJson = JSON.parse(dataContent) as GroqStreamChunk;
              const deltaText = chunkJson.choices?.[0]?.delta?.content;
              if (deltaText) {
                controller.enqueue(encoder.encode(deltaText));
              }
            } catch {
              // Ignorowanie
            }
          }
        }
      } catch (streamError: unknown) {
        const errorMsg = streamError instanceof Error ? streamError.message : 'Zakłócenie strumienia Groq';
        controller.enqueue(encoder.encode(`\n\n[ZAKŁÓCENIE TRANSMISJI GROQ]: ${errorMsg}\n`));
        controller.error(streamError);
      } finally {
        controller.close();
      }
    },
  });

  return {
    stream,
    provider: 'groq',
    model: activeModel,
  };
}
