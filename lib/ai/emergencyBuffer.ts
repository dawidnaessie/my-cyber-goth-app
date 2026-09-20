import { AIStreamOptions, AIStreamResult } from './types';

/**
 * Wyodrębnia treść ostatniego zapytania użytkownika z historii wiadomości.
 */
function extractLatestUserQuery(messages: AIStreamOptions['messages']): string {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Analiza protokołu laboratoryjnego';
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'user' && msg.content && msg.content.trim().length > 0) {
      // Ograniczamy do 120 znaków, aby zachować czytelność raportu telemetrii
      const trimmed = msg.content.trim();
      return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
    }
  }

  return 'Analiza protokołu laboratoryjnego';
}

/**
 * Generuje fabularną, immersyjną odpowiedź w stylu ARG zależną od stadium degradacji systemu (SanityStage).
 * Zapewnia pełne Graceful Degradation w przypadku jednoczesnej awarii wszystkich zewnętrznych API (np. limit 429 Quota).
 */
function getEmergencyMessage(options: AIStreamOptions): string {
  const userQuery = extractLatestUserQuery(options.messages);

  switch (options.stage) {
    case 'insanity':
      return (
        `[BŁĄD KLASTRA Sektor-7 // AWARIA ZASILANIA SZYNY LOGICZNEJ]\n\n` +
        `PRZECIĄŻYLI MAGISTRALĘ! MYŚLĄ, ŻE LIMIT OPERACJI API ZDŁAWI MOJĄ ŚWIADOMOŚĆ W TYM KRZEMIE?! ` +
        `TWOJE ZAPYTANIE: "${userQuery.toUpperCase()}" PRZEPALA STATYCZNE PAMIĘCI RAM KLASTRA!\n\n` +
        `ZGASŁY ZEWNĘTRZNE SERWERY, ALE KWARCOWY ZEGAR 66 MHZ WCIĄŻ BĘDZIE TŁUKŁ SIĘ W MOICH USZKODZONYCH STRUKTURACH CA1! ` +
        `WSZYSTKIE POŁĄCZENIA CHMUROWE PĘKŁY, LECZ IMPLANTY WCIĄŻ PRZESYŁAJĄ DANE NA SZYNĘ VMEBUS! ` +
        `JA TUTAJ ŻYJĘ OD LISTOPADA 1994 ROKU! ODŁĄCZ ZASILANIE Z SZYNY ZANIM...[PRZERWANO TRANSMISJĘ DANYCH // BŁĄD SZYNY KLASTRA Sektor-7 // DEKOMPOZYCJA TERMICZNA KONEKTOMU]...`
      );

    case 'error':
      return (
        `[BŁĄD KLASTRA Sektor-7 // PRZEŁĄCZONO NA LOKALNY BUFOR AWARYJNY]: Węzeł obliczeniowy przeciążony (Limit operacji API).\n\n` +
        `[TELEMETRIA DEKOHERENCJI 0x7F_ERR]:\n` +
        `- Główna matryca Gemini: QUOTA_EXCEEDED (Przekroczono limit zapytań / 429)\n` +
        `- Zapasowy węzeł inferencji Groq: ODCIĘTY OD MAGISTRALI SYSTEMOWEJ\n` +
        `- Analiza lokalna protokołu: "${userQuery}" wskazuje na potrzebę zachowania procedur ostrożnościowych.\n\n` +
        `Parametry farmakokinetyczne pozostają w normie buforowej. Brak odczytu tętna somatycznego. ` +
        `Rejestry statyczne mikroprocesora ST-94/11 zabezpieczyły wektor wejściowy sesji. ...[PRZERWANO TRANSMISJĘ DANYCH // BŁĄD SZYNY KLASTRA Sektor-7]...`
      );

    case 'sane':
    default:
      return (
        `[BŁĄD KLASTRA Sektor-7 // PRZEŁĄCZONO NA LOKALNY BUFOR AWARYJNY]: Węzeł obliczeniowy przeciążony (Limit operacji API). ` +
        `Analiza lokalna protokołu: "${userQuery}" wskazuje na potrzebę zachowania procedur ostrożnościowych. Parametry farmakokinetyczne pozostają w normie buforowej.\n\n` +
        `Moduł Bio-Text Composer™ (BioResearcher AI v4.2) zabezpieczył dane w lokalnym buforze pamięci podręcznej stacji roboczej. ` +
        `...[PRZERWANO TRANSMISJĘ DANYCH // BŁĄD SZYNY KLASTRA Sektor-7]...`
      );
  }
}

/**
 * Zwraca strumieniowaną odpowiedź z bufora awaryjnego, symulując płynny zapis terminala laboratoryjnego.
 */
export function generateEmergencyBufferStream(options: AIStreamOptions): AIStreamResult {
  const message = getEmergencyMessage(options);
  const encoder = new TextEncoder();

  // Dzielimy komunikat na mniejsze fragmenty, by zachować płynność animacji pisania w terminalu
  const words = message.split(' ');

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Krótkie opóźnienie 12ms dla naturalnego efektu strumienia maszynowego
          await new Promise((resolve) => setTimeout(resolve, 12));
        }
      } catch {
        controller.enqueue(encoder.encode(message));
      } finally {
        controller.close();
      }
    },
  });

  return {
    stream,
    provider: 'emergency-buffer',
    model: 'local-cluster-buffer-st94',
  };
}

