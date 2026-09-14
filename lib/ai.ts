import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;

/**
 * Zwraca instancję klienta GoogleGenAI zainicjalizowaną kluczem GEMINI_API_KEY.
 * Leniwa inicjalizacja zabezpiecza przed awarią podczas statycznej analizy/kompilacji Next.js.
 */
export function getGenAIClient(): GoogleGenAI {
  if (!cachedClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Brak klucza GEMINI_API_KEY w zmiennych środowiskowych (.env). Skonfiguruj klucz API.');
    }
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

/**
 * Proxy obiekt `ai` umożliwiający bezpośrednie wywołania `ai.models.generateContentStream`
 * z zachowaniem leniwej ewaluacji klucza API i właściwego kontekstu `this`.
 */
export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop) {
    const client = getGenAIClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});