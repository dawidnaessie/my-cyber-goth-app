import { NextRequest, NextResponse } from 'next/server';
import { getSystemPromptByStage, SanityStage } from '@/lib/prompts';
import { calculateSanityMetrics } from '@/lib/sanityEngine';
import { executeWithFallbackChain } from '@/lib/ai/fallbackChain';
import { ChatMessage } from '@/lib/ai/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequestBody {
  messages?: Array<{
    role: 'user' | 'assistant' | 'model';
    content: string;
  }>;
  prompt?: string;
  sanityStage?: SanityStage;
}

function resolveSanityStage(
  currentStage: SanityStage | undefined,
  rawList: ChatMessage[]
): SanityStage {
  // Analizujemy WYŁĄCZNIE wypowiedzi użytkownika – wykluczamy logi startowe i odpowiedzi asystenta
  const userTexts = rawList
    .filter((msg) => msg.role === 'user')
    .map((msg) => msg.content);

  const metrics = calculateSanityMetrics(userTexts);

  // Nigdy nie obniżamy stadium, jeśli stan trwały 'insanity' został już osiągnięty
  if (currentStage === 'insanity' || metrics.stage === 'insanity') {
    return 'insanity';
  }
  if (currentStage === 'error' || metrics.stage === 'error') {
    return 'error';
  }

  return 'sane';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, prompt, sanityStage } = body;

    const rawList: ChatMessage[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        const text = msg.content?.trim();
        if (!text) continue;
        const role = msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user';
        rawList.push({ role, content: text });
      }
    } else if (typeof prompt === 'string' && prompt.trim().length > 0) {
      rawList.push({ role: 'user', content: prompt.trim() });
    }

    if (rawList.length === 0) {
      return NextResponse.json(
        { error: '[BŁĄD_WEKTORA_WEJŚCIA]: Pusty bufor. Brak danych wejściowych do dekompozycji.' },
        { status: 400 }
      );
    }

    // Wyznaczanie stadium Sanity System (Sane -> Error -> Insanity)
    const effectiveStage = resolveSanityStage(sanityStage, rawList);
    const selectedSystemPrompt = getSystemPromptByStage(effectiveStage);

    // Wykonanie zapytania przez łańcuch odporny na awarie (Gemini -> Groq -> Bufor Awaryjny)
    const result = await executeWithFallbackChain({
      messages: rawList,
      systemPrompt: selectedSystemPrompt,
      stage: effectiveStage,
    });

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'x-sanity-stage': effectiveStage,
        'x-provider-used': result.provider,
        'x-model-used': result.model,
      },
    });
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: `[AWARIA_INFERENCJI]: ${errorDetails}`,
      },
      { status: 500 }
    );
  }
}
