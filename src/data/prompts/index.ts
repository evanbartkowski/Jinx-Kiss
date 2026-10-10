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
import { CONFESSIONS_PROMPTS } from './confessions';
import { HOT_SEAT_PROMPTS } from './hotSeat';
import { MASTER_COLLECTION_PROMPTS } from './masterCollection';
import { PREMIUM_EXPANSION_PROMPTS } from './premiumExpansion';
import { LEGENDARY_CARDS } from './legendaryCards';
import { INTERNET_VIRAL_PROMPTS } from './internetViralPrompts';

const MASTER_PROMPTS_BY_GAME = MASTER_COLLECTION_PROMPTS.reduce((acc, p) => {
  if (!acc[p.gameId]) acc[p.gameId] = [];
  acc[p.gameId].push(p);
  return acc;
}, {} as Record<GameId, PromptItem[]>);

const EXPANSION_PROMPTS_BY_GAME = PREMIUM_EXPANSION_PROMPTS.reduce((acc, p) => {
  if (!acc[p.gameId]) acc[p.gameId] = [];
  acc[p.gameId].push(p);
  return acc;
}, {} as Record<GameId, PromptItem[]>);

const VIRAL_PROMPTS_BY_GAME = INTERNET_VIRAL_PROMPTS.reduce((acc, p) => {
  if (!acc[p.gameId]) acc[p.gameId] = [];
  acc[p.gameId].push(p);
  return acc;
}, {} as Record<GameId, PromptItem[]>);

const LEGENDARY_PROMPTS_BY_GAME = LEGENDARY_CARDS.reduce((acc, p) => {
  if (!acc[p.gameId]) acc[p.gameId] = [];
  acc[p.gameId].push(p);
  return acc;
}, {} as Record<GameId, PromptItem[]>);

const STANDALONE_PROMPTS: PromptItem[] = [
  ...LEGENDARY_CARDS,
  ...INTERNET_VIRAL_PROMPTS,
  ...PREMIUM_EXPANSION_PROMPTS,
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
];

export const CHAOS_MIX_PROMPTS: PromptItem[] = STANDALONE_PROMPTS.map(p => ({
  ...p,
  originGameId: p.gameId,
  gameId: 'chaos-mix',
}));

export const ALL_DEFAULT_PROMPTS: Record<GameId, PromptItem[]> = {
  'truth-or-dare': [...(LEGENDARY_PROMPTS_BY_GAME['truth-or-dare'] || []), ...(VIRAL_PROMPTS_BY_GAME['truth-or-dare'] || []), ...(EXPANSION_PROMPTS_BY_GAME['truth-or-dare'] || []), ...TRUTH_OR_DARE_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['truth-or-dare'] || [])],
  'never-have-i-ever': [...(LEGENDARY_PROMPTS_BY_GAME['never-have-i-ever'] || []), ...(VIRAL_PROMPTS_BY_GAME['never-have-i-ever'] || []), ...(EXPANSION_PROMPTS_BY_GAME['never-have-i-ever'] || []), ...NEVER_HAVE_I_EVER_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['never-have-i-ever'] || [])],
  'would-you-rather': [...(LEGENDARY_PROMPTS_BY_GAME['would-you-rather'] || []), ...(VIRAL_PROMPTS_BY_GAME['would-you-rather'] || []), ...(EXPANSION_PROMPTS_BY_GAME['would-you-rather'] || []), ...WOULD_YOU_RATHER_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['would-you-rather'] || [])],
  'hot-takes': [...(LEGENDARY_PROMPTS_BY_GAME['hot-takes'] || []), ...(VIRAL_PROMPTS_BY_GAME['hot-takes'] || []), ...(EXPANSION_PROMPTS_BY_GAME['hot-takes'] || []), ...HOT_TAKES_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['hot-takes'] || [])],
  'dare-roulette': [...(LEGENDARY_PROMPTS_BY_GAME['dare-roulette'] || []), ...(VIRAL_PROMPTS_BY_GAME['dare-roulette'] || []), ...(EXPANSION_PROMPTS_BY_GAME['dare-roulette'] || []), ...DARE_ROULETTE_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['dare-roulette'] || [])],
  'red-flag-green-flag': [...(LEGENDARY_PROMPTS_BY_GAME['red-flag-green-flag'] || []), ...(VIRAL_PROMPTS_BY_GAME['red-flag-green-flag'] || []), ...(EXPANSION_PROMPTS_BY_GAME['red-flag-green-flag'] || []), ...RED_FLAG_GREEN_FLAG_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['red-flag-green-flag'] || [])],
  'truth-or-sip': [...(LEGENDARY_PROMPTS_BY_GAME['truth-or-sip'] || []), ...(VIRAL_PROMPTS_BY_GAME['truth-or-sip'] || []), ...(EXPANSION_PROMPTS_BY_GAME['truth-or-sip'] || []), ...TRUTH_OR_SIP_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['truth-or-sip'] || [])],
  'point-and-drink': [...(LEGENDARY_PROMPTS_BY_GAME['point-and-drink'] || []), ...(VIRAL_PROMPTS_BY_GAME['point-and-drink'] || []), ...(EXPANSION_PROMPTS_BY_GAME['point-and-drink'] || []), ...POINT_AND_DRINK_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['point-and-drink'] || [])],
  'most-likely-to': [...(LEGENDARY_PROMPTS_BY_GAME['most-likely-to'] || []), ...(VIRAL_PROMPTS_BY_GAME['most-likely-to'] || []), ...(EXPANSION_PROMPTS_BY_GAME['most-likely-to'] || []), ...MOST_LIKELY_TO_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['most-likely-to'] || [])],
  'confessions': [...(LEGENDARY_PROMPTS_BY_GAME['confessions'] || []), ...(VIRAL_PROMPTS_BY_GAME['confessions'] || []), ...(EXPANSION_PROMPTS_BY_GAME['confessions'] || []), ...CONFESSIONS_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['confessions'] || [])],
  'hot-seat': [...(LEGENDARY_PROMPTS_BY_GAME['hot-seat'] || []), ...(VIRAL_PROMPTS_BY_GAME['hot-seat'] || []), ...(EXPANSION_PROMPTS_BY_GAME['hot-seat'] || []), ...HOT_SEAT_PROMPTS, ...(MASTER_PROMPTS_BY_GAME['hot-seat'] || [])],
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

export { MASTER_COLLECTION_PROMPTS };
