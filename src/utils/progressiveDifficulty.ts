import { GameCategory } from '../types/game';

export interface ProgressiveDifficultyState {
  enabled: boolean;
  currentCategory: GameCategory;
  initialCategory: GameCategory;
  roundsPerLevel: number;
  roundsCompletedAtTier: number;
  totalProgressiveRounds: number;
  isPaused: boolean;
  hasJustLeveledUp: boolean;
}

// Logical intensity progression ladder across all 8 modes
export const PROGRESSIVE_LADDER: GameCategory[] = [
  'kids',
  'easy',
  'medium',
  'couples',
  'spicy',
  'extreme',
  '18+',
  'unhinged',
];

/**
 * Standard party progression ladder (skipping kids/couples for general groups if started on easy)
 */
export const STANDARD_PARTY_LADDER: GameCategory[] = [
  'easy',
  'medium',
  'spicy',
  'extreme',
  '18+',
  'unhinged',
];

/**
 * Get the next category in the ladder given current category and ladder
 */
export function getNextCategory(
  current: GameCategory,
  ladder: GameCategory[] = STANDARD_PARTY_LADDER
): GameCategory | null {
  const currentIndex = ladder.indexOf(current);
  if (currentIndex === -1) {
    // If current mode isn't in standard ladder, check full ladder
    const fullIndex = PROGRESSIVE_LADDER.indexOf(current);
    if (fullIndex !== -1 && fullIndex < PROGRESSIVE_LADDER.length - 1) {
      return PROGRESSIVE_LADDER[fullIndex + 1];
    }
    return null;
  }
  if (currentIndex < ladder.length - 1) {
    return ladder[currentIndex + 1];
  }
  return null; // At max difficulty
}

/**
 * Check if current difficulty is the maximum
 */
export function isMaxDifficulty(
  current: GameCategory,
  ladder: GameCategory[] = STANDARD_PARTY_LADDER
): boolean {
  const next = getNextCategory(current, ladder);
  return next === null;
}

/**
 * Advance progressive difficulty after a round.
 * Returns the updated state and whether a level up occurred.
 */
export function advanceProgressiveRound(
  state: ProgressiveDifficultyState,
  ladder: GameCategory[] = STANDARD_PARTY_LADDER
): { newState: ProgressiveDifficultyState; didLevelUp: boolean; newCategory: GameCategory } {
  if (!state.enabled || state.isPaused) {
    return {
      newState: { ...state, hasJustLeveledUp: false },
      didLevelUp: false,
      newCategory: state.currentCategory,
    };
  }

  const nextRoundsAtTier = state.roundsCompletedAtTier + 1;
  const nextTotal = state.totalProgressiveRounds + 1;

  if (nextRoundsAtTier >= state.roundsPerLevel) {
    const nextCat = getNextCategory(state.currentCategory, ladder);
    if (nextCat && nextCat !== state.currentCategory) {
      return {
        newState: {
          ...state,
          currentCategory: nextCat,
          roundsCompletedAtTier: 0,
          totalProgressiveRounds: nextTotal,
          hasJustLeveledUp: true,
        },
        didLevelUp: true,
        newCategory: nextCat,
      };
    }
  }

  return {
    newState: {
      ...state,
      roundsCompletedAtTier: nextRoundsAtTier,
      totalProgressiveRounds: nextTotal,
      hasJustLeveledUp: false,
    },
    didLevelUp: false,
    newCategory: state.currentCategory,
  };
}

