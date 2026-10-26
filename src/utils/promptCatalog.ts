import { GameId, PlayMode, PromptItem } from '../types/game';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { getPromptValidationErrors, promptContentKey } from './promptValidation';

/** Build each game from its own validated cards; only Chaos Mix combines games. */
export function createPromptCatalog(prompts: PromptItem[], playMode: PlayMode): Record<GameId, PromptItem[]> {
  const catalog = Object.fromEntries(Object.keys(GAMES_CONFIG).map(id => [id, [] as PromptItem[]])) as Record<GameId, PromptItem[]>;
  const ids = new Set<string>();
  const content = new Set<string>();
  for (const prompt of prompts) {
    const errors = getPromptValidationErrors(prompt);
    if (prompt.gameId === 'chaos-mix' || (prompt.playMode || 'in-person') !== playMode || errors.length) {
      throw new Error(`Invalid official card ${prompt.id}: ${errors.join(' ') || 'Incorrect game or play mode.'}`);
    }
    if (ids.has(prompt.id)) throw new Error(`Duplicate official card ID: ${prompt.id}`);
    ids.add(prompt.id);
    const key = promptContentKey(prompt);
    if (content.has(key)) continue;
    content.add(key);
    catalog[prompt.gameId].push(prompt);
  }
  catalog['chaos-mix'] = Object.values(catalog).flat().map(prompt => ({
    ...prompt,
    originGameId: prompt.gameId,
    gameId: 'chaos-mix',
  }));
  return catalog;
}
