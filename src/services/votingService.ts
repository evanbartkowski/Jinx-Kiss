import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LOCAL_VOTES_KEY = 'jinxkiss_local_votes_v2';
const LEGACY_VOTES_KEY = 'jinxkiss_local_votes_v1';
const ALL_PLAYERS_KEY = 'jinxkiss_wyr_players_roster_v1';

export interface VoterRecord {
  id?: string;
  name: string;
  choice: 'A' | 'B';
  timestamp: number;
}

export interface StoredVoteData {
  optionA: number;
  optionB: number;
  voters: VoterRecord[];
  lastUpdated?: number;
}

export interface VoteStats {
  optionACount: number;
  optionBCount: number;
  totalVotes: number;
  optionAPercentage: number;
  optionBPercentage: number;
  recentVoters: VoterRecord[];
  userChoice?: 'A' | 'B';
}

export interface SavedPlayerInfo {
  name: string;
  lastPlayed: number;
  totalVotes: number;
}

const SEED_PLAYER_NAMES = [
  'Alex M.', 'Jordan K.', 'Taylor R.', 'Sam P.', 'Morgan D.', 'Riley W.',
  'Chris B.', 'Sophia T.', 'Noah L.', 'Emma C.', 'Lucas H.', 'Olivia J.',
  'Ethan K.', 'Ava D.', 'Maya S.', 'Liam B.'
];

export class VotingService {
  private memoryVotes: Record<string, StoredVoteData> = {};

  /**
   * Deterministic hash to provide realistic, varied baseline votes and voter community
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Generate realistic, consistent baseline seed data for a prompt
   */
  private getSeedVotes(promptId: string): StoredVoteData {
    const hash = this.hashString(promptId);
    const totalBase = 140 + (hash % 260); // 140 to 399 total votes
    const ratioA = 36 + ((hash >> 2) % 29); // 36% to 64%
    const optionA = Math.round((totalBase * ratioA) / 100);
    const optionB = totalBase - optionA;

    // Seed realistic recent voters
    const votersCount = 6 + (hash % 5);
    const voters: VoterRecord[] = [];
    const now = Date.now();

    for (let i = 0; i < votersCount; i++) {
      const nameIdx = (hash + i * 3) % SEED_PLAYER_NAMES.length;
      const voterName = SEED_PLAYER_NAMES[nameIdx];
      // Deterministically assign choice based on ratio
      const voterChoice: 'A' | 'B' = ((hash * (i + 1)) % 100) < ratioA ? 'A' : 'B';
      const offsetMs = (i + 1) * (18 * 60 * 1000 + (hash % 500000));
      voters.push({
        name: voterName,
        choice: voterChoice,
        timestamp: now - offsetMs,
      });
    }

    return {
      optionA,
      optionB,
      voters,
      lastUpdated: now,
    };
  }

  /**
   * Calculate stats ensuring percentages strictly total 100%
   */
  private calculateStats(data: StoredVoteData, userChoice?: 'A' | 'B'): VoteStats {
    const total = data.optionA + data.optionB;
    const optionAPercentage = total > 0 ? Math.round((data.optionA / total) * 100) : 50;
    const optionBPercentage = 100 - optionAPercentage;

    return {
      optionACount: data.optionA,
      optionBCount: data.optionB,
      totalVotes: total,
      optionAPercentage,
      optionBPercentage,
      recentVoters: data.voters || [],
      userChoice,
    };
  }

  /**
   * Normalize raw data into StoredVoteData
   */
  private normalizeData(promptId: string, raw?: any): StoredVoteData {
    if (!raw) {
      return this.getSeedVotes(promptId);
    }
    const seed = this.getSeedVotes(promptId);
    const optionA = typeof raw.optionA === 'number' ? raw.optionA : seed.optionA;
    const optionB = typeof raw.optionB === 'number' ? raw.optionB : seed.optionB;
    const voters = Array.isArray(raw.voters) && raw.voters.length > 0 ? raw.voters : seed.voters;
    return {
      optionA,
      optionB,
      voters,
      lastUpdated: raw.lastUpdated || Date.now(),
    };
  }

  /**
   * Save a player to the persistent global roster of Would You Rather players
   */
  private savePlayerToRoster(playerName: string) {
    const trimmed = playerName.trim();
    if (!trimmed || trimmed.toLowerCase() === 'you' || trimmed.toLowerCase() === 'anonymous') {
      return;
    }
    try {
      const roster = this.getAllPlayers();
      const existing = roster.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        existing.lastPlayed = Date.now();
        existing.totalVotes += 1;
      } else {
        roster.unshift({
          name: trimmed,
          lastPlayed: Date.now(),
          totalVotes: 1,
        });
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ALL_PLAYERS_KEY, JSON.stringify(roster.slice(0, 100)));
      }
    } catch {
      // Safe fallback
    }
  }

  /**
   * Retrieve all players saved to the Would You Rather roster
   */
  getAllPlayers(): SavedPlayerInfo[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(ALL_PLAYERS_KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      }
    } catch {
      // Fallback
    }
    return [];
  }

  /**
   * Record a vote for a prompt, saving the player and updating live stats
   */
  async recordVote(promptId: string, choice: 'A' | 'B', playerName?: string): Promise<VoteStats> {
    const effectivePlayerName = playerName?.trim() || 'You';
    const local = this.getLocalVotes();
    const current = local[promptId] ? { ...local[promptId] } : this.getSeedVotes(promptId);

    if (choice === 'A') {
      current.optionA += 1;
    } else {
      current.optionB += 1;
    }

    // Add this player to the prompt's recent voters list
    const newVoter: VoterRecord = {
      name: effectivePlayerName,
      choice,
      timestamp: Date.now(),
    };
    current.voters = [newVoter, ...(current.voters || [])].slice(0, 60);
    current.lastUpdated = Date.now();

    local[promptId] = current;
    this.memoryVotes[promptId] = current;
    this.saveLocalVotes(local);
    this.savePlayerToRoster(effectivePlayerName);

    // Sync to Firestore if available
    try {
      if (db) {
        const voteDocRef = doc(db, 'votes', promptId);
        await setDoc(voteDocRef, {
          optionA: current.optionA,
          optionB: current.optionB,
          totalVotes: current.optionA + current.optionB,
          voters: current.voters.slice(0, 50),
          lastUpdated: Date.now(),
        }, { merge: true });
      }
    } catch {
      // Fallback to local persistence seamlessly
    }

    return this.calculateStats(current, choice);
  }

  /**
   * Get current vote stats for a prompt synchronously
   */
  getStats(promptId: string): VoteStats {
    const local = this.getLocalVotes();
    const current = local[promptId] || this.memoryVotes[promptId] || this.getSeedVotes(promptId);
    return this.calculateStats(current);
  }

  /**
   * Fetch latest stats from Firestore with local fallback
   */
  async fetchStats(promptId: string): Promise<VoteStats> {
    try {
      if (db) {
        const voteDocRef = doc(db, 'votes', promptId);
        const snap = await getDoc(voteDocRef);
        if (snap.exists()) {
          const remoteData = snap.data();
          const merged = this.normalizeData(promptId, remoteData);
          this.memoryVotes[promptId] = merged;
          const local = this.getLocalVotes();
          local[promptId] = merged;
          this.saveLocalVotes(local);
          return this.calculateStats(merged);
        }
      }
    } catch {
      // Fallback to local
    }
    return this.getStats(promptId);
  }

  private getLocalVotes(): Record<string, StoredVoteData> {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_VOTES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const result: Record<string, StoredVoteData> = {};
          for (const key in parsed) {
            result[key] = this.normalizeData(key, parsed[key]);
          }
          return result;
        }

        // Migrate from legacy format if available
        const legacy = localStorage.getItem(LEGACY_VOTES_KEY);
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          const migrated: Record<string, StoredVoteData> = {};
          for (const key in parsedLegacy) {
            migrated[key] = this.normalizeData(key, parsedLegacy[key]);
          }
          this.saveLocalVotes(migrated);
          return migrated;
        }
      }
    } catch {
      // Fallback to memory
    }
    return this.memoryVotes;
  }

  private saveLocalVotes(votes: Record<string, StoredVoteData>) {
    this.memoryVotes = votes;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_VOTES_KEY, JSON.stringify(votes));
      }
    } catch {
      // Ignore quota errors
    }
  }
}

export const votingService = new VotingService();
