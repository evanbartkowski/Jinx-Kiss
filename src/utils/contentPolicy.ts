import { GameCategory, PartyModeConfig } from '../types/game';

export function requiresAdultConfirmation(category: GameCategory): boolean {
  return category === '18+' || category === 'unhinged';
}

export function partyRequiresAdultConfirmation(config: PartyModeConfig): boolean {
  if (config.contentBoundary === 'kids-only' || config.contentBoundary === 'clean') return false;
  return config.contentBoundary === 'adults-only' || !!config.enableProgressiveDifficulty || config.categories.some(requiresAdultConfirmation);
}
