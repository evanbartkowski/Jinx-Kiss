export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  username: string;
  role: UserRole;
  requiresPasswordChange?: boolean;
  isBanned?: boolean;
  banReason?: string;
  createdAt: number;
  avatarSeed?: string;
  stats?: {
    customDecksCount: number;
    publishedDecksCount: number;
    pendingSubmissionsCount: number;
    approvedSubmissionsCount: number;
  };
}
