import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetAdminBackend, seedDocument, seedPromptOverrides, storedDocument } from './mocks/adminBackend';
import { AdminService } from '../services/adminService';
import { authService } from '../services/authService';
import { deckService } from '../services/deckService';
import { setDoc } from 'firebase/firestore';
import { getPromptsForGame } from '../data/prompts';
import { CustomDeck } from '../types/deck';
import { PromptItem } from '../types/game';
import { LEGENDARY_CARDS } from '../data/prompts/legendaryCards';
import { getLegendaryCardForCategory } from '../utils/legendaryCards';
import { getPartyPromptPool } from '../utils/partyPrompts';

describe('Persistent administrator content management', () => {
  const admin = new AdminService();
  const card: PromptItem = {
    id: 'admin-test-card',
    gameId: 'hot-seat',
    category: 'easy',
    text: 'Which snack would you appoint as your personal bodyguard?',
    playMode: 'online',
  };
  const deck: CustomDeck = {
    id: 'private-deck',
    shareToken: 'shared-token',
    title: 'Private test deck',
    description: '',
    gameId: 'hot-seat',
    themeColor: '#ffffff',
    creatorUid: 'someone-else',
    creatorUsername: 'AnotherPlayer',
    visibility: 'private',
    moderationStatus: 'approved',
    cards: [card],
    playMode: 'online',
    createdAt: 10,
    updatedAt: 10,
  };
  beforeEach(() => {
    resetAdminBackend();
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(authService.requireAdmin).mockResolvedValue(undefined);
  });

  it('requires verified administration for writes and private collection reads', async () => {
    vi.mocked(authService.requireAdmin).mockRejectedValue(new Error('Administrator required'));
    await expect(admin.addOfficialPrompt(card)).rejects.toThrow('Administrator required');
    await expect(admin.updateOfficialPrompt(card.id, { text: 'Changed' })).rejects.toThrow();
    await expect(admin.getAllDecksForModeration()).rejects.toThrow();
    await expect(admin.getCollectionPage('users')).rejects.toThrow();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('publishes additions across independent browsers', async () => {
    await admin.addOfficialPrompt(card);
    localStorage.clear();
    expect(
      (await new AdminService().getAllPromptsForManager('hot-seat', 'easy', 'online')).find((p) => p.id === card.id)
    ).toEqual({ ...card, isActive: true });
  });

  it('moves built-in cards between categories and modes without leaving the old copy', async () => {
    const original = getPromptsForGame('hot-seat', 'easy')[0];
    await admin.updateOfficialPrompt(original.id, { category: 'medium', playMode: 'online' });
    localStorage.clear();
    expect((await admin.getAllPromptsForManager('hot-seat', 'easy')).some((p) => p.id === original.id)).toBe(false);
    expect(
      (await admin.getAllPromptsForManager('hot-seat', 'medium', 'online')).find((p) => p.id === original.id)
    ).toMatchObject({ category: 'medium', playMode: 'online' });
  });

  it('persists deletions as restorable tombstones and applies them to Chaos Mix', async () => {
    const original = getPromptsForGame('hot-seat', 'easy')[0];
    await admin.deleteOfficialPrompt(original.id);
    localStorage.clear();
    expect((await admin.getAllPromptsForManager('chaos-mix', 'easy')).find((p) => p.id === original.id)?.isActive).toBe(
      false
    );
    await admin.updateOfficialPrompt(original.id, { isActive: true });
    expect(storedDocument(`official_prompts/${original.id}`).isActive).toBe(true);
  });

  it('treats the cloud as authoritative over stale local prompt copies', async () => {
    localStorage.setItem('jinxkiss_official_prompts_override_v1', JSON.stringify([{ ...card, text: 'Stale text' }]));
    seedPromptOverrides([card]);
    expect(
      (await admin.getAllPromptsForManager('hot-seat', 'easy', 'online')).find((p) => p.id === card.id)?.text
    ).toBe(card.text);
  });

  it('reports write failures and leaves the saved prompt unchanged', async () => {
    seedPromptOverrides([card]);
    vi.mocked(setDoc).mockRejectedValueOnce(new Error('Permission denied'));
    await expect(
      admin.updateOfficialPrompt(card.id, { text: 'Which appliance would you hire as your campaign manager?' })
    ).rejects.toThrow('Permission denied');
    expect(storedDocument(`official_prompts/${card.id}`).text).toBe(card.text);
    expect(admin.getLocalOfficialPrompts().find((p) => p.id === card.id)?.text).toBe(card.text);
  });

  it('includes private cloud decks belonging to other users', async () => {
    seedDocument(`custom_decks/${deck.id}`, deck);
    expect(await admin.getAllDecksForModeration()).toContainEqual(deck);
  });

  it('adds, modifies, and deletes cards in another user’s private deck', async () => {
    seedDocument(`custom_decks/${deck.id}`, deck);
    const added = { ...card, id: 'second-card', text: 'Which movie villain would be the worst roommate?' };
    await admin.updateManagedDeck(deck.id, { cards: [card, added], creatorUid: 'forged-owner' });
    localStorage.clear();
    const edited = await admin.updateManagedDeck(deck.id, {
      cards: [card, { ...added, text: 'Which movie villain would run the worst coffee shop?' }],
    });
    const result = await admin.updateManagedDeck(deck.id, { cards: edited.cards.filter((c) => c.id !== card.id) });
    expect(result.creatorUid).toBe(deck.creatorUid);
    expect(result.cards).toHaveLength(1);
    expect(storedDocument(`custom_decks/${deck.id}`).cards[0].text).toContain('coffee shop');
  });

  it('rejects invalid card mechanics and mismatched deck scopes before writing', async () => {
    seedDocument(`custom_decks/${deck.id}`, deck);
    await expect(admin.updateManagedDeck(deck.id, { cards: [{ ...card, gameId: 'truth-or-dare' }] })).rejects.toThrow(
      'Truth or Dare'
    );
    await expect(admin.updateManagedDeck(deck.id, { cards: [{ ...card, playMode: 'in-person' }] })).rejects.toThrow(
      'play mode'
    );
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('does not cache failed deck writes as successful changes', async () => {
    seedDocument(`custom_decks/${deck.id}`, deck);
    vi.mocked(setDoc).mockRejectedValueOnce(new Error('Network unavailable'));
    await expect(admin.updateManagedDeck(deck.id, { cards: [] })).rejects.toThrow('Network unavailable');
    expect(storedDocument(`custom_decks/${deck.id}`).cards).toHaveLength(1);
    expect(localStorage.getItem('jinxkiss_local_decks_v1')).toBeNull();
  });

  it('honors cloud moderation over a stale public deck copy', async () => {
    const publicDeck = { ...deck, visibility: 'public' as const };
    localStorage.setItem('jinxkiss_local_decks_v1', JSON.stringify([publicDeck]));
    seedDocument(`custom_decks/${deck.id}`, { ...publicDeck, moderationStatus: 'rejected' });
    expect((await deckService.getPublicDecks()).some((d) => d.id === deck.id)).toBe(false);
  });

  it('blocks credential records and document paths in the collection browser', async () => {
    await expect(admin.getCollectionPage('credentials')).rejects.toThrow('collection path');
    await expect(admin.getCollectionPage('rooms/ABC')).rejects.toThrow('collection path');
    await expect(admin.getCollectionPage('rooms//players')).rejects.toThrow('collection path');
    seedDocument('rooms/ABC/players/player-1', { name: 'Player' });
    expect((await admin.getCollectionPage('rooms/ABC/players')).documents).toEqual([
      { id: 'player-1', data: { name: 'Player' } },
    ]);
  });

  it('includes discovered collection names without exposing credential hashes', async () => {
    seedDocument('admin_metadata/collections', { names: ['archived_events', 'credentials'] });
    const names = await admin.getCollectionNames();
    expect(names).toContain('archived_events');
    expect(names).toContain('official_prompts');
    expect(names).not.toContain('credentials');
  });

  it('includes rare cards in the editor and respects their deletions during rare draws', async () => {
    const source = LEGENDARY_CARDS[0];
    expect(
      (await admin.getAllPromptsForManager(undefined, undefined, 'in-person', true)).some((p) => p.id === source.id)
    ).toBe(true);
    expect((await admin.getAllPromptsForManager()).some((p) => p.id === source.id)).toBe(false);
    for (const prompt of LEGENDARY_CARDS.filter((p) => p.gameId === source.gameId && p.category === source.category))
      await admin.deleteOfficialPrompt(prompt.id);
    expect(getLegendaryCardForCategory(source.category, source.gameId)).toBeNull();
  });

  it('applies synced changes to party and multiplayer prompt pools', async () => {
    await admin.addOfficialPrompt(card);
    const config = { categories: ['easy'], contentBoundary: 'clean', playMode: 'online' } as any;
    expect(getPartyPromptPool('hot-seat', config).some((p) => p.id === card.id)).toBe(true);
    await admin.deleteOfficialPrompt(card.id);
    expect(getPartyPromptPool('hot-seat', config).some((p) => p.id === card.id)).toBe(false);
  });
});
