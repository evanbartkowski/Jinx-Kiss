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
import { getCachedGamePrompts } from '../../../utils/promptOverrides';
import { createPromptCatalog } from '../../../utils/promptCatalog';
import { ONLINE_EDITORIAL_SPOTLIGHT_PROMPTS } from '../editorialSpotlights';
import { ONLINE_UNHINGED_PROMPTS } from '../unhinged';
import { RESEARCHED_ONLINE_PROMPTS } from '../researchedPrompts';

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

export const ONLINE_STANDALONE_PROMPTS: PromptItem[] = [
  ...RESEARCHED_ONLINE_PROMPTS,
  ...ONLINE_UNHINGED_PROMPTS,
  ...ONLINE_EDITORIAL_SPOTLIGHT_PROMPTS,
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

export const ALL_ONLINE_PROMPTS = createPromptCatalog(ONLINE_STANDALONE_PROMPTS, 'online');
export const ONLINE_CHAOS_MIX_PROMPTS = ALL_ONLINE_PROMPTS['chaos-mix'];

/**
 * Filter online prompts by game and category.
 */
export function getOnlinePromptsForGame(gameId: GameId, category?: GameCategory): PromptItem[] {
  return getCachedGamePrompts(ALL_ONLINE_PROMPTS, gameId, category, 'online');
}

