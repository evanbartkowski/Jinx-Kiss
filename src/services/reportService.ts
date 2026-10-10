import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { GameCategory, GameId } from '../types/game';

export type ReportReason =
  | 'offensive'
  | 'duplicate'
  | 'confusing'
  | 'wrong-difficulty'
  | 'wrong-game'
  | 'broken'
  | 'other';

export interface CardReport {
  id: string;
  cardId: string;
  promptText: string;
  gameId: GameId;
  category: GameCategory;
  reason: ReportReason;
  details?: string;
  reporterUid?: string;
  createdAt: number;
  status: 'pending' | 'resolved' | 'dismissed';
  adminNotes?: string;
}

const LOCAL_REPORTS_KEY = 'jinx_card_reports_v1';
const REPORT_RATE_LIMIT_KEY = 'jinx_report_rate_limit_v1';
const DISABLED_CARDS_KEY = 'jinx_disabled_card_ids_v1';

export const reportService = {
  /**
   * Check rate limit: Max 5 reports per 10 minutes
   */
  checkRateLimit(): boolean {
    try {
      const history = JSON.parse(localStorage.getItem(REPORT_RATE_LIMIT_KEY) || '[]');
      const now = Date.now();
      const recent = history.filter((ts: number) => now - ts < 10 * 60 * 1000);
      if (recent.length >= 5) {
        return false;
      }
      recent.push(now);
      localStorage.setItem(REPORT_RATE_LIMIT_KEY, JSON.stringify(recent));
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Submit a new card report
   */
  async submitReport(
    cardId: string,
    promptText: string,
    gameId: GameId,
    category: GameCategory,
    reason: ReportReason,
    details?: string,
    reporterUid?: string
  ): Promise<CardReport> {
    if (!this.checkRateLimit()) {
      throw new Error('Too many reports submitted recently. Please try again in a few minutes.');
    }

    const id = 'rep_' + Math.random().toString(36).substring(2, 11);
    const report: CardReport = {
      id,
      cardId,
      promptText,
      gameId,
      category,
      reason,
      details: details?.trim() || undefined,
      reporterUid: reporterUid || 'guest_' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
      status: 'pending',
    };

    // Save locally
    try {
      const local = this.getLocalReports();
      local.unshift(report);
      localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(local));
    } catch {
      // ignore
    }

    // Save to Firestore
    try {
      if (db) {
        const reportRef = doc(db, 'card_reports', id);
        await setDoc(reportRef, report);
      }
    } catch (e) {
      console.warn('Firestore report write fallback to local:', e);
    }

    return report;
  },

  /**
   * Get all reports for Admin Dashboard
   */
  async getAllReports(): Promise<CardReport[]> {
    try {
      if (db) {
        const q = query(collection(db, 'card_reports'), orderBy('createdAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as CardReport);
        }
      }
    } catch {
      // Offline fallback
    }

    return this.getLocalReports();
  },

  /**
   * Update report status (admin only)
   */
  async updateReportStatus(
    reportId: string,
    status: 'resolved' | 'dismissed',
    adminNotes?: string
  ): Promise<void> {
    // Local update
    const local = this.getLocalReports();
    const target = local.find(r => r.id === reportId);
    if (target) {
      target.status = status;
      if (adminNotes) target.adminNotes = adminNotes;
      localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(local));
    }

    // Firestore update
    try {
      if (db) {
        const reportRef = doc(db, 'card_reports', reportId);
        await updateDoc(reportRef, {
          status,
          adminNotes: adminNotes || '',
          resolvedAt: Date.now(),
        });
      }
    } catch (e) {
      console.warn('Firestore report update fallback:', e);
    }
  },

  /**
   * Disable a reported card from being shown in games
   */
  disableCard(cardId: string): void {
    try {
      const disabled = JSON.parse(localStorage.getItem(DISABLED_CARDS_KEY) || '[]');
      if (!disabled.includes(cardId)) {
        disabled.push(cardId);
        localStorage.setItem(DISABLED_CARDS_KEY, JSON.stringify(disabled));
      }
    } catch {
      // ignore
    }
  },

  /**
   * Check if a card is disabled
   */
  isCardDisabled(cardId: string): boolean {
    try {
      const disabled: string[] = JSON.parse(localStorage.getItem(DISABLED_CARDS_KEY) || '[]');
      return disabled.includes(cardId);
    } catch {
      return false;
    }
  },

  getLocalReports(): CardReport[] {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_REPORTS_KEY) || '[]');
    } catch {
      return [];
    }
  },
};

