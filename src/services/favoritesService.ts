import { PromptItem } from '../types/game';

const LOCAL_FAVORITES_KEY = 'jinx_favorite_cards';

export const favoritesService = {
  getFavorites(): PromptItem[] {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
    } catch {
      return [];
    }
  },

  isFavorite(cardId: string): boolean {
    const list = this.getFavorites();
    return list.some(item => item.id === cardId);
  },

  toggleFavorite(card: PromptItem): boolean {
    const list = this.getFavorites();
    const index = list.findIndex(item => item.id === card.id);
    let isNowFavorite = false;

    if (index >= 0) {
      list.splice(index, 1);
      isNowFavorite = false;
    } else {
      list.unshift(card);
      isNowFavorite = true;
    }

    try {
      localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(list));
    } catch {
      // storage limit
    }

    return isNowFavorite;
  },
};
