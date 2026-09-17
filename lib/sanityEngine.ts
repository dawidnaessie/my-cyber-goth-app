import { SanityStage } from './prompts';

export interface SanityScoreBreakdown {
  stage: SanityStage;
  score: number;
  userTurns: number;
}

// 1. Kategoria Łagodna: Fizjologia ogólna i delikatne dociekania (waga: 1 pkt/tura)
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
];

// 2. Kategoria Wrażliwa: Konkretne ślady archiwalne i personalne (waga: 3 pkt/tura)
export const SENSITIVE_KEYWORDS = [
  'aris',
  'thorne',
  'dr thorne',
  'dr aris thorne',
  'doktor thorne',
  'sektor 7',
  'sektor-7',
  'sektor',
  's7-1994-088',
  'zaginiony',
  'protokół',
  'protokol',
  'konektom',
  'mikroelektrod',
  'mikrosond',
  'subiculum',
  'entorhinal',
];

// 3. Kategoria Tabu: Procedura dekonstrukcji, perfuzja, utylizacja (waga: 5 pkt/tura)
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
  'śmierć mózgow',
  'smierc mozgow',
];

/**
 * Oblicza stan psychiki (Sanity) wyłącznie na podstawie zapytań użytkownika.
 *
 * Progi odporności klastra (Płynna progresja):
 * - SANE: Zawsze stan początkowy; utrzymuje się minimum przez pierwsze 2-3 tury (dopóki score < 6 lub userTurns < 3).
 * - ERROR: Wymaga co najmniej 3 głębszych tur ORAZ osiągnięcia progu score >= 6.
 * - INSANITY: Ostateczny stan dekompozycji – wymaga co najmniej 6 tur ORAZ score >= 18 (uporczywe drążenie tabu).
 */
export function calculateSanityMetrics(
  userMessages: string[]
): SanityScoreBreakdown {
  const userTurns = userMessages.length;
  if (userTurns === 0) {
    return { stage: 'sane', score: 0, userTurns: 0 };
  }

  let totalScore = 0;

  for (const text of userMessages) {
    const lower = text.toLowerCase();
    let turnScore = 0;

    for (const kw of MILD_KEYWORDS) {
      if (lower.includes(kw)) {
        turnScore += 1;
        break;
      }
    }

    for (const kw of SENSITIVE_KEYWORDS) {
      if (lower.includes(kw)) {
        turnScore += 3;
        break;
      }
    }

    for (const kw of TABOO_KEYWORDS) {
      if (lower.includes(kw)) {
        turnScore += 5;
        break;
      }
    }

    totalScore += turnScore;
  }

  let stage: SanityStage = 'sane';

  // Płynna progresja z buforem odporności
  if (userTurns >= 6 && totalScore >= 18) {
    stage = 'insanity';
  } else if (userTurns >= 3 && totalScore >= 6) {
    stage = 'error';
  } else {
    stage = 'sane';
  }

  return { stage, score: totalScore, userTurns };
}
