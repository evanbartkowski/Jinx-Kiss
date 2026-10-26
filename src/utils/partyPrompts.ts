import { GameCategory, GameId, PartyModeConfig, PromptItem } from '../types/game';
import { getPromptsForGame } from '../data/prompts';

export function getPartyCategories(config: PartyModeConfig, preferred?: GameCategory): GameCategory[] {
  if (config.contentBoundary === 'kids-only') return ['kids'];
  if (config.contentBoundary === 'adults-only') return ['18+'];
  const selected = preferred ? [preferred] : config.categories;
  const allowed = config.contentBoundary === 'clean' ? selected.filter(c => c !== '18+' && c !== 'spicy') : selected;
  return allowed.length ? allowed : [config.contentBoundary === 'clean' ? 'easy' : 'medium'];
}

/** Empty categories stay empty instead of falling back to an unfiltered game. */
export function getPartyPromptPool(gameId: GameId, config: PartyModeConfig, preferred?: GameCategory): PromptItem[] {
  return getPartyCategories(config, preferred).flatMap(category => getPromptsForGame(gameId, category, config.playMode || 'in-person'));
}
