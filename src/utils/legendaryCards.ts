import { PromptItem, GameCategory, GameId, PlayMode } from '../types/game';
import { LEGENDARY_CARDS } from '../data/prompts/legendaryCards';
import { ONLINE_LEGENDARY_CARDS } from '../data/prompts/online/onlineLegendaryCards';
import { soundEffects } from './audio';
import confetti from 'canvas-confetti';

// Track used legendary card IDs in session to avoid repeats until exhausted
const usedLegendaryIds = new Set<string>();

/**
 * Checks if a prompt is a Rare Legendary Card.
 */
export function isPromptLegendary(prompt?: PromptItem | null): boolean {
  if (!prompt) return false;
  return prompt.isLegendary === true || prompt.rarity === 'legendary';
}

/**
 * Get an available legendary card for a category and game, respecting playMode.
 */
export function getLegendaryCardForCategory(
  category: GameCategory,
  gameId?: GameId,
  playMode: PlayMode = 'in-person'
): PromptItem | null {
  const sourceCards = playMode === 'online' ? ONLINE_LEGENDARY_CARDS : LEGENDARY_CARDS;
  let candidates = sourceCards.filter(c => c.category === category);
  if (gameId && gameId !== 'chaos-mix') {
    const gameMatching = candidates.filter(c => c.gameId === gameId);
    if (gameMatching.length > 0) candidates = gameMatching;
  }

  if (candidates.length === 0) return null;

  // Filter unused
  const unused = candidates.filter(c => !usedLegendaryIds.has(c.id));
  const pool = unused.length > 0 ? unused : candidates;
  if (unused.length === 0) {
    candidates.forEach(c => usedLegendaryIds.delete(c.id));
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  usedLegendaryIds.add(chosen.id);

  // If drawn in Chaos Mix, assign gameId to chaos-mix while retaining originGameId
  if (gameId === 'chaos-mix') {
    return {
      ...chosen,
      originGameId: chosen.gameId,
      gameId: 'chaos-mix',
    };
  }

  return chosen;
}

/**
 * Evaluates whether to upgrade a draw to a Rare Legendary Card (~2% chance, 1 in 50 cards).
 */
export function rollForLegendaryCard(
  chosenPrompt: PromptItem,
  category: GameCategory,
  gameId: GameId,
  chance: number = 0.02,
  playMode?: PlayMode
): PromptItem {
  // If the prompt is already legendary, keep it
  if (isPromptLegendary(chosenPrompt)) {
    return chosenPrompt;
  }

  const resolvedPlayMode: PlayMode =
    playMode ||
    chosenPrompt.playMode ||
    (chosenPrompt.id?.startsWith('on-') ? 'online' : 'in-person');

  // Rare roll for a category-specific legendary card
  if (Math.random() < chance) {
    const legendary = getLegendaryCardForCategory(category, gameId, resolvedPlayMode);
    if (legendary) {
      return legendary;
    }
  }

  return chosenPrompt;
}

/**
 * Triggers audio fanfare and golden sparkle confetti for a Legendary Card.
 */
export function triggerLegendaryCardEffects(prompt?: PromptItem | null) {
  if (!isPromptLegendary(prompt)) return;

  // Play epic golden audio fanfare
  soundEffects.playLegendaryCard();

  // Burst glowing gold/yellow confetti sparkles
  confetti({
    particleCount: 65,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#FACC15', '#F59E0B', '#FEF08A', '#FFFBEB', '#D97706'],
  });
}

