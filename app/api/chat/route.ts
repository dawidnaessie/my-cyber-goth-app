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

    let contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages) && messages.length > 0) {
      contents = messages
        .filter((msg) => msg.content && msg.content.trim().length > 0)
        .map((msg) => ({
          role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content.trim() }],
        }));
    } else if (typeof prompt === 'string' && prompt.trim().length > 0) {
      contents = [
        {
          role: 'user',
          parts: [{ text: prompt.trim() }],
        },
      ];
    }

    if (contents.length === 0) {
      return NextResponse.json(
        { error: '[BLAD_STRUKTURY]: Pusty sygnał wejściowy. Brak zawartości do przetworzenia.' },
        { status: 400 }
      );
    }

    // Wybór modelu: zdefiniowany w środowisku lub najnowszy aktywny flash
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
      // Jeśli wybrany model jest niedostępny lub obciążony, przełącz na model rezerwowy
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
