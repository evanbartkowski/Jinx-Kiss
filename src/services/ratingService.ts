import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';

export interface CardRatingData {
  likes: number;
  dislikes: number;
  userVote: 'like' | 'dislike' | null;
}

const LOCAL_RATINGS_KEY = 'jinx_card_ratings';
const LOCAL_USER_VOTES_KEY = 'jinx_user_card_votes';

function getLocalUserVotes(): Record<string, 'like' | 'dislike'> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USER_VOTES_KEY) || '{}');
  } catch {
    return {};
  }
}

function setLocalUserVote(cardId: string, vote: 'like' | 'dislike') {
  const votes = getLocalUserVotes();
  votes[cardId] = vote;
  try {
    localStorage.setItem(LOCAL_USER_VOTES_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}

export const ratingService = {
  async getRating(cardId: string): Promise<CardRatingData> {
    const userVote = getLocalUserVotes()[cardId] || null;

    try {
      if (db) {
        const ratingRef = doc(db, 'card_ratings', cardId);
        const snap = await getDoc(ratingRef);
        if (snap.exists()) {
          const data = snap.data();
          return {
            likes: Number(data.likes || 0),
            dislikes: Number(data.dislikes || 0),
            userVote,
          };
        }
      }
    } catch {
      // Offline fallback
    }

    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_RATINGS_KEY) || '{}');
      const item = stored[cardId] || { likes: 0, dislikes: 0 };
      return {
        likes: item.likes,
        dislikes: item.dislikes,
        userVote,
      };
    } catch {
      return { likes: 0, dislikes: 0, userVote };
    }
  },

  async vote(cardId: string, voteType: 'like' | 'dislike'): Promise<CardRatingData> {
    const currentVotes = getLocalUserVotes();
    const previousVote = currentVotes[cardId];
    if (previousVote === voteType) {
      return this.getRating(cardId);
    }

    setLocalUserVote(cardId, voteType);

    // Update in Firestore
    try {
      if (db) {
        const ratingRef = doc(db, 'card_ratings', cardId);
        const snap = await getDoc(ratingRef);
        if (snap.exists()) {
          const updates: Record<string, unknown> = {};
          if (voteType === 'like') {
            updates.likes = increment(1);
            if (previousVote === 'dislike') updates.dislikes = increment(-1);
          } else {
            updates.dislikes = increment(1);
            if (previousVote === 'like') updates.likes = increment(-1);
          }
          await updateDoc(ratingRef, updates);
        } else {
          await setDoc(ratingRef, {
            cardId,
            likes: voteType === 'like' ? 1 : 0,
            dislikes: voteType === 'dislike' ? 1 : 0,
            updatedAt: Date.now(),
          });
        }
      }
    } catch {
      // Local fallback
    }

    // Update local storage aggregate
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_RATINGS_KEY) || '{}');
      const item = stored[cardId] || { likes: 0, dislikes: 0 };
      if (voteType === 'like') {
        item.likes += 1;
        if (previousVote === 'dislike' && item.dislikes > 0) item.dislikes -= 1;
      } else {
        item.dislikes += 1;
        if (previousVote === 'like' && item.likes > 0) item.likes -= 1;
      }
      stored[cardId] = item;
      localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }

    return this.getRating(cardId);
  },

  async reportCard(cardId: string, promptText: string, gameId: string, reason: string): Promise<boolean> {
    try {
      if (db) {
        await addDoc(collection(db, 'reports'), {
          cardId,
          promptText,
          gameId,
          reason,
          status: 'pending',
          createdAt: Date.now(),
        });
      }
    } catch {
      // Offline fallback: store in local reports list
      try {
        const localReports = JSON.parse(localStorage.getItem('jinx_local_reports') || '[]');
        localReports.push({ cardId, promptText, gameId, reason, createdAt: Date.now() });
        localStorage.setItem('jinx_local_reports', JSON.stringify(localReports));
      } catch {
        // ignore
      }
    }
    return true;
  },
};

