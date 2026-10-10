import { GameCategory, GameId, PartyModeConfig } from '../types/game';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export interface GameSession {
  id: string;
  name: string;
  mode: 'solo' | 'party' | 'multiplayer';
  gameId: GameId;
  category: GameCategory;
  customDeckId?: string;
  customDeckTitle?: string;
  players: string[];
  currentRound: number;
  scores: Record<string, number>;
  seenPromptIds: string[];
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
  userId?: string;
  partyConfig?: PartyModeConfig;
}

const ACTIVE_SESSION_KEY = 'jinx_active_game_session_v1';
const ALL_LOCAL_SESSIONS_KEY = 'jinx_all_game_sessions_v1';
const SEEN_CARDS_PREFIX = 'jinx_seen_cards_';

export const sessionService = {
  // ===================== CARD HISTORY TRACKING =====================

  /**
   * Get list of stable prompt IDs already seen for a game or custom deck
   */
  getSeenCardIds(key: string): string[] {
    try {
      return JSON.parse(localStorage.getItem(`${SEEN_CARDS_PREFIX}${key}`) || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Mark a prompt as seen for a game or custom deck
   */
  markCardSeen(key: string, cardId: string): void {
    if (!cardId) return;
    try {
      const seen = this.getSeenCardIds(key);
      if (!seen.includes(cardId)) {
        seen.push(cardId);
        localStorage.setItem(`${SEEN_CARDS_PREFIX}${key}`, JSON.stringify(seen));
      }
    } catch {
      // ignore
    }
  },

  /**
   * Reset card history for a specific game/deck or all
   */
  resetCardHistory(key?: string): void {
    try {
      if (key) {
        localStorage.removeItem(`${SEEN_CARDS_PREFIX}${key}`);
      } else {
        // Clear all seen cards keys
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(SEEN_CARDS_PREFIX)) {
            localStorage.removeItem(k);
          }
        }
      }
    } catch {
      // ignore
    }
  },

  /**
   * Filter out already seen cards.
   * If all cards in the pool have already been seen, reset the seen history
   * and return the entire pool so the game never gets stuck.
   */
  filterUnseenCards<T extends { id: string }>(key: string, pool: T[]): T[] {
    if (!pool || pool.length === 0) return [];
    const seen = new Set(this.getSeenCardIds(key));
    const unseen = pool.filter(card => !seen.has(card.id));

    if (unseen.length === 0) {
      // All cards exhausted! Auto-reset history for this deck/game
      this.resetCardHistory(key);
      return pool;
    }

    return unseen;
  },

  // ===================== SESSION MANAGEMENT =====================

  /**
   * Get currently active unfinished session
   */
  getActiveSession(): GameSession | null {
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!raw) return null;
      const parsed: GameSession = JSON.parse(raw);
      if (parsed && !parsed.isArchived && parsed.currentRound > 0) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Save or update the active game session
   */
  saveActiveSession(sessionData: Partial<GameSession> & { gameId: GameId; category: GameCategory }): GameSession {
    const existing = this.getActiveSession();
    const id = sessionData.id || existing?.id || 'sess_' + Math.random().toString(36).substring(2, 11);
    const now = Date.now();

    const fullSession: GameSession = {
      id,
      name: sessionData.name || existing?.name || `Party Session (${new Date().toLocaleDateString()})`,
      mode: sessionData.mode || existing?.mode || 'solo',
      gameId: sessionData.gameId,
      category: sessionData.category,
      customDeckId: sessionData.customDeckId || existing?.customDeckId,
      customDeckTitle: sessionData.customDeckTitle || existing?.customDeckTitle,
      players: sessionData.players || existing?.players || [],
      currentRound: sessionData.currentRound ?? (existing ? existing.currentRound + 1 : 1),
      scores: sessionData.scores || existing?.scores || {},
      seenPromptIds: sessionData.seenPromptIds || existing?.seenPromptIds || [],
      isArchived: false,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      userId: sessionData.userId || existing?.userId,
      partyConfig: sessionData.partyConfig || existing?.partyConfig,
    };

    // Save as current active session
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(fullSession));
    } catch {
      // ignore
    }

    // Save into list of all sessions
    this.saveToSessionHistory(fullSession);

    // Save to Firestore if user logged in
    if (fullSession.userId && db) {
      try {
        const ref = doc(db, 'user_sessions', fullSession.id);
        setDoc(ref, fullSession, { merge: true }).catch(() => {});
      } catch {
        // ignore
      }
    }

    return fullSession;
  },

  /**
   * Clear active session (when finishing or intentionally ending)
   */
  clearActiveSession(): void {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Save a session to all sessions list
   */
  saveToSessionHistory(session: GameSession): void {
    try {
      const all = this.getLocalSessionHistory();
      const existingIdx = all.findIndex(s => s.id === session.id);
      if (existingIdx >= 0) {
        all[existingIdx] = session;
      } else {
        all.unshift(session);
      }
      localStorage.setItem(ALL_LOCAL_SESSIONS_KEY, JSON.stringify(all.slice(0, 50)));
    } catch {
      // ignore
    }
  },

  /**
   * Get all previous and active sessions
   */
  async getAllSessions(userId?: string): Promise<GameSession[]> {
    const local = this.getLocalSessionHistory();

    if (userId && db) {
      try {
        const q = query(
          collection(db, 'user_sessions'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const remote = snap.docs.map(d => d.data() as GameSession);
          // Merge local and remote
          const mergedMap = new Map<string, GameSession>();
          remote.forEach(s => mergedMap.set(s.id, s));
          local.forEach(s => {
            if (!mergedMap.has(s.id) || (s.updatedAt > (mergedMap.get(s.id)?.updatedAt || 0))) {
              mergedMap.set(s.id, s);
            }
          });
          return Array.from(mergedMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
        }
      } catch (e) {
        console.warn('Firestore user sessions fallback to local:', e);
      }
    }

    return local;
  },

  /**
   * Rename a session
   */
  async renameSession(id: string, newName: string): Promise<void> {
    const all = this.getLocalSessionHistory();
    const target = all.find(s => s.id === id);
    if (target) {
      target.name = newName.trim();
      target.updatedAt = Date.now();
      localStorage.setItem(ALL_LOCAL_SESSIONS_KEY, JSON.stringify(all));
    }

    const active = this.getActiveSession();
    if (active && active.id === id) {
      active.name = newName.trim();
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(active));
    }

    if (db) {
      try {
        await updateDoc(doc(db, 'user_sessions', id), { name: newName.trim(), updatedAt: Date.now() });
      } catch {
        // ignore
      }
    }
  },

  /**
   * Archive or unarchive a session
   */
  async toggleArchiveSession(id: string): Promise<void> {
    const all = this.getLocalSessionHistory();
    const target = all.find(s => s.id === id);
    if (target) {
      target.isArchived = !target.isArchived;
      target.updatedAt = Date.now();
      localStorage.setItem(ALL_LOCAL_SESSIONS_KEY, JSON.stringify(all));

      const active = this.getActiveSession();
      if (active && active.id === id && target.isArchived) {
        this.clearActiveSession();
      }
    }

    if (db) {
      try {
        await updateDoc(doc(db, 'user_sessions', id), { isArchived: target?.isArchived, updatedAt: Date.now() });
      } catch {
        // ignore
      }
    }
  },

  /**
   * Delete a session
   */
  async deleteSession(id: string): Promise<void> {
    const all = this.getLocalSessionHistory().filter(s => s.id !== id);
    localStorage.setItem(ALL_LOCAL_SESSIONS_KEY, JSON.stringify(all));

    const active = this.getActiveSession();
    if (active && active.id === id) {
      this.clearActiveSession();
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'user_sessions', id));
      } catch {
        // ignore
      }
    }
  },

  getLocalSessionHistory(): GameSession[] {
    try {
      return JSON.parse(localStorage.getItem(ALL_LOCAL_SESSIONS_KEY) || '[]');
    } catch {
      return [];
    }
  },
};

