import { GameCategory, GameId, PlayMode, PromptItem } from '../types/game';
import { filterPromptsForScope } from './promptValidation';

const CACHE_KEY = 'jinxkiss_official_prompts_override_v1';
const listeners = new Set<() => void>();
let contentVersion = 0;
let memoryOverrides: PromptItem[] | undefined;
let useMemoryCache = false;

export function notifyPromptContentChanged() {
  contentVersion += 1;
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key === CACHE_KEY || event.key === null) {
    memoryOverrides = undefined;
    useMemoryCache = false;
    notifyPromptContentChanged();
  }
}

export function subscribePromptContent(listener: () => void) {
  if (!listeners.size) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener('storage', onStorage);
  };
}

export function getPromptContentVersion() {
  return contentVersion;
}

export function getCachedPromptOverrides(): PromptItem[] {
  if (useMemoryCache) return memoryOverrides || [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((p) => p && typeof p.id === 'string' && typeof p.text === 'string')
      : [];
  } catch {
    return memoryOverrides || [];
  }
}

export function cachePromptOverrides(prompts: PromptItem[]) {
  const changed = JSON.stringify(getCachedPromptOverrides()) !== JSON.stringify(prompts);
  memoryOverrides = prompts;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(prompts));
    useMemoryCache = false;
  } catch {
    useMemoryCache = true;
  }
  if (changed) notifyPromptContentChanged();
}

export function resolveLivePrompt(
  prompt: PromptItem | null,
  deck?: { cards: PromptItem[]; playMode?: PlayMode }
): PromptItem | null {
  if (!prompt) return null;
  const replacement = deck
    ? deck.cards.find((card) => card.id === prompt.id)
    : getCachedPromptOverrides().find((card) => card.id === prompt.id);
  if (deck && !replacement) return null;
  const latest = replacement
    ? { ...replacement, playMode: replacement.playMode || deck?.playMode || 'in-person' }
    : prompt;
  const sourceGame = prompt.originGameId || prompt.gameId;
  if (
    latest.isActive === false ||
    latest.category !== prompt.category ||
    (latest.playMode || 'in-person') !== (prompt.playMode || 'in-person') ||
    (latest.originGameId || latest.gameId) !== sourceGame ||
    (prompt.type && latest.type !== prompt.type)
  )
    return null;
  return prompt.gameId === 'chaos-mix' ? { ...latest, gameId: 'chaos-mix', originGameId: sourceGame } : latest;
}

export function mergePromptOverrides(
  defaults: PromptItem[],
  overrides: PromptItem[],
  mode: PlayMode,
  rare = false
): PromptItem[] {
  const merged = new Map(defaults.map((p) => [p.id, p]));
  for (const prompt of overrides) {
    if ((prompt.playMode || 'in-person') === mode && !!prompt.isLegendary === rare) merged.set(prompt.id, prompt);
    else merged.delete(prompt.id);
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
