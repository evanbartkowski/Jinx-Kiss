import { GameCategory, GameId } from './game';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface CommunitySubmission {
  id: string;
  gameId: GameId;
  category: GameCategory;
  text: string;
  type?: 'truth' | 'dare';
  optionA?: string;
  optionB?: string;
  submitterUid: string;
  submitterUsername: string;
  status: SubmissionStatus;
  moderationReason?: string;
  reviewedBy?: string;
  reviewedAt?: number;
  createdAt: number;
}

