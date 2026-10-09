import { GameCategory, GameId, PromptItem } from '../../types/game';
import { TRUTH_OR_DARE_PROMPTS } from './truthOrDare';
import { NEVER_HAVE_I_EVER_PROMPTS } from './neverHaveIEver';
import { WOULD_YOU_RATHER_PROMPTS } from './wouldYouRather';
import { HOT_TAKES_PROMPTS } from './hotTakes';
import { DARE_ROULETTE_PROMPTS } from './dareRoulette';
import { RED_FLAG_GREEN_FLAG_PROMPTS } from './redFlagGreenFlag';
import { TRUTH_OR_SIP_PROMPTS } from './truthOrSip';
import { POINT_AND_DRINK_PROMPTS } from './pointAndDrink';
import { MOST_LIKELY_TO_PROMPTS } from './mostLikelyTo';
import { IMPOSTER_PROMPTS } from './imposter';
import { WHOS_LYING_PROMPTS } from './whosLying';
import { CONFESSIONS_PROMPTS } from './confessions';

export const ALL_DEFAULT_PROMPTS: Record<GameId, PromptItem[]> = {
  'truth-or-dare': TRUTH_OR_DARE_PROMPTS,
  'never-have-i-ever': NEVER_HAVE_I_EVER_PROMPTS,
  'would-you-rather': WOULD_YOU_RATHER_PROMPTS,
  'hot-takes': HOT_TAKES_PROMPTS,
  'dare-roulette': DARE_ROULETTE_PROMPTS,
  'red-flag-green-flag': RED_FLAG_GREEN_FLAG_PROMPTS,
  'truth-or-sip': TRUTH_OR_SIP_PROMPTS,
  'point-and-drink': POINT_AND_DRINK_PROMPTS,
  'most-likely-to': MOST_LIKELY_TO_PROMPTS,
  'imposter': IMPOSTER_PROMPTS,
  'whos-lying': WHOS_LYING_PROMPTS,
  'confessions': CONFESSIONS_PROMPTS,
};

/**
 * Filter default prompts by game and category.
 * If 18+ is selected, Kids prompts are strictly excluded.
 * If Kids is selected, 18+ and Spicy prompts are strictly excluded.
 */
export function getDefaultPromptsForGame(gameId: GameId, category?: GameCategory): PromptItem[] {
  const allPrompts = ALL_DEFAULT_PROMPTS[gameId] || [];
  if (!category) return allPrompts;

  return allPrompts.filter(p => {
    if (category === 'kids') {
      return p.category === 'kids';
    }
    if (category === '18+') {
      return p.category === '18+';
    }
    return p.category === category;
  });
}

