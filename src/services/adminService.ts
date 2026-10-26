import { CommunitySubmission } from '../types/submission';
import { CustomDeck } from '../types/deck';
import { GameCategory, GameId, PlayMode, PromptItem } from '../types/game';
import { UserProfile } from '../types/user';
import { submissionService } from './submissionService';
import { deckService } from './deckService';
import { ALL_DEFAULT_PROMPTS, ALL_ONLINE_PROMPTS } from '../data/prompts';
import { getPromptValidationErrors } from '../utils/promptValidation';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const LOCAL_OFFICIAL_PROMPTS_KEY = 'jinxkiss_official_prompts_override_v1';
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
    const submissions = submissionService.getLocalSubmissions();
    const decks = (await deckService.getPublicDecks()).length + 5; // count public + private
    const localUsers = this.getLocalUsersList();

    const pending = submissions.filter(s => s.status === 'pending').length;
    const approved = submissions.filter(s => s.status === 'approved').length;
    const rejected = submissions.filter(s => s.status === 'rejected').length;

    return {
      totalUsers: Math.max(localUsers.length, 1),
      totalDecks: decks,
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
    return submissionService.getLocalSubmissions();
  }

  /**
   * Approve a community submission and publish it to the game prompt pool
   */
  async approveSubmission(submissionId: string, editedPrompt?: Partial<CommunitySubmission>): Promise<void> {
    const submissions = submissionService.getLocalSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
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
    submissions[index] = sub;
    submissionService.saveLocalSubmissions(submissions);
  }

  /**
   * Reject a community submission with reason
   */
  async rejectSubmission(submissionId: string, reason: string): Promise<void> {
    const submissions = submissionService.getLocalSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1) throw new Error('Submission not found.');

    submissions[index] = {
      ...submissions[index],
      status: 'rejected',
      moderationReason: reason,
      reviewedAt: Date.now(),
      reviewedBy: 'admin',
    };

    submissionService.saveLocalSubmissions(submissions);
  }

  /**
   * Game Content Manager: Get all active prompts for game & category, including default & overrides for playMode
   */
  async getAllPromptsForManager(
    gameId?: GameId,
    category?: GameCategory,
    playMode: PlayMode = 'in-person'
  ): Promise<PromptItem[]> {
    const overrides = this.getLocalOfficialPrompts();
    const sourceMap = playMode === 'online' ? ALL_ONLINE_PROMPTS : ALL_DEFAULT_PROMPTS;
    // Merge before filtering: a moved card must disappear from its previous game,
    // category, and play mode. Chaos Mix is derived after the merge.
    const merged = new Map<string, PromptItem>();
    Object.entries(sourceMap).filter(([id]) => id !== 'chaos-mix').forEach(([, list]) => {
      list.forEach(prompt => merged.set(prompt.id, prompt));
    });
    for (const override of overrides) {
      merged.delete(override.id);
      if ((override.playMode || 'in-person') === playMode) merged.set(override.id, override);
    }
    let prompts = Array.from(merged.values());
    if (gameId === 'chaos-mix') {
      prompts = prompts.filter(p => p.gameId !== 'chaos-mix').map(p => ({ ...p, originGameId: p.gameId, gameId: 'chaos-mix' }));
    }
    return prompts.filter(p => (!gameId || p.gameId === gameId) && (!category || p.category === category) && (p.playMode || 'in-person') === playMode);
  }

  /**
   * Add a new prompt to official content
   */
  async addOfficialPrompt(prompt: PromptItem): Promise<void> {
    const overrides = this.getLocalOfficialPrompts();
    const item: PromptItem = {
      ...prompt,
      id: prompt.id || 'admin_prompt_' + Math.random().toString(36).substring(2, 10),
      isActive: prompt.isActive !== false,
    };
    const errors = getPromptValidationErrors(item);
    if (errors.length) throw new Error(errors.join(' '));
    const existingIndex = overrides.findIndex(p => p.id === item.id);
    if (existingIndex !== -1) overrides[existingIndex] = item;
    else overrides.unshift(item);
    this.saveLocalOfficialPrompts(overrides);

    try {
      if (db) {
        await setDoc(doc(db, 'official_prompts', item.id), Object.fromEntries(Object.entries(item).filter(([, value]) => value !== undefined)));
      }
    } catch (e) {
      console.warn('Firestore addOfficialPrompt fallback:', e);
    }
  }

  /**
   * Update an existing prompt
   */
  async updateOfficialPrompt(promptId: string, updates: Partial<PromptItem>): Promise<void> {
    const overrides = this.getLocalOfficialPrompts();
    const found = overrides.find(p => p.id === promptId) ||
      [...Object.values(ALL_DEFAULT_PROMPTS), ...Object.values(ALL_ONLINE_PROMPTS)].flat().find(p => p.id === promptId);
    if (!found) throw new Error('Prompt not found.');
    const item = { ...found, ...updates, id: promptId };
    if (item.isActive !== false) {
      const errors = getPromptValidationErrors(item);
      if (errors.length) throw new Error(errors.join(' '));
    }
    const next = overrides.filter(p => p.id !== promptId);
    next.push(item);
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
    return deckService.getPublicDecks();
  }

  /**
   * Moderate deck (approve, reject, or hide)
   */
  async moderateDeck(deckId: string, status: 'approved' | 'rejected', reason?: string): Promise<void> {
    const decks = await deckService.getPublicDecks();
    const target = decks.find(d => d.id === deckId);
    if (!target) return;

    await deckService.updateDeck(deckId, {
      moderationStatus: status,
      moderationReason: reason,
    }, target.creatorUid);
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
    try {
      const raw = localStorage.getItem(LOCAL_OFFICIAL_PROMPTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(p => p && typeof p.id === 'string' && typeof p.text === 'string') : [];
    } catch {
      return [];
    }
  }

  private saveLocalOfficialPrompts(prompts: PromptItem[]) {
    try {
      localStorage.setItem(LOCAL_OFFICIAL_PROMPTS_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.warn('Failed to save official prompt overrides', e);
    }
  }
}

export const adminService = new AdminService();

