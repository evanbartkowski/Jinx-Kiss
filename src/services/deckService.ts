import { CustomDeck, DeckVisibility } from '../types/deck';
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
   * Get all approved public community decks
   */
  async getPublicDecks(): Promise<CustomDeck[]> {
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

    return Array.from(mergedMap.values());
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
    return [
      {
        id: 'seed-deck-1',
        shareToken: 'jk_seed_midnight_vibes',
        title: 'Midnight Confessions',
        description: 'Deep, revealing questions for late night talks and best friend sleepovers.',
        gameId: 'truth-or-sip',
        gameMode: 'medium',
        themeColor: '#A855F7',
        creatorUid: 'official_jinx',
        creatorUsername: 'JinxKissOfficial',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 3,
        playCount: 1420,
        cards: [
          { id: 'c1', gameId: 'truth-or-sip', category: 'medium', text: "What is a conversation you keep putting off having with someone you care about?" },
          { id: 'c2', gameId: 'truth-or-sip', category: 'medium', text: "If you could undo one decision from this past year, what would it be?" },
          { id: 'c3', gameId: 'truth-or-sip', category: 'spicy', text: "Who was the last person you stayed up all night texting until sunrise?" },
          { id: 'c4', gameId: 'truth-or-sip', category: 'extreme', text: "What is your biggest fear regarding getting older?" },
          { id: 'c5', gameId: 'truth-or-sip', category: 'couples', text: "What song reminds you of someone you can't be with?" },
        ]
      },
      {
        id: 'seed-deck-2',
        shareToken: 'jk_seed_chaotic_dares',
        title: 'Chaotic Afterparty Dares',
        description: 'Unfiltered, hilarious challenges designed to turn up the volume on any living room party.',
        gameId: 'truth-or-dare',
        gameMode: 'extreme',
        themeColor: '#FF4DA6',
        creatorUid: 'official_jinx',
        creatorUsername: 'PartyCrew',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000 * 2,
        playCount: 2890,
        cards: [
          { id: 'c6', gameId: 'truth-or-dare', category: 'extreme', type: 'dare', text: "Put on an impromptu runway fashion show using random objects in the room as accessories." },
          { id: 'c7', gameId: 'truth-or-dare', category: 'medium', type: 'dare', text: "Let the person across from you send a single emoji to anyone in your recent texts." },
          { id: 'c8', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What is the smoothest thing someone has ever said to you that made your heart skip a beat?" },
          { id: 'c9', gameId: 'truth-or-dare', category: 'easy', type: 'dare', text: "Do your best slow-motion action movie dodge across the room." },
        ]
      },
      {
        id: 'seed-deck-3',
        shareToken: 'jk_seed_impossible_dilemmas',
        title: 'Impossible Dilemmas',
        description: 'Mind-bending Would You Rather dilemmas that tear groups apart.',
        gameId: 'would-you-rather',
        gameMode: 'spicy',
        themeColor: '#06B6D4',
        creatorUid: 'official_jinx',
        creatorUsername: 'PhilosopherKing',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 4,
        updatedAt: Date.now() - 86400000 * 4,
        playCount: 954,
        cards: [
          { id: 'c10', gameId: 'would-you-rather', category: 'medium', text: "Would You Rather...", optionA: "Live in a world where everyone knows your salary and bank balance", optionB: "Live in a world where everyone knows your exact dating history" },
          { id: 'c11', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Never be able to listen to music again", optionB: "Never be able to watch movies or shows again" },
          { id: 'c12', gameId: 'would-you-rather', category: 'easy', text: "Would You Rather...", optionA: "Have hair that changes color based on your mood", optionB: "Have your eyes glow brightly whenever you tell a lie" },
        ]
      }
    ];
  }
}

export const deckService = new DeckService();

