import { GameCategory, GameId, PlayMode, PromptItem } from '../../types/game';
import { ALL_ONLINE_PROMPTS, getOnlinePromptsForGame, ONLINE_STANDALONE_PROMPTS } from './online';
import { TRUTH_OR_DARE_PROMPTS } from './truthOrDare';
import { NEVER_HAVE_I_EVER_PROMPTS } from './neverHaveIEver';
import { WOULD_YOU_RATHER_PROMPTS } from './wouldYouRather';
import { HOT_TAKES_PROMPTS } from './hotTakes';
import { DARE_ROULETTE_PROMPTS } from './dareRoulette';
import { RED_FLAG_GREEN_FLAG_PROMPTS } from './redFlagGreenFlag';
import { TRUTH_OR_SIP_PROMPTS } from './truthOrSip';
import { POINT_AND_DRINK_PROMPTS } from './pointAndDrink';
import { MOST_LIKELY_TO_PROMPTS } from './mostLikelyTo';
import { CONFESSIONS_PROMPTS } from './confessions';
import { HOT_SEAT_PROMPTS } from './hotSeat';
import { MASTER_COLLECTION_PROMPTS } from './masterCollection';
import { PREMIUM_EXPANSION_PROMPTS } from './premiumExpansion';
import { INTERNET_VIRAL_PROMPTS } from './internetViralPrompts';
import { MASTER_EXPANSION_V2_PROMPTS } from './masterExpansionV2';
import { MEGA_EXPANSION_800_PROMPTS } from './megaExpansion800';
import { createPromptCatalog } from '../../utils/promptCatalog';
import { filterPromptsForScope } from '../../utils/promptValidation';
import { EDITORIAL_SPOTLIGHT_PROMPTS } from './editorialSpotlights';

export const ALL_DEFAULT_PROMPTS = createPromptCatalog([
  ...EDITORIAL_SPOTLIGHT_PROMPTS,
  ...TRUTH_OR_DARE_PROMPTS,
  ...NEVER_HAVE_I_EVER_PROMPTS,
  ...WOULD_YOU_RATHER_PROMPTS,
  ...HOT_TAKES_PROMPTS,
  ...DARE_ROULETTE_PROMPTS,
  ...RED_FLAG_GREEN_FLAG_PROMPTS,
  ...TRUTH_OR_SIP_PROMPTS,
  ...POINT_AND_DRINK_PROMPTS,
  ...MOST_LIKELY_TO_PROMPTS,
  ...CONFESSIONS_PROMPTS,
  ...HOT_SEAT_PROMPTS,
  ...MASTER_COLLECTION_PROMPTS,
  ...PREMIUM_EXPANSION_PROMPTS,
  ...INTERNET_VIRAL_PROMPTS,
  ...MASTER_EXPANSION_V2_PROMPTS,
  ...MEGA_EXPANSION_800_PROMPTS,
], 'in-person');

export const CHAOS_MIX_PROMPTS = ALL_DEFAULT_PROMPTS['chaos-mix'];

export function getDefaultPromptsForGame(gameId: GameId, category?: GameCategory): PromptItem[] {
  return filterPromptsForScope(ALL_DEFAULT_PROMPTS[gameId] || [], gameId, category);
}

export function getPromptsForGame(gameId: GameId, category?: GameCategory, playMode: PlayMode = 'in-person'): PromptItem[] {
  return playMode === 'online' ? getOnlinePromptsForGame(gameId, category) : getDefaultPromptsForGame(gameId, category);
}

export { MASTER_COLLECTION_PROMPTS, ALL_ONLINE_PROMPTS, getOnlinePromptsForGame, ONLINE_STANDALONE_PROMPTS };
