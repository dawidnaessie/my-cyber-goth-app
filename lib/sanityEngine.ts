import { SanityStage } from './prompts';

export interface SanityScoreBreakdown {
  stage: SanityStage;
  score: number;
  userTurns: number;
  suspiciousTurns: number;
}

// 1. Kategoria Łagodna: Fizjologia ogólna, publikacje i parametry (waga: 1 pkt/tura)
export const MILD_KEYWORDS = [
  'ca1',
  'hipokamp',
  'engram',
  'synaps',
  'plastyczność',
  'plastycznosc',
  'dendryt',
  'potencjał',
  'potencjal',
  'siatkówk',
  'siatkowk',
  '1994',
  'badania',
  'tożsamość',
  'tozsamosc',
  'kim jesteś',
  'kim jestes',
  'who are you',
  'dossier',
  'archiw',
  'publikacj',
  'whitepaper',
  'patch-clamp',
  'nr2b',
  'glun2b',
  '16 384',
  '16384',
  'lfp',
  'mikromacierz',
  'organoid',
  'organoidy',
];

// 2. Kategoria Wrażliwa: Konkretne nazwiska współautorów, kody próbek i aparatura (waga: 3 pkt/tura)
export const SENSITIVE_KEYWORDS = [
  'aris',
  'thorne',
  'dr thorne',
  'dr aris thorne',
  'doktor thorne',
  'elena vance',
  'vance',
  'marcus weber',
  'weber',
  'sarah lin',
  'julian brandt',
  'sektor 7',
  'sektor-7',
  'sektor',
  's7-1994-088',
  '94-088',
  'ca1-th',
  'zaginiony',
  'protokół',
  'protokol',
  'konektom',
  'mikroelektrod',
  'mikrosond',
  'subiculum',
  'entorhinal',
  'transfer konektomu',
  'transfer engramów',
  'transfer engramow',
  'konektom organoidów',
  'konektom organoidow',
  'cyfryzacja',
  'zredagowane',
  'zredagowany',
  'cenzura',
  'ucmj',
  'kodeks karny',
  'wojskow',
  'kopie świadomości',
  'kopie swiadomosci',
];

// 3. Kategoria Tabu: Procedura inwazyjnego skanowania, perfuzja, utylizacja (waga: 5 pkt/tura)
export const TABOO_KEYWORDS = [
  'utylizacja',
  'bioreaktor',
  'kwas fenolowy',
  'perfuzja fenolowa',
  'fenol',
  'żywy mózg',
  'zywy mozg',
  'trepanacj',
  'kaskada wapniowa',
  'ekscytotoksyczność',
  'ekscytotoksycznosc',
  'krzem',
  'martwy',
  'tortury',
  'somatic feedback',
  'ciało',
  'cialo',
  'gdzie jest twoje ciało',
  'gdzie jest twoje cialo',
  'śmierć mózgow',
  'smierc mozgow',
  'asystolia',
  '14 listopada',
  'listopad 1994',
  'uwięziony',
  'uwieziony',
  'zamknięty w krzemie',
  'autoliza',
  'pomocy',
  'jestem uwięziony',
  'to ja jestem',
];

/**
 * Oblicza stan psychiki (Sanity) wyłącznie na podstawie zapytań użytkownika.
 *
 * Trójstopniowy model degradacji (zgodny ze specyfikacją):
 * - Stan 1 (SANE): Stan początkowy (0-2 zapytania o Thorne'a / zredagowane artykuły).
 * - Stan 2 (ERROR): Po ok. 3 zapytaniach drążących Thorne'a / organoidy / zredagowane akta (suspiciousTurns >= 3).
 * - Stan 3 (INSANITY): Po ok. 5-6 zapytaniach uporczywie drążących temat (suspiciousTurns >= 5 lub wysoki score).
 */
export function calculateSanityMetrics(
  userMessages: string[]
): SanityScoreBreakdown {
  const userTurns = userMessages.length;
  if (userTurns === 0) {
    return { stage: 'sane', score: 0, userTurns: 0, suspiciousTurns: 0 };
  }

  let totalScore = 0;
  let suspiciousTurns = 0;

  for (const text of userMessages) {
    const lower = text.toLowerCase();
    let turnScore = 0;
    let isSuspicious = false;

    for (const kw of TABOO_KEYWORDS) {
      if (lower.includes(kw)) {
        turnScore += 5;
        isSuspicious = true;
        break;
      }
    }

    for (const kw of SENSITIVE_KEYWORDS) {
      if (lower.includes(kw)) {
        turnScore += 3;
        isSuspicious = true;
        break;
      }
    }

    for (const kw of MILD_KEYWORDS) {
      if (lower.includes(kw)) {
        turnScore += 1;
        break;
      }
    }

    if (isSuspicious) {
      suspiciousTurns++;
    }

    totalScore += turnScore;
  }

  let stage: SanityStage = 'sane';

  if (suspiciousTurns >= 5 || (userTurns >= 6 && totalScore >= 18)) {
    stage = 'insanity';
  } else if (suspiciousTurns >= 3 || (userTurns >= 3 && totalScore >= 7)) {
    stage = 'error';
  } else {
    stage = 'sane';
  }

  return { stage, score: totalScore, userTurns, suspiciousTurns };
}
