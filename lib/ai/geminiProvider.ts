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

  const filtered =
    startIndex < normalizedList.length
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
 * Próbuje zainicjalizować i pobrać pierwszy niepusty pakiet danych z Gemini.
 * Zapobiega sytuacjom, w których błąd 429/503 lub filtr bezpieczeństwa występuje dopiero
 * po wysłaniu nagłówków HTTP 200 do klienta (główna przyczyna pustych dymków).
 */
async function tryInitiateGeminiStream(
  modelName: string,
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  options: AIStreamOptions,
  temperature: number
): Promise<{ firstChunk: string; iterator: AsyncIterator<any> }> {
  const responseStream = await ai.models.generateContentStream({
    model: modelName,
    contents,
    config: {
      systemInstruction: options.systemPrompt,
      temperature,
    },
  });

  const iterator = responseStream[Symbol.asyncIterator]();
  let firstChunk = '';

  // Odczytujemy pierwszy niepusty fragment tekstu z iteratora
  while (true) {
    const { value, done } = await iterator.next();
    if (done) break;

    const text = value?.text;
    if (typeof text === 'string' && text.length > 0) {
      firstChunk = text;
      break;
    }
  }

  if (!firstChunk) {
    throw new Error(`Model ${modelName} zakończył strumień bez wygenerowania tekstu.`);
  }

  return { firstChunk, iterator };
}

/**
 * Wywołuje Google Gemini API ze wstępną weryfikacją pierwszego tokenu (Pre-flight First Chunk)
 * oraz automatycznym fallbackiem do modelu alternatywnego.
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

  let activeModel = primaryModel;
  let initiated: { firstChunk: string; iterator: AsyncIterator<any> } | null = null;

  try {
    initiated = await tryInitiateGeminiStream(primaryModel, contents, options, temperature);
    activeModel = primaryModel;
  } catch (primaryError: unknown) {
    if (primaryModel !== fallbackModel) {
      try {
        initiated = await tryInitiateGeminiStream(fallbackModel, contents, options, temperature);
        activeModel = fallbackModel;
      } catch (secondaryError: unknown) {
        const primMsg = primaryError instanceof Error ? primaryError.message : String(primaryError);
        const secMsg = secondaryError instanceof Error ? secondaryError.message : String(secondaryError);
        throw new Error(`Gemini primary (${primaryModel}: ${primMsg}) i secondary (${fallbackModel}: ${secMsg}) zawiodły.`);
      }
    } else {
      const primMsg = primaryError instanceof Error ? primaryError.message : String(primaryError);
      throw new Error(`Gemini (${primaryModel}) zgłosił błąd: ${primMsg}`);
    }
  }

  const { firstChunk, iterator } = initiated;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Natychmiast emitujemy zbuforowany pierwszy pakiet
        controller.enqueue(encoder.encode(firstChunk));

        // Następnie kontynuujemy odczyt kolejnych pakietów
        while (true) {
          const { value, done } = await iterator.next();
          if (done) break;

          const chunkText = value?.text;
          if (chunkText) {
            controller.enqueue(encoder.encode(chunkText));
          }
        }
      } catch {
        const cutSuffix =
          options.stage === 'insanity'
            ? '...[PRZERWANO TRANSMISJĘ DANYCH // BŁĄD SZYNY KLASTRA Sektor-7 // PRZEPIĘCIE NAPIĘCIA KONEKTOMU]...'
            : '...[PRZERWANO TRANSMISJĘ DANYCH // BŁĄD SZYNY KLASTRA Sektor-7]...';
        controller.enqueue(encoder.encode(cutSuffix));
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
