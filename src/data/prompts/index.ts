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
import { HOT_SEAT_PROMPTS } from './hotSeat';

const STANDALONE_PROMPTS: PromptItem[] = [
  ...TRUTH_OR_DARE_PROMPTS,
  ...NEVER_HAVE_I_EVER_PROMPTS,
  ...WOULD_YOU_RATHER_PROMPTS,
  ...HOT_TAKES_PROMPTS,
  ...DARE_ROULETTE_PROMPTS,
  ...RED_FLAG_GREEN_FLAG_PROMPTS,
  ...TRUTH_OR_SIP_PROMPTS,
  ...POINT_AND_DRINK_PROMPTS,
  ...MOST_LIKELY_TO_PROMPTS,
  ...IMPOSTER_PROMPTS,
  ...WHOS_LYING_PROMPTS,
  ...CONFESSIONS_PROMPTS,
  ...HOT_SEAT_PROMPTS,
];

export const CHAOS_MIX_PROMPTS: PromptItem[] = STANDALONE_PROMPTS.map(p => ({
  ...p,
  originGameId: p.gameId,
  gameId: 'chaos-mix',
}));

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
  'hot-seat': HOT_SEAT_PROMPTS,
  'chaos-mix': CHAOS_MIX_PROMPTS,
};

/**
 * Filter default prompts by game and category.
 */
export function getDefaultPromptsForGame(gameId: GameId, category?: GameCategory): PromptItem[] {
  const allPrompts = ALL_DEFAULT_PROMPTS[gameId] || [];
  if (!category) return allPrompts;
  return allPrompts.filter(p => p.category === category);
}
