import { GameCategory, GameId, PromptItem } from '../../../types/game';
import { ONLINE_TRUTH_OR_DARE_PROMPTS } from './onlineTruthOrDare';
import { ONLINE_NEVER_HAVE_I_EVER_PROMPTS } from './onlineNeverHaveIEver';
import { ONLINE_WOULD_YOU_RATHER_PROMPTS } from './onlineWouldYouRather';
import { ONLINE_HOT_TAKES_PROMPTS } from './onlineHotTakes';
import { ONLINE_DARE_ROULETTE_PROMPTS } from './onlineDareRoulette';
import { ONLINE_RED_FLAG_GREEN_FLAG_PROMPTS } from './onlineRedFlagGreenFlag';
import { ONLINE_TRUTH_OR_SIP_PROMPTS } from './onlineTruthOrSip';
import { ONLINE_POINT_AND_DRINK_PROMPTS } from './onlinePointAndDrink';
import {
  ONLINE_MOST_LIKELY_TO_PROMPTS,
  ONLINE_CONFESSIONS_PROMPTS,
  ONLINE_HOT_SEAT_PROMPTS,
} from './onlineOtherGames';
import { ONLINE_LEGENDARY_CARDS } from './onlineLegendaryCards';

export {
  ONLINE_TRUTH_OR_DARE_PROMPTS,
  ONLINE_NEVER_HAVE_I_EVER_PROMPTS,
  ONLINE_WOULD_YOU_RATHER_PROMPTS,
  ONLINE_HOT_TAKES_PROMPTS,
  ONLINE_DARE_ROULETTE_PROMPTS,
  ONLINE_RED_FLAG_GREEN_FLAG_PROMPTS,
  ONLINE_TRUTH_OR_SIP_PROMPTS,
  ONLINE_POINT_AND_DRINK_PROMPTS,
  ONLINE_MOST_LIKELY_TO_PROMPTS,
  ONLINE_CONFESSIONS_PROMPTS,
  ONLINE_HOT_SEAT_PROMPTS,
  ONLINE_LEGENDARY_CARDS,
};

const ONLINE_STANDALONE_PROMPTS: PromptItem[] = [
  ...ONLINE_TRUTH_OR_DARE_PROMPTS,
  ...ONLINE_NEVER_HAVE_I_EVER_PROMPTS,
  ...ONLINE_WOULD_YOU_RATHER_PROMPTS,
  ...ONLINE_HOT_TAKES_PROMPTS,
  ...ONLINE_DARE_ROULETTE_PROMPTS,
  ...ONLINE_RED_FLAG_GREEN_FLAG_PROMPTS,
  ...ONLINE_TRUTH_OR_SIP_PROMPTS,
  ...ONLINE_POINT_AND_DRINK_PROMPTS,
  ...ONLINE_MOST_LIKELY_TO_PROMPTS,
  ...ONLINE_CONFESSIONS_PROMPTS,
  ...ONLINE_HOT_SEAT_PROMPTS,
];

export const ONLINE_CHAOS_MIX_PROMPTS: PromptItem[] = ONLINE_STANDALONE_PROMPTS.map(p => ({
  ...p,
  originGameId: p.gameId,
  gameId: 'chaos-mix',
  playMode: 'online',
}));

export const ALL_ONLINE_PROMPTS: Record<GameId, PromptItem[]> = {
  'truth-or-dare': ONLINE_TRUTH_OR_DARE_PROMPTS,
  'never-have-i-ever': ONLINE_NEVER_HAVE_I_EVER_PROMPTS,
  'would-you-rather': ONLINE_WOULD_YOU_RATHER_PROMPTS,
  'hot-takes': ONLINE_HOT_TAKES_PROMPTS,
  'dare-roulette': ONLINE_DARE_ROULETTE_PROMPTS,
  'red-flag-green-flag': ONLINE_RED_FLAG_GREEN_FLAG_PROMPTS,
  'truth-or-sip': ONLINE_TRUTH_OR_SIP_PROMPTS,
  'point-and-drink': ONLINE_POINT_AND_DRINK_PROMPTS,
  'most-likely-to': ONLINE_MOST_LIKELY_TO_PROMPTS,
  'confessions': ONLINE_CONFESSIONS_PROMPTS,
  'hot-seat': ONLINE_HOT_SEAT_PROMPTS,
  'chaos-mix': ONLINE_CHAOS_MIX_PROMPTS,
};

/**
 * Filter online prompts by game and category.
 */
export function getOnlinePromptsForGame(gameId: GameId, category?: GameCategory): PromptItem[] {
  const allPrompts = ALL_ONLINE_PROMPTS[gameId] || [];
  if (!category) return allPrompts;
  return allPrompts.filter(p => p.category === category);
}

