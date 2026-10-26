import { CommunitySubmission } from '../types/submission';
import { CustomDeck } from '../types/deck';
import { GameCategory, GameId, PlayMode, PromptItem } from '../types/game';
import { UserProfile } from '../types/user';
import { submissionService } from './submissionService';
import { ALL_DEFAULT_PROMPTS, ALL_ONLINE_PROMPTS } from '../data/prompts';
import { getPromptValidationErrors } from '../utils/promptValidation';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  documentId,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { authService } from './authService';
import { SEED_COMMUNITY_DECKS } from '../data/communityDecksSeed';
import { LEGENDARY_CARDS } from '../data/prompts/legendaryCards';
import { ONLINE_LEGENDARY_CARDS } from '../data/prompts/online/onlineLegendaryCards';
import { getCachedPromptOverrides, cachePromptOverrides } from '../utils/promptOverrides';

const LOCAL_USERS_KEY = 'jinxkiss_local_users_v1';

export interface AdminStats {
  totalUsers: number;
  totalDecks: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
}

export class AdminService {
  /**
   * Get overview statistics
   */
  async getOverviewStats(): Promise<AdminStats> {
    const [submissions, decks, users] = await Promise.all([
      this.getAllSubmissions(),
      this.getAllDecksForModeration(),
      this.getUsers(),
    ]);

    const pending = submissions.filter((s) => s.status === 'pending').length;
    const approved = submissions.filter((s) => s.status === 'approved').length;
    const rejected = submissions.filter((s) => s.status === 'rejected').length;

    return {
      totalUsers: users.length,
      totalDecks: decks.length,
      totalSubmissions: submissions.length,
      pendingSubmissions: pending,
      approvedSubmissions: approved,
      rejectedSubmissions: rejected,
    };
  }

  /**
   * Get all prompt submissions
   */
  async getAllSubmissions(): Promise<CommunitySubmission[]> {
    await authService.requireAdmin();
    const merged = new Map(submissionService.getLocalSubmissions().map((s) => [s.id, s]));
    (await getDocs(collection(db, 'community_submissions'))).docs.forEach((d) =>
      merged.set(d.id, { ...d.data(), id: d.id } as CommunitySubmission)
    );
    return [...merged.values()];
  }

  /**
   * Approve a community submission and publish it to the game prompt pool
   */
  async approveSubmission(submissionId: string, editedPrompt?: Partial<CommunitySubmission>): Promise<void> {
    const submissions = await this.getAllSubmissions();
    const index = submissions.findIndex((s) => s.id === submissionId);
    if (index === -1) throw new Error('Submission not found.');

    const sub = {
      ...submissions[index],
      ...editedPrompt,
      status: 'approved' as const,
      reviewedAt: Date.now(),
      reviewedBy: 'admin',
    };

    // Publish to official prompts pool!
    const newPromptItem: PromptItem = {
      id: 'approved_' + sub.id,
      gameId: sub.gameId,
      category: sub.category,
      text: sub.text,
      type: sub.type,
      optionA: sub.optionA,
      optionB: sub.optionB,
      playMode: sub.playMode || 'in-person',
      authorUsername: sub.submitterUsername,
      isCommunity: true,
      isActive: true,
    };

    await this.addOfficialPrompt(newPromptItem);
    await setDoc(doc(db, 'community_submissions', sub.id), this.withoutUndefined(sub));
    submissions[index] = sub;
    submissionService.saveLocalSubmissions(submissions);
  }

  /**
   * Reject a community submission with reason
   */
  async rejectSubmission(submissionId: string, reason: string): Promise<void> {
    const submissions = await this.getAllSubmissions();
    const index = submissions.findIndex((s) => s.id === submissionId);
    if (index === -1) throw new Error('Submission not found.');

    submissions[index] = {
      ...submissions[index],
      status: 'rejected',
      moderationReason: reason,
      reviewedAt: Date.now(),
      reviewedBy: 'admin',
    };

    await setDoc(doc(db, 'community_submissions', submissionId), this.withoutUndefined(submissions[index]));
    submissionService.saveLocalSubmissions(submissions);
  }

  /**
   * Game Content Manager: Get all active prompts for game & category, including default & overrides for playMode
   */
  async getAllPromptsForManager(
    gameId?: GameId,
    category?: GameCategory,
    playMode: PlayMode = 'in-person',
    includeRare = false
  ): Promise<PromptItem[]> {
    const overrides = await this.getOfficialOverrides();
    const sourceMap = playMode === 'online' ? ALL_ONLINE_PROMPTS : ALL_DEFAULT_PROMPTS;
    // Merge before filtering: a moved card must disappear from its previous game,
    // category, and play mode. Chaos Mix is derived after the merge.
    const merged = new Map<string, PromptItem>();
    Object.entries(sourceMap)
      .filter(([id]) => id !== 'chaos-mix')
      .forEach(([, list]) => {
        list.forEach((prompt) => merged.set(prompt.id, prompt));
      });
    if (includeRare)
      (playMode === 'online' ? ONLINE_LEGENDARY_CARDS : LEGENDARY_CARDS).forEach((p) => merged.set(p.id, p));
    for (const override of overrides) {
      merged.delete(override.id);
      if ((override.playMode || 'in-person') === playMode && (includeRare || !override.isLegendary))
        merged.set(override.id, override);
    }
    let prompts = Array.from(merged.values());
    if (gameId === 'chaos-mix') {
      prompts = prompts
        .filter((p) => p.gameId !== 'chaos-mix')
        .map((p) => ({ ...p, originGameId: p.gameId, gameId: 'chaos-mix' }));
    }
    return prompts.filter(
      (p) =>
        (!gameId || p.gameId === gameId) &&
        (!category || p.category === category) &&
        (p.playMode || 'in-person') === playMode
    );
  }

  /**
   * Add a new prompt to official content
   */
  async addOfficialPrompt(prompt: PromptItem): Promise<void> {
    const item: PromptItem = {
      ...prompt,
      id: prompt.id || 'admin_prompt_' + Math.random().toString(36).substring(2, 10),
      isActive: prompt.isActive !== false,
    };
    const errors = getPromptValidationErrors(item);
    if (errors.length) throw new Error(errors.join(' '));
    await authService.requireAdmin();
    await setDoc(doc(db, 'official_prompts', item.id), this.withoutUndefined(item));
    const overrides = this.getLocalOfficialPrompts();
    const existingIndex = overrides.findIndex((p) => p.id === item.id);
    if (existingIndex !== -1) overrides[existingIndex] = item;
    else overrides.unshift(item);
    this.saveLocalOfficialPrompts(overrides);
  }

  /**
   * Update an existing prompt
   */
  async updateOfficialPrompt(promptId: string, updates: Partial<PromptItem>): Promise<void> {
    await authService.requireAdmin();
    const overrides = await this.getOfficialOverrides(true);
    const found =
      overrides.find((p) => p.id === promptId) ||
      [
        ...Object.values(ALL_DEFAULT_PROMPTS),
        ...Object.values(ALL_ONLINE_PROMPTS),
        LEGENDARY_CARDS,
        ONLINE_LEGENDARY_CARDS,
      ]
        .flat()
        .find((p) => p.id === promptId);
    if (!found) throw new Error('Prompt not found.');
    const item = { ...found, ...updates, id: promptId };
    if (item.isActive !== false) {
      const errors = getPromptValidationErrors(item);
      if (errors.length) throw new Error(errors.join(' '));
    }
    const next = overrides.filter((p) => p.id !== promptId);
    next.push(item);
    await setDoc(doc(db, 'official_prompts', promptId), this.withoutUndefined(item));
    this.saveLocalOfficialPrompts(next);
  }

  /**
   * Toggle prompt active status or delete
   */
  async deleteOfficialPrompt(promptId: string): Promise<void> {
    await this.updateOfficialPrompt(promptId, { isActive: false });
  }

  /**
   * Community Deck Manager: Get all decks for moderation review
   */
  async getAllDecksForModeration(): Promise<CustomDeck[]> {
    await authService.requireAdmin();
    const merged = new Map(SEED_COMMUNITY_DECKS.map((d) => [d.id, d]));
    const local = JSON.parse(localStorage.getItem('jinxkiss_local_decks_v1') || '[]') as CustomDeck[];
    local.forEach((d) => merged.set(d.id, d));
    (await getDocs(collection(db, 'custom_decks'))).docs.forEach((d) =>
      merged.set(d.id, { ...d.data(), id: d.id } as CustomDeck)
    );
    return [...merged.values()];
  }

  /**
   * Moderate deck (approve, reject, or hide)
   */
  async moderateDeck(deckId: string, status: 'approved' | 'rejected', reason?: string): Promise<void> {
    await this.updateManagedDeck(deckId, {
      moderationStatus: status,
      moderationReason: reason,
    });
  }

  async updateManagedDeck(deckId: string, updates: Partial<CustomDeck>): Promise<CustomDeck> {
    const target = (await this.getAllDecksForModeration()).find((d) => d.id === deckId);
    if (!target) throw new Error('Deck not found.');
    const updated = {
      ...target,
      ...updates,
      id: target.id,
      creatorUid: target.creatorUid,
      creatorUsername: target.creatorUsername,
      updatedAt: Date.now(),
    };
    const ids = new Set<string>();
    for (const card of updated.cards) {
      if (ids.has(card.id)) throw new Error('Each card needs a unique ID.');
      ids.add(card.id);
      if (
        JSON.stringify(target.cards.find((c) => c.id === card.id)) === JSON.stringify(card) &&
        updated.gameId === target.gameId &&
        updated.playMode === target.playMode
      )
        continue;
      const errors = getPromptValidationErrors(card);
      if (card.gameId !== updated.gameId && updated.gameId !== 'chaos-mix')
        errors.push('Cards must match the deck game.');
      if ((card.playMode || 'in-person') !== (updated.playMode || 'in-person'))
        errors.push('Cards must match the deck play mode.');
      if (errors.length) throw new Error(errors.join(' '));
    }
    await setDoc(doc(db, 'custom_decks', deckId), this.withoutUndefined(updated));
    const local = JSON.parse(localStorage.getItem('jinxkiss_local_decks_v1') || '[]') as CustomDeck[];
    localStorage.setItem('jinxkiss_local_decks_v1', JSON.stringify([...local.filter((d) => d.id !== deckId), updated]));
    return updated;
  }

  async getUsers(): Promise<UserProfile[]> {
    await authService.requireAdmin();
    const users = new Map(this.getLocalUsersList().map((u) => [u.uid, u]));
    (await getDocs(collection(db, 'users'))).docs.forEach((d) =>
      users.set(d.id, { ...d.data(), uid: d.id } as UserProfile)
    );
    return [...users.values()];
  }

  async getCollectionNames(): Promise<string[]> {
    await authService.requireAdmin();
    const metadata = await getDoc(doc(db, 'admin_metadata', 'collections'));
    const names = [
      'official_prompts',
      'custom_decks',
      'community_submissions',
      'users',
      'usernames',
      'card_reports',
      'reports',
      'rooms',
      'votes',
      'game_votes',
      'card_ratings',
      'user_sessions',
      'admin_metadata',
      ...(metadata.data()?.names || []),
    ];
    return [...new Set<string>(names)].filter((name) => name !== 'credentials').sort();
  }

  async getCollectionPage(path: string, cursor?: QueryDocumentSnapshot<DocumentData>) {
    await authService.requireAdmin();
    const parts = path.trim().split('/');
    if (parts.some((p) => !p || p === '.' || p === '..') || parts.length % 2 !== 1 || parts[0] === 'credentials')
      throw new Error('Enter a collection path, such as rooms or rooms/ROOMCODE/players.');
    const constraints = [orderBy(documentId()), ...(cursor ? [startAfter(cursor)] : []), limit(50)];
    const snapshot = await getDocs(query(collection(db, path.trim()), ...constraints));
    return {
      documents: snapshot.docs.map((d) => ({ id: d.id, data: d.data() })),
      cursor: snapshot.docs.at(-1),
      hasMore: snapshot.size === 50,
    };
  }

  private withoutUndefined(value: unknown): Record<string, any> {
    return JSON.parse(JSON.stringify(value));
  }

  private async getOfficialOverrides(strict = false): Promise<PromptItem[]> {
    try {
      const snapshot = await getDocs(collection(db, 'official_prompts'));
      // A successful cloud read is authoritative; stale browser edits must not win.
      const overrides = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as PromptItem);
      this.saveLocalOfficialPrompts(overrides);
      return overrides;
    } catch (error) {
      if (strict) throw error;
      return this.getLocalOfficialPrompts();
    }
  }

  watchOfficialPrompts(): () => void {
    return onSnapshot(
      collection(db, 'official_prompts'),
      (snapshot) => {
        this.saveLocalOfficialPrompts(snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as PromptItem));
      },
      () => {
        /* Retain the last synced cards when offline. */
      }
    );
  }

  /**
   * User Management: Get registered users (never reveals password or hash!)
   */
  getLocalUsersList(): UserProfile[] {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Object.values(parsed).map((u: any) => ({
        uid: u.uid,
        username: u.username,
        role: u.role,
        isBanned: !!u.isBanned,
        banReason: u.banReason,
        createdAt: u.createdAt || Date.now(),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Suspend or ban user
   */
  async banUser(username: string, reason: string): Promise<void> {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return;
    const users = JSON.parse(raw);
    const normalized = username.toLowerCase();
    if (users[normalized]) {
      users[normalized].isBanned = true;
      users[normalized].banReason = reason;
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }
  }

  /**
   * Unban user
   */
  async unbanUser(username: string): Promise<void> {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return;
    const users = JSON.parse(raw);
    const normalized = username.toLowerCase();
    if (users[normalized]) {
      users[normalized].isBanned = false;
      delete users[normalized].banReason;
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }
  }

  public getLocalOfficialPrompts(): PromptItem[] {
    return getCachedPromptOverrides();
  }

  private saveLocalOfficialPrompts(prompts: PromptItem[]) {
    cachePromptOverrides(prompts);
  }
}

export const adminService = new AdminService();
