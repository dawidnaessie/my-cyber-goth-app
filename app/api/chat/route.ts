import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/ai';
import { SCHIZO_SYSTEM_PROMPT } from '@/lib/prompts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

interface ChatRequestBody {
  messages?: ChatMessage[];
  prompt?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, prompt } = body;

    const rawList: Array<{ role: 'user' | 'model'; text: string }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        const text = msg.content?.trim();
        if (!text) continue;
        const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
        rawList.push({ role, text });
      }
    } else if (typeof prompt === 'string' && prompt.trim().length > 0) {
      rawList.push({ role: 'user', text: prompt.trim() });
    }

    if (rawList.length === 0) {
      return NextResponse.json(
        { error: '[BLAD_STRUKTURY]: Pusty sygnał wejściowy. Brak zawartości do przetworzenia.' },
        { status: 400 }
      );
    }

    // Pomijamy początkowe komunikaty 'model' (np. logi bootowania terminala UI),
    // aby historia konwersacji w Gemini zawsze zaczynała się od roli 'user'
    let startIndex = 0;
    while (startIndex < rawList.length && rawList[startIndex].role === 'model') {
      startIndex++;
    }

    const filtered = startIndex < rawList.length ? rawList.slice(startIndex) : [rawList[rawList.length - 1]];

    // Łączenie kolejnych wiadomości o tej samej roli w jedną turę (wymóg multi-turn Gemini API)
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

    // Wybór modelu: zdefiniowany w środowisku lub domyślny aktywny flash
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const fallbackModel = 'gemini-3.5-flash';

    let responseStream;
    try {
      responseStream = await ai.models.generateContentStream({
        model: primaryModel,
        contents,
        config: {
          systemInstruction: SCHIZO_SYSTEM_PROMPT,
          temperature: 0.85,
        },
      });
    } catch (primaryError: unknown) {
      // Jeśli wybrany model jest niedostępny lub przeciążony, fallback do alternatywnego flasha
      if (primaryModel !== fallbackModel) {
        try {
          responseStream = await ai.models.generateContentStream({
            model: fallbackModel,
            contents,
            config: {
              systemInstruction: SCHIZO_SYSTEM_PROMPT,
              temperature: 0.85,
            },
          });
        } catch {
          throw primaryError;
        }
      } else {
        throw primaryError;
      }
    }

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (streamError: unknown) {
          const errorMessage =
            streamError instanceof Error
              ? streamError.message
              : 'Nieznane zakłócenie strumienia przesyłu';
          controller.enqueue(
            encoder.encode(`\n\n[ZAKLOCENIE_TRANSMISJI]: ${errorMessage}\n`)
          );
          controller.error(streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readableStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    const isApiKeyError = errorDetails.includes('GEMINI_API_KEY');

    return NextResponse.json(
      {
        error: isApiKeyError
          ? '[BRAK_KLUCZA_SYS]: Skonfiguruj GEMINI_API_KEY w pliku .env'
          : `[BLAD_WĘZŁA_ANOMALII]: ${errorDetails}`,
      },
      { status: isApiKeyError ? 401 : 500 }
    );
  }
}
