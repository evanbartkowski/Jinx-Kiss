import { describe, it, expect, beforeEach } from 'vitest';
import { DeckService } from '../services/deckService';

describe('Custom Decks & Visibility Controls', () => {
  let deckService: DeckService;

  beforeEach(() => {
    localStorage.clear();
    deckService = new DeckService();
  });

  it('creates custom decks with private visibility', async () => {
    const deck = await deckService.createDeck({
      title: 'Secret Truths',
      description: 'Only for my circle',
      gameId: 'truth-or-dare',
      themeColor: '#FF4DA6',
      creatorUid: 'user_1',
      creatorUsername: 'User1',
      visibility: 'private',
      cards: [
        { id: 'c1', gameId: 'truth-or-dare', category: 'medium', text: 'Prompt 1' },
      ],
    });

    expect(deck.id).toBeDefined();
    expect(deck.shareToken).toBeDefined();
    expect(deck.visibility).toBe('private');
    expect(deck.moderationStatus).toBe('approved'); // Private decks do not need public moderation
  });

  it('prevents other users from accessing or editing private decks', async () => {
    const deck = await deckService.createDeck({
      title: 'Alice Private Vault',
      description: 'Private',
      gameId: 'hot-takes',
      themeColor: '#F97316',
      creatorUid: 'alice_123',
      creatorUsername: 'Alice',
      visibility: 'private',
      cards: [{ id: 'c1', gameId: 'hot-takes', category: 'medium', text: 'Secret opinion' }],
    });

    // Alice can access
    const aliceAccess = await deckService.getDeckByIdOrToken(deck.id, 'alice_123');
    expect(aliceAccess?.title).toBe('Alice Private Vault');

    // Bob cannot access private deck
    await expect(deckService.getDeckByIdOrToken(deck.id, 'bob_456')).rejects.toThrow(
      'This deck is private and can only be played by its creator.'
    );

    // Bob cannot edit Alice deck
    await expect(
      deckService.updateDeck(deck.id, { title: 'Hacked Title' }, 'bob_456')
    ).rejects.toThrow('You do not have permission to edit this deck.');
  });

  it('allows unlisted decks to be played by anyone with the share token', async () => {
    const deck = await deckService.createDeck({
      title: 'Unlisted College Party',
      description: 'Shareable with link',
      gameId: 'never-have-i-ever',
      themeColor: '#A855F7',
      creatorUid: 'user_1',
      creatorUsername: 'User1',
      visibility: 'unlisted',
      cards: [{ id: 'c1', gameId: 'never-have-i-ever', category: 'medium', text: 'Wild prompt' }],
    });

    // Guest or other user accessing via share token
    const sharedAccess = await deckService.getDeckByIdOrToken(deck.shareToken, undefined);
    expect(sharedAccess?.title).toBe('Unlisted College Party');
  });

  it('sets public decks to pending moderation status', async () => {
    const deck = await deckService.createDeck({
      title: 'Epic Community Deck',
      description: 'Public fun',
      gameId: 'would-you-rather',
      themeColor: '#06B6D4',
      creatorUid: 'user_1',
      creatorUsername: 'User1',
      visibility: 'public',
      cards: [{ id: 'c1', gameId: 'would-you-rather', category: 'medium', text: 'Choice A or B', optionA: 'A', optionB: 'B' }],
    });

    expect(deck.moderationStatus).toBe('pending');
  });

  it('allows guests to browse and play approved public decks without accounts', async () => {
    const publicDecks = await deckService.getPublicDecks();
    expect(publicDecks.length).toBeGreaterThan(0);
    expect(publicDecks[0].visibility).toBe('public');
    expect(publicDecks[0].moderationStatus).toBe('approved');
  });

  it('duplicates existing decks as new private copies', async () => {
    const original = (await deckService.getPublicDecks())[0];
    const copy = await deckService.duplicateDeck(original, 'new_user_88', 'CopyCreator');

    expect(copy.title).toContain('(Copy)');
    expect(copy.creatorUid).toBe('new_user_88');
    expect(copy.visibility).toBe('private');
    expect(copy.cards.length).toBe(original.cards.length);
  });
});

