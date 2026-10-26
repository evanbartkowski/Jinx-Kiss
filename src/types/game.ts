export type GameId = 
  | 'truth-or-dare'
  | 'never-have-i-ever'
  | 'would-you-rather'
  | 'hot-takes'
  | 'dare-roulette'
  | 'red-flag-green-flag'
  | 'truth-or-sip'
  | 'point-and-drink'
  | 'most-likely-to'
  | 'confessions'
  | 'chaos-mix'
  | 'hot-seat';

export type GameCategory = 
  | 'easy'
  | 'medium'
  | 'extreme'
  | 'unhinged'
  | 'couples'
  | '18+'
  | 'spicy'
  | 'kids';

export type PlayMode = 'in-person' | 'online';

export interface GameMetadata {
  id: GameId;
  title: string;
  tagline: string;
  description: string;
  themeColor: string; // Hex color
  glowClass: string;
  iconName: string;
  applicableCategories: GameCategory[];
  playerMode: 'shared' | 'solo' | 'names-required';
  kidsAlternativeTitle?: string;
  kidsAlternativeTagline?: string;
}

export interface PromptItem {
  id: string;
  gameId: GameId;
  category: GameCategory;
  text: string;
  type?: 'truth' | 'dare'; // For Truth or Dare
  optionA?: string;        // For Would You Rather
  optionB?: string;        // For Would You Rather
  discussionPrompt?: string; // For Hot Takes
  scenario?: string;       // For Red Flag Green Flag
  forfeit?: string;        // For Truth or Sip / Forfeits
  authorUsername?: string;
  isCommunity?: boolean;
  isActive?: boolean;
  // New game-specific fields
  secretWord?: string;     // For Imposter
  imposterClue?: string;   // For Imposter category hint
  claimA?: string;         // For Who's Lying (Two Truths and a Lie)
  claimB?: string;
  claimC?: string;
  lieIndex?: 0 | 1 | 2;    // Index of the fake claim
  isReal?: boolean;        // For single outrageous fact
  explanation?: string;    // Reveal explanation for Who's Lying
  confessionStarter?: string; // For Confessions prompt
  originGameId?: GameId;   // For Chaos Mix cards
  isLegendary?: boolean;   // For rare legendary category cards
  legendaryTitle?: string; // Banner title for legendary card (e.g. ★ LEGENDARY DARE ★)
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  playMode?: PlayMode;     // 'in-person' | 'online' (defaults to in-person)
  provenance?: {
    sourceId: string;
    relationship: 'licensed-copy' | 'format-inspired';
    originalItemId?: string;
  };
}

export interface PlayerScore {
  name: string;
  score: number;
  votesReceived?: number;
}

export type ChaosWheelResultId =
  | 'random-truth'
  | 'random-dare'
  | 'mystery-card'
  | 'double-points'
  | 'player-swap'
  | 'everyone-votes'
  | 'group-challenge'
  | 'choose-player'
  | 'bonus-round'
  | 'reverse-turn'
  | 'wildcard'
  | 'secret-mission';

export interface ChaosWheelSegment {
  id: ChaosWheelResultId;
  label: string;
  description: string;
  color: string;
  iconName: string;
}

export interface MysteryCard {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'modifier' | 'secret-vote' | 'bonus' | 'chaos';
  durationRounds?: number;
  points?: number;
}

export interface SecretMission {
  id: string;
  mission: string;
  rewardPoints: number;
  condition: string;
}

export interface PartyModeConfig {
  playerNames: string[];
  selectedGames: GameId[];
  categories: GameCategory[];
  roundCount: number | 'endless';
  enableChaosWheel: boolean;
  enableMysteryCards: boolean;
  enableScoring: boolean;
  timerSeconds: number; // 0 = off, or 15, 30, 45, 60
  contentBoundary: 'all' | 'clean' | 'adults-only' | 'kids-only';
  customDeckIds?: string[];
  enableSpecialCards?: boolean;
  specialCardFrequency?: 'off' | 'low' | 'normal' | 'high';
  enableProgressiveDifficulty?: boolean;
  roundsPerProgressiveLevel?: number;
  playMode?: PlayMode;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  unlockedAt?: number;
}


