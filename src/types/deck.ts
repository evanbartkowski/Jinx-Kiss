import { GameId, PromptItem } from './game';

export type DeckVisibility = 'private' | 'unlisted' | 'public';
export type DeckModerationStatus = 'pending' | 'approved' | 'rejected';

export interface CustomDeck {
  id: string;
  shareToken: string; // Unpredictable token for unlisted sharing
  title: string;
  description: string;
  gameId: GameId;
  themeColor: string;
  creatorUid: string;
  creatorUsername: string;
  visibility: DeckVisibility;
  moderationStatus: DeckModerationStatus;
  moderationReason?: string;
  cards: PromptItem[];
  createdAt: number;
  updatedAt: number;
  playCount?: number;
}
