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
        shareToken: 'jk_seed_midnight_talks',
        title: 'Midnight Confessions & 3AM Talks',
        description: 'Made this with my roommates after a bottle of wine on a Tuesday night. Raw, vulnerable, nostalgic questions for when the lights are low and nobody wants to go to sleep.',
        gameId: 'truth-or-sip',
        gameMode: 'medium',
        themeColor: '#A855F7',
        creatorUid: 'user_maya_afterhours',
        creatorUsername: 'maya_afterhours',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 5,
        playCount: 4210,
        cards: [
          { id: 'mc_1', gameId: 'truth-or-sip', category: 'medium', text: "What is something you pretend not to care about, but secretly ruins your mood when people bring it up?" },
          { id: 'mc_2', gameId: 'truth-or-sip', category: 'medium', text: "If your camera roll from last weekend was projected on a billboard, how ruined would your reputation be?" },
          { id: 'mc_3', gameId: 'truth-or-sip', category: 'medium', text: "What is a message sitting in your drafts right now that you know you'll never actually hit send on?" },
          { id: 'mc_4', gameId: 'truth-or-sip', category: 'medium', text: "Who in this room gave you the worst first impression compared to how much you genuinely love them now?" },
          { id: 'mc_5', gameId: 'truth-or-sip', category: 'medium', text: "What is a petty grudge you've been harboring for more than 3 years that you refuse to ever forgive?" },
          { id: 'mc_6', gameId: 'truth-or-sip', category: 'medium', text: "Have you ever stalked an ex's new partner so deeply that you know their second cousin's college major?" },
          { id: 'mc_7', gameId: 'truth-or-sip', category: 'medium', text: "What's an authentic compliment someone gave you that you still secretly replay in your head months later?" },
          { id: 'mc_8', gameId: 'truth-or-sip', category: 'medium', text: "What ridiculous lie did you tell your parents in high school that they still 100% believe to this day?" },
          { id: 'mc_9', gameId: 'truth-or-sip', category: 'medium', text: "Which person from your romantic past do you secretly wonder if they still ever think about you?" },
          { id: 'mc_10', gameId: 'truth-or-sip', category: 'medium', text: "What is your biggest quiet fear about where your life will be 5 years from tonight?" },
          { id: 'mc_11', gameId: 'truth-or-sip', category: 'medium', text: "Have you ever cried in a bathroom at a house party? What was the actual reason?" },
          { id: 'mc_12', gameId: 'truth-or-sip', category: 'medium', text: "What's an opinion or phase you had 2 years ago that makes you physically cringe when you look back at it?" },
          { id: 'mc_13', gameId: 'truth-or-sip', category: 'medium', text: "If you could re-live any single 24-hour day of your life with zero real-world consequences, which day would you pick?" },
          { id: 'mc_14', gameId: 'truth-or-sip', category: 'medium', text: "What is a boundary you let someone walk all over because you were too terrified of losing them?" },
          { id: 'mc_15', gameId: 'truth-or-sip', category: 'medium', text: "Who was your most embarrassing childhood celebrity crush that you hid from all your friends?" },
          { id: 'mc_16', gameId: 'truth-or-sip', category: 'medium', text: "What's something you do when you are completely alone in your apartment that you would never admit in public?" },
          { id: 'mc_17', gameId: 'truth-or-sip', category: 'medium', text: "If everyone at this table had to vote on who is the worst at texting back, would it unanimously be you?" },
          { id: 'mc_18', gameId: 'truth-or-sip', category: 'medium', text: "What was the exact moment or incident when you realized you had fallen completely out of love with someone?" },
          { id: 'mc_19', gameId: 'truth-or-sip', category: 'medium', text: "Have you ever pretended to love an obscure artist or movie just to match the vibe of someone you were flirting with?" },
          { id: 'mc_20', gameId: 'truth-or-sip', category: 'medium', text: "What's the hardest truth a close friend has ever confronted you with about your own personality?" },
          { id: 'mc_21', gameId: 'truth-or-sip', category: 'medium', text: "What's something about you that you think almost everyone misunderstands upon first meeting you?" },
          { id: 'mc_22', gameId: 'truth-or-sip', category: 'medium', text: "Take a sip if you've ever checked someone's Spotify listening activity just to see what kind of mood they were in." }
        ]
      },
      {
        id: 'seed-deck-2',
        shareToken: 'jk_seed_unhinged_pregame',
        title: 'Unhinged Pregame Energy',
        description: "Our squad's go-to pregame warmup before the Uber arrives. Fast, hilarious dares and savage questions so nobody sits around scrolling their feeds.",
        gameId: 'truth-or-dare',
        gameMode: 'unhinged',
        themeColor: '#FF4DA6',
        creatorUid: 'user_kyle_the_host',
        creatorUsername: 'kyle_the_host',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 4,
        updatedAt: Date.now() - 86400000 * 4,
        playCount: 6850,
        cards: [
          { id: 'pe_1', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Trade shoes with the person to your left for the next 3 rounds, no matter how mismatched the sizes are." },
          { id: 'pe_2', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "What is the absolute trashiest fast food meal you order at 2:30 AM when nobody is around to judge you?" },
          { id: 'pe_3', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Let the person to your right send a single emoji reaction to the 5th story on your Instagram feed." },
          { id: 'pe_4', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Do your best impression of a 90s infomercial host aggressively selling whatever beverage is closest to you." },
          { id: 'pe_5', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "What is the most completely chaotic lie you've ever told to get out of plans you were too lazy to attend?" },
          { id: 'pe_6', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Call someone not at this party, say 'I know what you did', and immediately hang up without another word." },
          { id: 'pe_7', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Speak exclusively in an over-the-top British royalty accent until your next turn or take 2 sips." },
          { id: 'pe_8', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "Who at this table would survive the shortest amount of time in a zombie apocalypse and what kills them first?" },
          { id: 'pe_9', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Let the group compose a ridiculous 3-word text and send it to your closest sibling or cousin." },
          { id: 'pe_10', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "What is the dumbest internet argument you've ever gotten passionately involved in?" },
          { id: 'pe_11', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Swap drinks with the person directly across from you and do an overdramatic toast to terrible life choices." },
          { id: 'pe_12', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "What is the most humiliating thing you have ever been caught red-handed doing?" },
          { id: 'pe_13', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Narrate the next 2 minutes of the game like a high-octane ESPN sports broadcaster calling the Super Bowl." },
          { id: 'pe_14', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "Have you ever completely made up a skill or experience on your resume? What was it?" },
          { id: 'pe_15', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Do a full dramatic runway catwalk across the room treating whatever object is in your hand like high couture." },
          { id: 'pe_16', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "What is the weirdest impulse purchase that arrived at your door after a late-night online shopping spree?" },
          { id: 'pe_17', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Let the player to your left draw a tiny smiley face or mustache on your arm with a pen." },
          { id: 'pe_18', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "What song is your ultimate guilty pleasure that you aggressively skip the second someone else enters your car?" },
          { id: 'pe_19', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Balance a plastic cup or coaster on your head while attempting to recite the alphabet backwards until you drop it." },
          { id: 'pe_20', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "If you were forced to swap lives with anyone in this room for 48 hours, whose life would you pick and why?" },
          { id: 'pe_21', gameId: 'truth-or-dare', category: 'unhinged', type: 'dare', text: "Hold an ice cube in your closed fist until it completely melts or tell your most awkward first date story." },
          { id: 'pe_22', gameId: 'truth-or-dare', category: 'unhinged', type: 'truth', text: "What is your most irrational, ridiculous pet peeve that instantly fills you with boiling rage?" }
        ]
      },
      {
        id: 'seed-deck-3',
        shareToken: 'jk_seed_moral_bankruptcy',
        title: 'Impossible Moral Dilemmas',
        description: 'Dilemmas that caused actual shouting matches in our apartment kitchen. Every option makes you question your morals and your friendships.',
        gameId: 'would-you-rather',
        gameMode: 'extreme',
        themeColor: '#06B6D4',
        creatorUid: 'user_sammy_v',
        creatorUsername: 'sammy_v',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 6,
        updatedAt: Date.now() - 86400000 * 6,
        playCount: 3190,
        cards: [
          { id: 'md_1', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Have everyone in your contacts get read receipts whenever you view their messages", optionB: "Have your full internet browser history exported as a PDF to your family group chat once a year" },
          { id: 'md_2', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Be 25 minutes late to every single appointment and event for the rest of your life", optionB: "Be 45 minutes early to every single event and have to sit alone waiting in silence" },
          { id: 'md_3', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Always have damp socks that never fully dry throughout the day", optionB: "Always have an invisible eyelash stuck in your eye that you can never blink out" },
          { id: 'md_4', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Accidentally super-like your ex's new romantic partner on a dating app", optionB: "Accidentally send a 30-second voice note of you singing off-key in the shower to your workplace boss" },
          { id: 'md_5', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Know the exact date and cause of your own death", optionB: "Know the exact unfiltered thoughts of everyone who looks at you in public spaces" },
          { id: 'md_6', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Lose the ability to listen to any music ever again", optionB: "Lose the ability to watch any movies, TV series, or video content ever again" },
          { id: 'md_7', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Live with your 16-year-old self as your roommate for a full calendar year", optionB: "Live with your most toxic ex as your roommate for 6 months" },
          { id: 'md_8', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Every time you sneeze, you involuntarily blurt out your deepest secret", optionB: "Every time you laugh, you get aggressive hiccups for 10 straight minutes" },
          { id: 'md_9', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Have an infinite credit card that can only be spent on food and travel", optionB: "Never need to sleep more than 2 hours a night and always feel 100% rested and energetic" },
          { id: 'md_10', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Be forced to speak your inner monologue out loud whenever you are in an elevator", optionB: "Have your phone's loud ringtone permanently be a recording of you sobbing" },
          { id: 'md_11', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Fight 1 horse-sized duck in an enclosed tennis court", optionB: "Fight 100 duck-sized horses in a closed garage" },
          { id: 'md_12', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Only be able to whisper for the rest of your life", optionB: "Only be able to speak at top-volume shouting for the rest of your life" },
          { id: 'md_13', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Accidentally like a 6-year-old beach photo of your partner's best friend on Instagram", optionB: "Accidentally reply-all to a company-wide email saying 'love you babe kisses'" },
          { id: 'md_14', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Always smell faintly like lukewarm hot dog water to everyone around you", optionB: "Always have slightly sticky fingers no matter how many times you scrub them with soap" },
          { id: 'md_15', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Be forced to wear socks with sandals to every wedding and funeral you attend", optionB: "Have your full Spotify Wrapped announced over the PA system at a crowded supermarket" },
          { id: 'md_16', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Give up caffeine and energy drinks completely forever", optionB: "Give up cheese, pizza, and melted dairy completely forever" },
          { id: 'md_17', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Find out your partner secretly runs a fan page for their ex's dog", optionB: "Find out your partner writes dramatic fanfiction about your friend group under an anonymous handle" },
          { id: 'md_18', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Live in a society where everyone can see your exact checking account balance at all times", optionB: "Live in a society where everyone can see your exact lifetime romantic history at all times" },
          { id: 'md_19', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Be trapped in an elevator for 4 hours with your first middle school crush", optionB: "Be trapped in an elevator for 4 hours with your most annoying boss" },
          { id: 'md_20', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Never be able to drink cold water again (only room-temperature lukewarm)", optionB: "Never be able to use a pillow when sleeping for the rest of your life" },
          { id: 'md_21', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Have your phone battery permanently capped at 14% maximum charge", optionB: "Only be able to read the internet in bright Comic Sans font" },
          { id: 'md_22', gameId: 'would-you-rather', category: 'extreme', text: "Would You Rather...", optionA: "Instantly know every lie that has ever been told to your face", optionB: "Be 100% guaranteed to never get caught in any lie you tell for the rest of your life" }
        ]
      },
      {
        id: 'seed-deck-4',
        shareToken: 'jk_seed_red_flag_museum',
        title: 'The Red Flag Hall of Fame',
        description: 'Real traits and habits people in our group chat tried to excuse or defend until things went up in flames. Vote Red Flag or Green Flag.',
        gameId: 'red-flag-green-flag',
        gameMode: 'medium',
        themeColor: '#EF4444',
        creatorUid: 'user_devon_unfiltered',
        creatorUsername: 'devon_unfiltered',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 3,
        playCount: 5430,
        cards: [
          { id: 'rf_1', gameId: 'red-flag-green-flag', category: 'medium', text: "They leave read receipts turned on, open your text immediately, but take 18 hours to reply with 'haha'." },
          { id: 'rf_2', gameId: 'red-flag-green-flag', category: 'medium', text: "They still share an active iCloud shared album with an ex from 4 years ago because 'the aesthetic was nice'." },
          { id: 'rf_3', gameId: 'red-flag-green-flag', category: 'medium', text: "They have zero posts on Instagram, follow 1,200 accounts, and have a private spam account with 9 followers." },
          { id: 'rf_4', gameId: 'red-flag-green-flag', category: 'medium', text: "They have calculated your complete astrological natal chart and compatibility before the second date has ended." },
          { id: 'rf_5', gameId: 'red-flag-green-flag', category: 'medium', text: "They order dinner for you at the restaurant without asking first, but it happens to be exactly what you were eyeing." },
          { id: 'rf_6', gameId: 'red-flag-green-flag', category: 'medium', text: "They have never had a friendship last more than two years and claim 'literally everyone in my hometown was toxic'." },
          { id: 'rf_7', gameId: 'red-flag-green-flag', category: 'medium', text: "They keep every single movie ticket stub, dried flower, and bar coaster from places you've visited together in a shoebox under their bed." },
          { id: 'rf_8', gameId: 'red-flag-green-flag', category: 'medium', text: "Their phone currently has 52,000 unread emails and 234 unread text messages sitting on the home screen." },
          { id: 'rf_9', gameId: 'red-flag-green-flag', category: 'medium', text: "They send 58-second voice notes instead of typing a simple four-word response." },
          { id: 'rf_10', gameId: 'red-flag-green-flag', category: 'medium', text: "They are wonderfully charming to your friends, but tip 10% whenever service takes more than 15 minutes." },
          { id: 'rf_11', gameId: 'red-flag-green-flag', category: 'medium', text: "They don't own a single book or piece of art, but have four decorative swords or replica anime weapons mounted on their wall." },
          { id: 'rf_12', gameId: 'red-flag-green-flag', category: 'medium', text: "They tell you you're 'genuinely not like other people' within the first 45 minutes of meeting you." },
          { id: 'rf_13', gameId: 'red-flag-green-flag', category: 'medium', text: "They immediately friend-request your siblings and close childhood friends on social media before even meeting them." },
          { id: 'rf_14', gameId: 'red-flag-green-flag', category: 'medium', text: "They refuse to share food off their plate under any circumstances, but routinely reach over and eat off yours." },
          { id: 'rf_15', gameId: 'red-flag-green-flag', category: 'medium', text: "They post dramatic quotes or thirst traps on their story 5 minutes after having a minor disagreement with you." },
          { id: 'rf_16', gameId: 'red-flag-green-flag', category: 'medium', text: "They have a public Spotify playlist titled 'Driving at 2am when nobody in this city understands me'." },
          { id: 'rf_17', gameId: 'red-flag-green-flag', category: 'medium', text: "They take 45 minutes in front of the mirror styling their hair every morning before they even brush their teeth." },
          { id: 'rf_18', gameId: 'red-flag-green-flag', category: 'medium', text: "They insist on paying for dinner every single time, but subtly bring it up as emotional leverage in future debates." },
          { id: 'rf_19', gameId: 'red-flag-green-flag', category: 'medium', text: "They remember the exact date, weather, and shirt you were wearing when you told them a casual story four months ago." },
          { id: 'rf_20', gameId: 'red-flag-green-flag', category: 'medium', text: "They have an active finsta account whose bio says 'strictly for observation and tea'." },
          { id: 'rf_21', gameId: 'red-flag-green-flag', category: 'medium', text: "They cannot fall asleep at night unless a gory true crime murder documentary is quietly playing on the TV." },
          { id: 'rf_22', gameId: 'red-flag-green-flag', category: 'medium', text: "They are still close friends with their ex's mother and receive birthday cards and homemade cookies from her." }
        ]
      },
      {
        id: 'seed-deck-5',
        shareToken: 'jk_seed_couples_deep_cut',
        title: 'Soft Romantic Tension & Chemistry',
        description: 'We made these questions on our anniversary trip cabin getaway. Warm, affectionate, emotionally vulnerable, and full of sweet romantic tension.',
        gameId: 'confessions',
        gameMode: 'couples',
        themeColor: '#EC4899',
        creatorUid: 'user_zoe_and_lucas',
        creatorUsername: 'zoe_and_lucas',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 7,
        updatedAt: Date.now() - 86400000 * 7,
        playCount: 2980,
        cards: [
          { id: 'co_1', gameId: 'confessions', category: 'couples', text: "What is something small and quiet your partner does without thinking that makes you feel deeply loved?" },
          { id: 'co_2', gameId: 'confessions', category: 'couples', text: "What was the exact moment or look from your partner that made you realize this was something real, not just a casual fling?" },
          { id: 'co_3', gameId: 'confessions', category: 'couples', text: "What specific outfit, perfume/cologne, or hairstyle on your partner secretly drives you wild every single time?" },
          { id: 'co_4', gameId: 'confessions', category: 'couples', text: "What is an inside joke between the two of you that nobody else on earth would ever understand?" },
          { id: 'co_5', gameId: 'confessions', category: 'couples', text: "If you could freeze one memory of the two of you together to replay in your dreams forever, which one is it?" },
          { id: 'co_6', gameId: 'confessions', category: 'couples', text: "What's an odd quirk your partner has that used to confuse you at first, but now you find completely adorable?" },
          { id: 'co_7', gameId: 'confessions', category: 'couples', text: "What is a song that instantly brings you back to the early fluttering butterflies of when you first started dating?" },
          { id: 'co_8', gameId: 'confessions', category: 'couples', text: "What is something your partner gently helped you realize about yourself that made you a better person?" },
          { id: 'co_9', gameId: 'confessions', category: 'couples', text: "When was the last time your partner surprised you so completely that your jaw dropped in shock?" },
          { id: 'co_10', gameId: 'confessions', category: 'couples', text: "What is a dream or secret travel destination you haven't talked about yet that you want to experience together?" },
          { id: 'co_11', gameId: 'confessions', category: 'couples', text: "What is the sweetest thing your partner has ever done for you when you were having a completely miserable day?" },
          { id: 'co_12', gameId: 'confessions', category: 'couples', text: "What is a specific physical touch or gesture that never fails to calm you down whenever you're stressed?" },
          { id: 'co_13', gameId: 'confessions', category: 'couples', text: "What is one quality in your partner's character that makes you endlessly proud to be their person?" },
          { id: 'co_14', gameId: 'confessions', category: 'couples', text: "How do you think the two of you have grown together compared to who you were on your very first date?" },
          { id: 'co_15', gameId: 'confessions', category: 'couples', text: "What is an affectionate nickname or teasing phrase that only comes out behind closed doors?" },
          { id: 'co_16', gameId: 'confessions', category: 'couples', text: "What is something your partner whispered or texted you that gave you chills you still remember?" },
          { id: 'co_17', gameId: 'confessions', category: 'couples', text: "If you had to write a single one-sentence vow right now about your partner, what would you say?" },
          { id: 'co_18', gameId: 'confessions', category: 'couples', text: "What was your very first honest thought the morning after your first sleepover together?" },
          { id: 'co_19', gameId: 'confessions', category: 'couples', text: "What is a romantic surprise or date you've secretly daydreamed of planning for your partner?" },
          { id: 'co_20', gameId: 'confessions', category: 'couples', text: "What makes you feel the safest and most genuinely at home whenever you are in your partner's arms?" },
          { id: 'co_21', gameId: 'confessions', category: 'couples', text: "What is something about your physical chemistry that still catches you off guard in the best way possible?" },
          { id: 'co_22', gameId: 'confessions', category: 'couples', text: "Look your partner in the eyes for 10 full seconds without laughing, then tell them the thing you love most about them." }
        ]
      },
      {
        id: 'seed-deck-6',
        shareToken: 'jk_seed_spicy_afterdark',
        title: 'After Hours Bedroom Tease',
        description: "Flirty, spicy dares and heated confessions for late night when the lights are dimmed. Strictly for adults who aren't afraid of a little heat.",
        gameId: 'truth-or-dare',
        gameMode: 'spicy',
        themeColor: '#F43F5E',
        creatorUid: 'user_chloe_nyc',
        creatorUsername: 'chloe_nyc',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000 * 2,
        playCount: 7820,
        cards: [
          { id: 'sp_1', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What is your absolute favorite spot on your neck or collarbone to be kissed slowly?" },
          { id: 'sp_2', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Whisper the dirtiest thought you've had today into the ear of the player of your choice." },
          { id: 'sp_3', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What is an intimate bedroom fantasy you've had that you've been too nervous to bring up yet?" },
          { id: 'sp_4', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Give a slow, teasing neck and shoulder massage to the person to your left for 30 seconds." },
          { id: 'sp_5', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What kind of dirty talk instantly turns you on versus what turns you completely off?" },
          { id: 'sp_6', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Remove one non-essential article of clothing (jacket, socks, watch, jewelry) or take 2 sips." },
          { id: 'sp_7', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What outfit, lingerie, or style on someone completely shatters your self-control?" },
          { id: 'sp_8', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Trace your finger gently along the jawline and neck of the person directly across from you." },
          { id: 'sp_9', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "Have you ever sent a spicy photo you immediately panicked about? What was the actual reaction?" },
          { id: 'sp_10', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Let the player of your choice feed you a sip of their drink or a piece of ice without using hands." },
          { id: 'sp_11', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What is the boldest, most unexpected move someone has ever made on you in bed?" },
          { id: 'sp_12', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Maintain unbroken, intense eye contact with someone in the room for 15 seconds while biting your lip." },
          { id: 'sp_13', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "Do you prefer slow, teasing romance or aggressive, intense passion when things heat up?" },
          { id: 'sp_14', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Send a suggestive 2-word text message to someone in this room right now." },
          { id: 'sp_15', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What is your biggest turn-on that sounds unusual out loud, but drives you crazy in private?" },
          { id: 'sp_16', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Hold hands with the player of your choice with fingers interlocked on the table for the next 2 rounds." },
          { id: 'sp_17', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "Where is the most adventurous or risky location you've ever hooked up with someone?" },
          { id: 'sp_18', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Gently kiss the collarbone or earlobe of the player you feel the strongest chemistry with." },
          { id: 'sp_19', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "What is the single best kiss of your life so far? Describe what made it so unforgettable." },
          { id: 'sp_20', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Show your most seductive slow-motion glance across the table to someone in the group." },
          { id: 'sp_21', gameId: 'truth-or-dare', category: 'spicy', type: 'truth', text: "Have you ever had a dream about someone in this room that made it awkward to look at them the next morning?" },
          { id: 'sp_22', gameId: 'truth-or-dare', category: 'spicy', type: 'dare', text: "Let another player whisper their secret romantic fantasy into your ear without telling anyone else." }
        ]
      },
      {
        id: 'seed-deck-7',
        shareToken: 'jk_seed_groupchat_callouts',
        title: 'Group Chat Most Likely To Call-Outs',
        description: 'Engineered specifically to ignite heated friendly arguments across the table. Count to three and point your finger with zero hesitation.',
        gameId: 'most-likely-to',
        gameMode: 'unhinged',
        themeColor: '#F59E0B',
        creatorUid: 'user_marcus_j',
        creatorUsername: 'marcus_j',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 3,
        playCount: 3670,
        cards: [
          { id: 'ml_1', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to go missing at a music festival and be found 4 hours later in backstage VIP with an Austrian DJ." },
          { id: 'ml_2', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to get arrested for something completely ridiculous like stealing an orange traffic cone at 3:15 AM." },
          { id: 'ml_3', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to accidentally start a micro-cult through a series of TikTok videos they posted as a joke." },
          { id: 'ml_4', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to start crying at an emotional dog food commercial while nursing a minor Sunday hangover." },
          { id: 'ml_5', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to drunk text their landlord asking for rent forgiveness because 'the vibes were off this month'." },
          { id: 'ml_6', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to elope and marry someone after knowing them for exactly 72 hours in Las Vegas." },
          { id: 'ml_7', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to get into a shouting match with an automated grocery self-checkout machine." },
          { id: 'ml_8', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to become an influencer whose entire internet personality is drinking oat milk matcha lattes." },
          { id: 'ml_9', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to accidentally join the mob because they thought they were invited to a private pasta tasting." },
          { id: 'ml_10', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to fake their own disappearance just to avoid confronting an awkward situationship talk." },
          { id: 'ml_11', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to spend their last $45 on an emergency tarot card reading instead of groceries." },
          { id: 'ml_12', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to get banned from an all-you-can-eat sushi buffet for taking it as a personal challenge." },
          { id: 'ml_13', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to reply to an urgent group text three weeks later with 'sorry just seeing this!!'." },
          { id: 'ml_14', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to accidentally screenshot someone's text message and send it directly back to that same person." },
          { id: 'ml_15', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to adopt three stray kittens without asking their roommates or partner first." },
          { id: 'ml_16', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to survive a real horror movie simply by being too lazy and unbothered to investigate the noise." },
          { id: 'ml_17', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to flip the board and storm out during an overly competitive game of Monopoly." },
          { id: 'ml_18', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to accidentally become a viral internet meme for tripping over something in public." },
          { id: 'ml_19', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to stay at the party until 6 AM helping the host deep-clean the kitchen to 2000s R&B." },
          { id: 'ml_20', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to convince a club bouncer they are a minor Swedish pop star and get in for free." },
          { id: 'ml_21', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to have twelve half-empty water bottles rolling around on the floor of their car right now." },
          { id: 'ml_22', gameId: 'most-likely-to', category: 'unhinged', text: "Most likely to write a bestselling tell-all memoir about our friend group in twenty years." }
        ]
      },
      {
        id: 'seed-deck-8',
        shareToken: 'jk_seed_hot_takes_warzone',
        title: 'Pop Culture & Lifestyle Hot Takes',
        description: 'Controversial opinions so heated they caused ragequits in our group calls. Pick a side, defend your hill, and no diplomatic neutral answers.',
        gameId: 'hot-takes',
        gameMode: 'medium',
        themeColor: '#8B5CF6',
        creatorUid: 'user_alexa_burns',
        creatorUsername: 'alexa_burns',
        visibility: 'public',
        moderationStatus: 'approved',
        createdAt: Date.now() - 86400000 * 4,
        updatedAt: Date.now() - 86400000 * 4,
        playCount: 4510,
        cards: [
          { id: 'ht_1', gameId: 'hot-takes', category: 'medium', text: "Watching movies and TV shows with subtitles turned on is objectively superior, even in your native language." },
          { id: 'ht_2', gameId: 'hot-takes', category: 'medium', text: "Texting someone 'can I call you real quick?' induces more pure existential dread than a tax audit." },
          { id: 'ht_3', gameId: 'hot-takes', category: 'medium', text: "Weddings with mandatory choreographed bridal party dances should be banned by international law." },
          { id: 'ht_4', gameId: 'hot-takes', category: 'medium', text: "Cereal is just cold sweet soup and anyone who pours the milk before the cereal belongs on a government watchlist." },
          { id: 'ht_5', gameId: 'hot-takes', category: 'medium', text: "Dating apps have permanently broken people's ability to approach someone organically and have a normal conversation." },
          { id: 'ht_6', gameId: 'hot-takes', category: 'medium', text: "The middle seat on an airplane is entitled to both armrests without exception, and anyone arguing otherwise is selfish." },
          { id: 'ht_7', gameId: 'hot-takes', category: 'medium', text: "90% of workplace meetings that 'could have been an email' exist solely so middle managers can justify their salary." },
          { id: 'ht_8', gameId: 'hot-takes', category: 'medium', text: "Putting hot sauce or ketchup on mac and cheese is an elite culinary choice and haters just have boring palettes." },
          { id: 'ht_9', gameId: 'hot-takes', category: 'medium', text: "If you post your gym workout on your Instagram story every single day, you are working out for social validation, not fitness." },
          { id: 'ht_10', gameId: 'hot-takes', category: 'medium', text: "Iced coffee is vastly superior to hot coffee even when it's literally snowing and 15 degrees outside." },
          { id: 'ht_11', gameId: 'hot-takes', category: 'medium', text: "Friends who constantly claim 'I'm just really bad at texting' are actually saying 'you are low priority on my notification list'." },
          { id: 'ht_12', gameId: 'hot-takes', category: 'medium', text: "Marvel superhero movies peaked at Avengers: Endgame and nearly everything released since has been corporate CGI sludge." },
          { id: 'ht_13', gameId: 'hot-takes', category: 'medium', text: "Making your bed every single morning is a pointless chore invented by people who crave the illusion of control." },
          { id: 'ht_14', gameId: 'hot-takes', category: 'medium', text: "Sharing your live phone location 24/7 with a romantic partner is unhealthy surveillance, not 'relationship goals'." },
          { id: 'ht_15', gameId: 'hot-takes', category: 'medium', text: "Karaoke is only fun when people are genuinely bad or mediocre singers. People with opera training ruin the entire room." },
          { id: 'ht_16', gameId: 'hot-takes', category: 'medium', text: "Pineapple on pizza is genuinely delicious and hating it is just a herd-mentality internet meme from 2013." },
          { id: 'ht_17', gameId: 'hot-takes', category: 'medium', text: "Birthdays for adults over 25 should last exactly one evening, not an entire self-indulgent 'birthday month'." },
          { id: 'ht_18', gameId: 'hot-takes', category: 'medium', text: "Sleeping with socks on in bed is psychopathic behavior." },
          { id: 'ht_19', gameId: 'hot-takes', category: 'medium', text: "Re-watching your favorite comfort sitcom for the 12th time is more rewarding than starting 90% of new critically acclaimed shows." },
          { id: 'ht_20', gameId: 'hot-takes', category: 'medium', text: "Unsolicited life advice given in the group chat should be punishable by an immediate 24-hour mute." },
          { id: 'ht_21', gameId: 'hot-takes', category: 'medium', text: "Cold pizza straight out of the refrigerator the morning after tastes better than when it was hot from the delivery box." },
          { id: 'ht_22', gameId: 'hot-takes', category: 'medium', text: "Taking more than 3 photos of your food at a restaurant before eating it should be socially unacceptable." }
        ]
      }
    ];
  }
}

export const deckService = new DeckService();

