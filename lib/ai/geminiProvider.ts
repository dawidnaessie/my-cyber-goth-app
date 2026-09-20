import { ai } from '@/lib/ai';
import { AIStreamOptions, AIStreamResult } from './types';

/**
 * Przetwarza surową listę wiadomości na format multi-turn akceptowany przez Google Gemini API.
 * Wymogi Gemini:
 * 1. Pierwsza wiadomość musi mieć rolę 'user' (pomijamy wstępne komunikaty systemowe/asystenta).
 * 2. Kolejne wiadomości o tej samej roli muszą zostać scalone w jedną turę konwersacji.
 */
function prepareGeminiContents(
  messages: AIStreamOptions['messages']
): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  const normalizedList: Array<{ role: 'user' | 'model'; text: string }> = [];

  for (const msg of messages) {
    const text = msg.content?.trim();
    if (!text) continue;
    const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
    normalizedList.push({ role, text });
  }

  if (normalizedList.length === 0) {
    throw new Error('Pusty wektor wejściowy dla dostawcy Gemini.');
  }

  let startIndex = 0;
  while (startIndex < normalizedList.length && normalizedList[startIndex].role === 'model') {
    startIndex++;
  }

  const filtered = startIndex < normalizedList.length
    ? normalizedList.slice(startIndex)
    : [normalizedList[normalizedList.length - 1]];

  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const item of filtered) {
    const last = contents[contents.length - 1];
    if (last && last.role === item.role) {
      last.parts[0].text += `\n${item.text}`;
    } else {
      contents.push({
        role: item.role,
        parts: [{ text: item.text }],
      });
    }
  }

  return contents;
}

/**
 * Wywołuje Google Gemini API ze strumieniowaniem odpowiedzi oraz obsługą modelu zapasowego Flash.
 */
export async function generateGeminiStream(options: AIStreamOptions): Promise<AIStreamResult> {
  const contents = prepareGeminiContents(options.messages);

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const fallbackModel = 'gemini-3.5-flash';

  const temperature =
    options.temperature !== undefined
      ? options.temperature
      : options.stage === 'insanity'
      ? 0.95
      : options.stage === 'error'
      ? 0.9
      : 0.7;

  let responseStream;
  let activeModel = primaryModel;

  try {
    responseStream = await ai.models.generateContentStream({
      model: primaryModel,
      contents,
      config: {
        systemInstruction: options.systemPrompt,
        temperature,
      },
    });
  } catch (primaryError: unknown) {
    if (primaryModel !== fallbackModel) {
      try {
        activeModel = fallbackModel;
        responseStream = await ai.models.generateContentStream({
          model: fallbackModel,
          contents,
          config: {
            systemInstruction: options.systemPrompt,
            temperature,
          },
        });
      } catch (secondaryError: unknown) {
        const message = primaryError instanceof Error ? primaryError.message : String(primaryError);
        throw new Error(`Gemini primary (${primaryModel}) i secondary (${fallbackModel}) zawiodły: ${message}`);
      }
    } else {
      const message = primaryError instanceof Error ? primaryError.message : String(primaryError);
      throw new Error(`Gemini (${primaryModel}) zgłosił błąd: ${message}`);
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of responseStream) {
          const chunkText = chunk.text;
          if (chunkText) {
            controller.enqueue(encoder.encode(chunkText));
          }
        }
      } catch (streamError: unknown) {
        const errorMsg = streamError instanceof Error ? streamError.message : 'Przerwanie strumienia Gemini';
        controller.enqueue(encoder.encode(`\n\n[ZAKŁÓCENIE TRANSMIJI GEMINI]: ${errorMsg}\n`));
        controller.error(streamError);
      } finally {
        controller.close();
      }
    },
  });

  return {
    stream,
    provider: 'gemini',
    model: activeModel,
  };
}
