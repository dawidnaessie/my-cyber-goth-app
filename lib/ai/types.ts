import { SanityStage } from '@/lib/prompts';

export type ProviderType = 'gemini' | 'groq' | 'emergency-buffer';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
}

export interface AIStreamOptions {
  messages: ChatMessage[];
  systemPrompt: string;
  stage: SanityStage;
  temperature?: number;
}

export interface AIStreamResult {
  stream: ReadableStream<Uint8Array>;
  provider: ProviderType;
  model: string;
}
