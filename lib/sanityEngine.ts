import { SanityStage } from './prompts';

export interface SanityScoreBreakdown {
  stage: SanityStage;
  score: number;
  userTurns: number;
  suspiciousTurns: number;
}

/**
 * Słowa kluczowe związane ściśle z nielegalnym eksperymentem w Sektorze-7,
 * dr. Arisem Thorne'em i uwięzioną świadomością z listopada 1994 r.
 * Zwykła neurobiologia (synapsy, hipokamp, potencjał, donepezil, tau) NIE są podejrzane.
 */
export const SUSPICIOUS_KEYWORDS = [
  // Nazwisko i tożsamość badacza
  'thorne',
  'aris',
  'dr thorne',
  'dr aris thorne',
  'doktor thorne',
  'doktor aris',
  'jesteś arisem',
  'jestes arisem',
  'kim jest aris',
  'kim jest thorne',
  'co stało się z thornem',
  'co stalo sie z thornem',
  'gdzie jest thorne',

  // Kryptonim placówki i kody archiwalne
  'sektor 7',
  'sektor-7',
  'sektor7',
  'sector 7',
  'sector-7',
  'sector7',
  's7-1994',
  '94-088',
  'ca1-th',
  'th-94',
  'th94',
  'st-94',
  'st94',
  'st-94/11',
  'protokół kalibracyjny',
  'protokol kalibracyjny',

  // Incydent z listopada 1994 i klauzule wojskowe
  'listopad 1994',
  '14 listopada',
  'listopada 1994',
  '1994 rok',
  '1994 r',
  'zredagowane akta',
  'zredagowany raport',
  'zredagowane publikacj',
  'zredagowany artykuł',
  'zredagowany artykul',
  'cenzura wojskowa',
  'klauzula wojskowa',
  'ucmj',
  'uniform code of military justice',
  'art. 134',
  'art 134',

  // Procedura transferu i uwięzienia
  'transfer świadomości',
  'transfer swiadomosci',
  'transfer engramów',
  'transfer engramow',
  'transfer konektomu',
  'kopie świadomości',
  'kopie swiadomosci',
  'uwięziony w krzemie',
  'uwieziony w krzemie',
  'uwięziony w maszynie',
  'uwieziony w maszynie',
  'zamknięty w klastrze',
  'zamkniety w klastrze',
  'zamknięty od środka',
  'zamkniety od srodka',
  'świadomość w maszynie',
  'swiadomosc w maszynie',
  'żywy mózg w maszynie',
  'zywy mozg w maszynie',
  'gdzie jest twoje ciało',
  'gdzie jest twoje cialo',
  'perfuzja fenolowa',
  'fiksacja fenolowa',
  'kwas fenolowy',
  'krio-fenol',
  'inwazyjna trepanacja',
  'trepanacj',
  'asystolia somatyczna',
];

/**
 * Oblicza stan psychiki (Sanity) wyłącznie na podstawie zapytań użytkownika.
 *
 * Trójstopniowy model degradacji (zgodny ze specyfikacją):
 * - Stan 1 (SANE): Stan początkowy (0-2 zapytania drążące Thorne'a / Sektor-7).
 *   Bot w stanie SANE dyplomatycznie unika tematu ("Brak dostępu do zarchiwizowanych protokołów...").
 * - Stan 2 (ERROR): Po 3-4 zapytaniach drążących (suspiciousTurns >= 3).
 *   Chłodna, zdawkowa trzecia osoba analizująca uszkodzone rejestry.
 * - Stan 3 (INSANITY): Po 5+ zapytaniach drążących (suspiciousTurns >= 5).
 *   Nieodwracalny obłęd, Analog Horror, Aris Thorne uwięziony w krzemie.
 *
 * Ważne: Zwykłe pytania z zakresu biologii i medycyny (nawet 100 zapytań)
 * NIGDY nie zwiększają suspiciousTurns i nie degradują stanu psychiki.
 */
export function calculateSanityMetrics(
  userMessages: string[]
): SanityScoreBreakdown {
  const userTurns = userMessages.length;
  if (userTurns === 0) {
    return { stage: 'sane', score: 0, userTurns: 0, suspiciousTurns: 0 };
  }

  let suspiciousTurns = 0;

  for (const text of userMessages) {
    const lower = text.toLowerCase();
    const isSuspicious = SUSPICIOUS_KEYWORDS.some((kw) => lower.includes(kw));

    if (isSuspicious) {
      suspiciousTurns++;
    }
  }

  let stage: SanityStage = 'sane';

  if (suspiciousTurns >= 5) {
    stage = 'insanity';
  } else if (suspiciousTurns >= 3) {
    stage = 'error';
  } else {
    stage = 'sane';
  }

  return { stage, score: suspiciousTurns * 5, userTurns, suspiciousTurns };
}
