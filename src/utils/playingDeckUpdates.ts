import { CustomDeck } from '../types/deck';
import { notifyPromptContentChanged } from './promptOverrides';

const decks = new Map<string, CustomDeck>();
export function cachePlayingDeck(deck: CustomDeck) {
  if (JSON.stringify(decks.get(deck.id)) === JSON.stringify(deck)) return;
  decks.set(deck.id, deck);
  notifyPromptContentChanged();
}
export function getPlayingDeck(id: string) {
  return decks.get(id);
}
