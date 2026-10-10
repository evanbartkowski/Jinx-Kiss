import { CustomDeck, DeckVisibility } from '../types/deck';
import { PlayMode } from '../types/game';
import { SEED_COMMUNITY_DECKS } from '../data/communityDecksSeed';
import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

const LOCAL_DECKS_KEY = 'jinxkiss_local_decks_v1';

export class DeckService {
  /**
   * Get all custom decks created by a user
   */
  async getUserDecks(creatorUid: string): Promise<CustomDeck[]> {
    const localDecks = this.getLocalDecks().filter(d => d.creatorUid === creatorUid);

    try {
      if (db) {
        const q = query(collection(db, 'custom_decks'), where('creatorUid', '==', creatorUid));
        const snapshot = await getDocs(q);
        const cloudDecks: CustomDeck[] = [];
        snapshot.forEach(docSnap => cloudDecks.push(docSnap.data() as CustomDeck));
        if (cloudDecks.length > 0) {
          return cloudDecks;
        }
      }
    } catch (e) {
      console.warn('Firestore getUserDecks fallback to local:', e);
    }

    return localDecks;
  }

  /**
   * Get all approved public community decks, optionally filtered by playMode
   */
  async getPublicDecks(playMode?: PlayMode): Promise<CustomDeck[]> {
    const localPublic = this.getLocalDecks().filter(d => d.visibility === 'public');
    const mergedMap = new Map<string, CustomDeck>();

    // Load default seed community decks
    this.getSeedCommunityDecks().forEach(d => mergedMap.set(d.id, d));

    try {
      if (db) {
        const q = query(
          collection(db, 'custom_decks'),
          where('visibility', '==', 'public')
        );
        const snapshot = await getDocs(q);
        snapshot.forEach(docSnap => {
          const deck = docSnap.data() as CustomDeck;
          mergedMap.set(deck.id, deck);
        });
      }
    } catch (e) {
      console.warn('Firestore getPublicDecks fallback to local:', e);
    }

    // Local user public decks take precedence and are immediately included
    localPublic.forEach(d => mergedMap.set(d.id, d));

    const allDecks = Array.from(mergedMap.values());
    if (!playMode) return allDecks;

    // Filter by playMode (treat undefined as in-person for full backward compatibility)
    return allDecks.filter(d => (d.playMode || 'in-person') === playMode);
  }

  /**
   * Get a deck by ID or share token (for unlisted/private access)
   */
  async getDeckByIdOrToken(idOrToken: string, currentUid?: string): Promise<CustomDeck | null> {
    const allLocal = this.getLocalDecks();
    const local = allLocal.find(d => d.id === idOrToken || d.shareToken === idOrToken);

    if (local) {
      if (local.visibility === 'private' && local.creatorUid !== currentUid) {
        throw new Error('This deck is private and can only be played by its creator.');
      }
      return local;
    }

    try {
      if (db) {
        const docSnap = await getDoc(doc(db, 'custom_decks', idOrToken));
        if (docSnap.exists()) {
          const deck = docSnap.data() as CustomDeck;
          if (deck.visibility === 'private' && deck.creatorUid !== currentUid) {
            throw new Error('This deck is private and can only be played by its creator.');
          }
          return deck;
        }
      }
    } catch (e) {
      console.warn('Firestore getDeck fallback:', e);
    }

    return null;
  }

  /**
   * Create a new custom deck
   */
  async createDeck(deckData: Omit<CustomDeck, 'id' | 'shareToken' | 'createdAt' | 'updatedAt' | 'moderationStatus'>): Promise<CustomDeck> {
    const id = 'deck_' + Math.random().toString(36).substring(2, 11);
    const shareToken = 'jk_' + Math.random().toString(36).substring(2, 15);
    const now = Date.now();

    const newDeck: CustomDeck = {
      ...deckData,
      id,
      shareToken,
      playMode: deckData.playMode || 'in-person',
      moderationStatus: 'approved',
      createdAt: now,
      updatedAt: now,
      playCount: 0,
    };

    // Save locally
    const current = this.getLocalDecks();
    current.push(newDeck);
    this.saveLocalDecks(current);

    // Save to Firestore
    try {
      if (db) {
        await setDoc(doc(db, 'custom_decks', id), newDeck);
      }
    } catch (e) {
      console.warn('Firestore createDeck fallback:', e);
    }

    return newDeck;
  }

  /**
   * Update an existing deck
   */
  async updateDeck(deckId: string, updates: Partial<CustomDeck>, currentUid: string): Promise<CustomDeck> {
    const all = this.getLocalDecks();
    const index = all.findIndex(d => d.id === deckId);
    if (index === -1) {
      throw new Error('Deck not found.');
    }

    if (all[index].creatorUid !== currentUid) {
      throw new Error('You do not have permission to edit this deck.');
    }

    // Public decks remain instantly available
    const moderationStatus = 'approved';

    const updated: CustomDeck = {
      ...all[index],
      ...updates,
      moderationStatus,
      updatedAt: Date.now(),
    };

    all[index] = updated;
    this.saveLocalDecks(all);

    try {
      if (db) {
        await updateDoc(doc(db, 'custom_decks', deckId), updated as any);
      }
    } catch (e) {
      console.warn('Firestore updateDeck fallback:', e);
    }

    return updated;
  }

  /**
   * Delete a deck
   */
  async deleteDeck(deckId: string, currentUid: string): Promise<void> {
    const all = this.getLocalDecks();
    const target = all.find(d => d.id === deckId);
    if (!target) return;

    if (target.creatorUid !== currentUid) {
      throw new Error('You do not have permission to delete this deck.');
    }

    const filtered = all.filter(d => d.id !== deckId);
    this.saveLocalDecks(filtered);

    try {
      if (db) {
        await deleteDoc(doc(db, 'custom_decks', deckId));
      }
    } catch (e) {
      console.warn('Firestore deleteDeck fallback:', e);
    }
  }

  /**
   * Duplicate a deck
   */
  async duplicateDeck(deck: CustomDeck, currentUid: string, currentUsername: string): Promise<CustomDeck> {
    return this.createDeck({
      title: `${deck.title} (Copy)`,
      description: deck.description,
      gameId: deck.gameId,
      themeColor: deck.themeColor,
      creatorUid: currentUid,
      creatorUsername: currentUsername,
      visibility: 'private',
      cards: deck.cards.map(c => ({ ...c, id: 'card_' + Math.random().toString(36).substring(2, 9) })),
    });
  }

  private getLocalDecks(): CustomDeck[] {
    try {
      const raw = localStorage.getItem(LOCAL_DECKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalDecks(decks: CustomDeck[]) {
    try {
      localStorage.setItem(LOCAL_DECKS_KEY, JSON.stringify(decks));
    } catch (e) {
      console.warn('Failed to save local decks', e);
    }
  }

  private getSeedCommunityDecks(): CustomDeck[] {
    return SEED_COMMUNITY_DECKS;
  }
}

export const deckService = new DeckService();

