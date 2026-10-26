import { GameCategory, GameId, PlayMode, PromptItem } from '../types/game';
import { filterPromptsForScope } from './promptValidation';

const CACHE_KEY = 'jinxkiss_official_prompts_override_v1';

export function getCachedPromptOverrides(): PromptItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((p) => p && typeof p.id === 'string' && typeof p.text === 'string')
      : [];
  } catch {
    return [];
  }
}

export function cachePromptOverrides(prompts: PromptItem[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(prompts));
  } catch {
    /* Games may still use bundled content when browser storage is unavailable. */
  }
}

export function mergePromptOverrides(
  defaults: PromptItem[],
  overrides: PromptItem[],
  mode: PlayMode,
  rare = false
): PromptItem[] {
  const merged = new Map(defaults.map((p) => [p.id, p]));
  for (const prompt of overrides) {
    merged.delete(prompt.id);
    if ((prompt.playMode || 'in-person') === mode && !!prompt.isLegendary === rare) merged.set(prompt.id, prompt);
  }
  return [...merged.values()].filter((p) => (p.playMode || 'in-person') === mode && !!p.isLegendary === rare);
}

export function getCachedGamePrompts(
  catalog: Record<GameId, PromptItem[]>,
  gameId: GameId,
  category: GameCategory | undefined,
  mode: PlayMode
): PromptItem[] {
  const source = Object.entries(catalog)
    .filter(([id]) => id !== 'chaos-mix')
    .flatMap(([, prompts]) => prompts);
  let pool = mergePromptOverrides(source, getCachedPromptOverrides(), mode);
  if (gameId === 'chaos-mix') pool = pool.map((p) => ({ ...p, originGameId: p.gameId, gameId: 'chaos-mix' }));
  return filterPromptsForScope(pool, gameId, category, mode);
}
