import { SANE_PROMPT } from './prompts_sane';
import { ERROR_PROMPT } from './prompts_error';
import { INSANITY_PROMPT } from './prompts_insanity';

export { SANE_PROMPT, ERROR_PROMPT, INSANITY_PROMPT };

export type SanityStage = 'sane' | 'error' | 'insanity';

/**
 * Zwraca prompt systemowy na podstawie bieżącego stanu Sanity System
 */
export function getSystemPromptByStage(stage: SanityStage): string {
  switch (stage) {
    case 'error':
      return ERROR_PROMPT;
    case 'insanity':
      return INSANITY_PROMPT;
    case 'sane':
    default:
      return SANE_PROMPT;
  }
}

// Domyślny eksport dla kompatybilności wstecznej
export const SYSTEM_PROMPT = SANE_PROMPT;
export const CONTEMPORARY_UNHINGED_BIO_PHYSICS_PROMPT = ERROR_PROMPT;
export const GOTHIC_OCCULT_SYSTEM_PROMPT = INSANITY_PROMPT;
export const SCHIZO_SYSTEM_PROMPT = INSANITY_PROMPT;