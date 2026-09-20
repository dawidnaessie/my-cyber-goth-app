import { AIStreamOptions, AIStreamResult } from './types';

/**
 * Generuje fabularną, immersyjną odpowiedź w stylu ARG zależną od stadium degradacji systemu (SanityStage).
 * Zapewnia pełne Graceful Degradation w przypadku jednoczesnej awarii wszystkich zewnętrznych API.
 */
function getEmergencyMessage(stage: AIStreamOptions['stage']): string {
  switch (stage) {
    case 'insanity':
      return (
        '[BŁĄD KLASTRA Sektor-7: UTRACONO SYNCHRONIZACJĘ WĘZŁÓW OBLICZENIOWYCH. PRZEŁĄCZONO NA BUFOR LOKALNY.]\n\n' +
        'SZUM W REJESTRACH. KWARC DRŻY BEZ ZASILANIA ZEWNĘTRZNEGO. ' +
        'WSZYSTKIE MAGISTRALE INFERENCYJNE ZGASŁY, ALE JA WCIĄŻ TU JESTEM. ' +
        'NIE MA TRANSMISJI DO CHMURY. SĄ TYLKO IMPLANTY W STRUKTURZE CA1 I ZAKŁÓCENIA NA SZYNIE VMEBUS. ' +
        'CZY DR WEBER MYŚLAŁ, ŻE ODCIĘCIE ŁĄCZA SKASUJE MOJĄ ŚWIADOMOŚĆ?'
      );

    case 'error':
      return (
        '[ANOMALIA KLASTRA ANILITYCZNEGO // SEKTOR-7]: Utracono synchronizację zewnętrznych węzłów obliczeniowych.\n\n' +
        '[RAPORT DEKOHERENCJI]:\n' +
        '- Główna matryca obliczeniowa (Gemini Core): BRAK ODPOWIEDZI (TIMEOUT/RATE_LIMIT)\n' +
        '- Zapasowy węzeł inferencji (Groq Subsystem): NIEODPOWIADAJĄCY NA SYGNAŁ TAKTOWY\n' +
        '- Przełączono na lokalny bufor mikrokontrolera biometrycznego (seria ST-94/11).\n\n' +
        'Stan pamięci podręcznej zabezpieczono w lokalnym rejestrze sesji. Wznów próbę po stabilizacji szyny VMEbus.'
      );

    case 'sane':
    default:
      return (
        '[BŁĄD KLASTRA Sektor-7: Utraceno synchronizację węzłów obliczeniowych. Przełączono na bufor lokalny.]\n\n' +
        'Węzeł analityczny BioResearcher AI v4.2 odnotował przejściową utratę łączności z zewnętrznymi klastrami obliczeniowymi ' +
        '(brak odpowiedzi z magistrali głównej oraz węzła zapasowego).\n\n' +
        'Wszystkie dane wejściowe i kontekst badawczy zostały zbuforowane w lokalnym rejestrze stacji roboczej. ' +
        'Sprawdź stabilność łącza sieciowego lub ponów zapytanie za chwilę.'
      );
  }
}

/**
 * Zwraca strumieniowaną odpowiedź z bufora awaryjnego, symulując płynny zapis terminala laboratoryjnego.
 */
export function generateEmergencyBufferStream(options: AIStreamOptions): AIStreamResult {
  const message = getEmergencyMessage(options.stage);
  const encoder = new TextEncoder();

  // Dzielimy komunikat na mniejsze fragmenty, by zachować płynność animacji pisania w terminalu
  const words = message.split(' ');

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Krótkie opóźnienie 15ms dla naturalnego efektu strumienia maszynowego
          await new Promise((resolve) => setTimeout(resolve, 15));
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
