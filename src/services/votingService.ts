import { db } from '../config/firebase';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';

const LOCAL_VOTES_KEY = 'jinxkiss_local_votes_v1';

export interface VoteStats {
  optionACount: number;
  optionBCount: number;
  totalVotes: number;
  optionAPercentage: number;
  optionBPercentage: number;
}

export class VotingService {
  private memoryVotes: Record<string, { optionA: number; optionB: number }> = {};

  /**
   * Record a vote for a prompt
   */
  async recordVote(promptId: string, choice: 'A' | 'B'): Promise<VoteStats> {
    const local = this.getLocalVotes();
    const current = local[promptId] || {
      optionA: 55,
      optionB: 45,
    };

    if (choice === 'A') {
      current.optionA += 1;
    } else {
      current.optionB += 1;
    }

    local[promptId] = current;
    this.memoryVotes[promptId] = current;
    this.saveLocalVotes(local);

    try {
      if (db) {
        const voteDocRef = doc(db, 'game_votes', promptId);
        await updateDoc(voteDocRef, {
          [choice === 'A' ? 'optionA' : 'optionB']: increment(1),
        }).catch(async () => {
          await setDoc(voteDocRef, { optionA: current.optionA, optionB: current.optionB });
        });
      }
    } catch {
      // Fallback to local
    }

    const total = current.optionA + current.optionB;
    return {
      optionACount: current.optionA,
      optionBCount: current.optionB,
      totalVotes: total,
      optionAPercentage: total > 0 ? Math.round((current.optionA / total) * 100) : 50,
      optionBPercentage: total > 0 ? Math.round((current.optionB / total) * 100) : 50,
    };
  }

  /**
   * Get current vote stats for a prompt
   */
  getStats(promptId: string): VoteStats {
    const local = this.getLocalVotes();
    const current = local[promptId] || this.memoryVotes[promptId] || {
      optionA: 55,
      optionB: 45,
    };
    const total = current.optionA + current.optionB;
    return {
      optionACount: current.optionA,
      optionBCount: current.optionB,
      totalVotes: total,
      optionAPercentage: total > 0 ? Math.round((current.optionA / total) * 100) : 50,
      optionBPercentage: total > 0 ? Math.round((current.optionB / total) * 100) : 50,
    };
  }

  private getLocalVotes(): Record<string, { optionA: number; optionB: number }> {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_VOTES_KEY);
        return raw ? JSON.parse(raw) : this.memoryVotes;
      }
    } catch {
      // Fallback to memory
    }
    return this.memoryVotes;
  }

  private saveLocalVotes(votes: Record<string, { optionA: number; optionB: number }>) {
    this.memoryVotes = votes;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_VOTES_KEY, JSON.stringify(votes));
      }
    } catch {
      // Ignore
    }
  }
}

export const votingService = new VotingService();

