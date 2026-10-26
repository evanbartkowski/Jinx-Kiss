import { CommunitySubmission } from '../types/submission';
import { GameCategory, GameId, PlayMode } from '../types/game';
import { getPromptValidationErrors } from '../utils/promptValidation';
import { db } from '../config/firebase';
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { getPromptsForGame } from '../data/prompts';

const LOCAL_SUBMISSIONS_KEY = 'jinxkiss_local_submissions_v1';
const RATE_LIMIT_KEY = 'jinxkiss_submission_rate_limit_v1';

export class SubmissionService {
  /**
   * Submit a community prompt
   */
  async submitPrompt(
    gameId: GameId,
    category: GameCategory,
    text: string,
    submitterUid: string,
    submitterUsername: string,
    extras?: { type?: 'truth' | 'dare'; optionA?: string; optionB?: string; playMode?: PlayMode }
  ): Promise<CommunitySubmission> {
    const cleanText = text.trim();
    if (cleanText.length < 10) {
      throw new Error('Proposed card prompt must be at least 10 characters.');
    }
    // Duplicate detection: check existing default prompts
    const existing = getPromptsForGame(gameId, undefined, extras?.playMode || 'in-person');
    const normalizedInput = cleanText.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isDuplicate = existing.some(p => p.text.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedInput);
    if (isDuplicate) {
      throw new Error('A very similar prompt already exists in the official library.');
    }
    const errors = getPromptValidationErrors({ id: 'submission', gameId, category, text: cleanText, ...extras });
    if (errors.length) throw new Error(errors.join(' '));
    // Invalid cards and duplicates do not consume the submission allowance.
    this.checkRateLimit(submitterUid);

    const id = 'sub_' + Math.random().toString(36).substring(2, 11);
    const submission: CommunitySubmission = {
      id,
      gameId,
      category,
      text: cleanText,
      type: extras?.type,
      optionA: extras?.optionA?.trim(),
      optionB: extras?.optionB?.trim(),
      playMode: extras?.playMode || 'in-person',
      submitterUid,
      submitterUsername,
      status: 'pending',
      createdAt: Date.now(),
    };

    // Save locally
    const all = this.getLocalSubmissions();
    all.push(submission);
    this.saveLocalSubmissions(all);

    // Save to Firestore
    try {
      if (db) {
        await setDoc(doc(db, 'community_submissions', id), Object.fromEntries(Object.entries(submission).filter(([, value]) => value !== undefined)));
      }
    } catch (e) {
      console.warn('Firestore submitPrompt fallback:', e);
    }

    return submission;
  }

  /**
   * Get submissions by user
   */
  async getUserSubmissions(uid: string): Promise<CommunitySubmission[]> {
    const local = this.getLocalSubmissions().filter(s => s.submitterUid === uid);
    try {
      if (db) {
        const q = query(collection(db, 'community_submissions'), where('submitterUid', '==', uid));
        const snap = await getDocs(q);
        const cloud: CommunitySubmission[] = [];
        snap.forEach(d => cloud.push(d.data() as CommunitySubmission));
        if (cloud.length > 0) return cloud;
      }
    } catch (e) {
      // Fallback
    }
    return local;
  }

  private checkRateLimit(uid: string) {
    try {
      const raw = localStorage.getItem(`${RATE_LIMIT_KEY}_${uid}`);
      const history: number[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const recent = history.filter(t => now - t < 10 * 60 * 1000); // 10 minutes
      if (recent.length >= 10) {
        throw new Error('You have submitted 10 cards recently. Please wait a few minutes before submitting more.');
      }
      recent.push(now);
      localStorage.setItem(`${RATE_LIMIT_KEY}_${uid}`, JSON.stringify(recent));
    } catch (e: any) {
      if (e.message.includes('10 cards')) throw e;
    }
  }

  public getLocalSubmissions(): CommunitySubmission[] {
    try {
      const raw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public saveLocalSubmissions(subs: CommunitySubmission[]) {
    try {
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(subs));
    } catch (e) {
      console.warn('Failed to save local submissions', e);
    }
  }
}

export const submissionService = new SubmissionService();

