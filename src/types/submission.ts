import { GameCategory, GameId, PlayMode } from './game';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface CommunitySubmission {
  id: string;
  gameId: GameId;
  category: GameCategory;
  playMode?: PlayMode;
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

