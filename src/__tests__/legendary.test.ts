import { describe, it, expect } from 'vitest';
import { GameCategory } from '../types/game';
import { LEGENDARY_CARDS } from '../data/prompts/legendaryCards';
import {
  isPromptLegendary,
  getLegendaryCardForCategory,
  rollForLegendaryCard,
} from '../utils/legendaryCards';

describe('Rare Legendary Cards System', () => {
  const allCategories: GameCategory[] = [
    'kids',
    'easy',
    'medium',
    'extreme',
    'unhinged',
    'couples',
    'spicy',
    '18+',
  ];

  it('contains legendary cards for every single category', () => {
    allCategories.forEach((cat) => {
      const cardsInCat = LEGENDARY_CARDS.filter((c) => c.category === cat);
      expect(cardsInCat.length).toBeGreaterThan(0);
      cardsInCat.forEach((card) => {
        expect(card.isLegendary).toBe(true);
        expect(card.rarity).toBe('legendary');
        expect(card.legendaryTitle).toBeDefined();
        expect(typeof card.legendaryTitle).toBe('string');
        expect(card.text.length).toBeGreaterThan(10);
      });
    });
  });

  it('correctly identifies legendary cards with isPromptLegendary', () => {
    const legendary = LEGENDARY_CARDS[0];
    expect(isPromptLegendary(legendary)).toBe(true);

    const commonCard = {
      id: 'common-test-card',
      gameId: 'truth-or-dare' as const,
      category: 'medium' as const,
      text: 'Normal prompt without legendary status',
    };
    expect(isPromptLegendary(commonCard)).toBe(false);
    expect(isPromptLegendary(null)).toBe(false);
  });

  it('retrieves category-fitting legendary cards via getLegendaryCardForCategory', () => {
    allCategories.forEach((cat) => {
      const card = getLegendaryCardForCategory(cat);
      expect(card).not.toBeNull();
      expect(card?.category).toBe(cat);
      expect(card?.isLegendary).toBe(true);
      expect(card?.rarity).toBe('legendary');
    });
  });

  it('rolls a legendary card when chance is 1 (guaranteed roll)', () => {
    const fallback = {
      id: 'base-card-1',
      gameId: 'truth-or-dare' as const,
      category: 'extreme' as const,
      text: 'Standard dare',
    };

    const rolled = rollForLegendaryCard(fallback, 'extreme', 'truth-or-dare', 1.0);
    expect(isPromptLegendary(rolled)).toBe(true);
    expect(rolled.category).toBe('extreme');
    expect(rolled.isLegendary).toBe(true);
  });

  it('retains the fallback card when chance is 0 (no roll)', () => {
    const fallback = {
      id: 'base-card-2',
      gameId: 'truth-or-dare' as const,
      category: 'spicy' as const,
      text: 'Standard spicy prompt',
    };

    const rolled = rollForLegendaryCard(fallback, 'spicy', 'truth-or-dare', 0);
    expect(rolled.id).toBe(fallback.id);
    expect(isPromptLegendary(rolled)).toBe(false);
  });
});
