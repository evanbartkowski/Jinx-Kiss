export type GameId = 
  | 'truth-or-dare'
  | 'never-have-i-ever'
  | 'would-you-rather'
  | 'hot-takes'
  | 'dare-roulette'
  | 'red-flag-green-flag'
  | 'truth-or-sip'
  | 'point-and-drink';

export type GameCategory = 
  | 'easy'
  | 'medium'
  | 'extreme'
  | 'couples'
  | '18+'
  | 'spicy'
  | 'kids';

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
}

export interface PlayerScore {
  name: string;
  score: number;
  votesReceived?: number;
}
