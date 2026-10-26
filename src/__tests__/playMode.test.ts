import { describe, it, expect, beforeEach } from 'vitest';
import { getPromptsForGame, ALL_DEFAULT_PROMPTS, ALL_ONLINE_PROMPTS, ONLINE_STANDALONE_PROMPTS } from '../data/prompts';
import { getLegendaryCardForCategory, rollForLegendaryCard } from '../utils/legendaryCards';
import { deckService } from '../services/deckService';
import { adminService } from '../services/adminService';
import { multiplayerService } from '../services/multiplayerService';
import { GameId, GameCategory, PlayMode } from '../types/game';

describe('PlayMode (In-Person vs Online) Architecture', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const coreGames: GameId[] = [
    'truth-or-dare',
    'never-have-i-ever',
    'would-you-rather',
    'hot-takes',
    'dare-roulette',
    'red-flag-green-flag',
    'truth-or-sip',
    'point-and-drink',
    'most-likely-to',
    'confessions',
    'hot-seat',
    'chaos-mix',
  ];

  it('provides distinct, non-empty collections for every game in Online mode', () => {
    coreGames.forEach(gameId => {
      const onlinePrompts = getPromptsForGame(gameId, undefined, 'online');
      expect(onlinePrompts.length).toBeGreaterThan(0);
      expect(onlinePrompts.every(p => p.playMode === 'online')).toBe(true);
    });
  });

  it('guarantees at least 100 prompts for each game in Online mode', () => {
    coreGames.forEach(gameId => {
      const onlinePrompts = getPromptsForGame(gameId, undefined, 'online');
      expect(onlinePrompts.length).toBeGreaterThanOrEqual(100);
      expect(onlinePrompts.every(p => p.playMode === 'online')).toBe(true);
    });
  });

  it('keeps a distinct, playable selection in every game and online category', () => {
    const categories: GameCategory[] = ['easy', 'medium', 'extreme', 'unhinged', 'couples', '18+', 'spicy', 'kids'];
    for (const gameId of coreGames) for (const category of categories) {
      const prompts = getPromptsForGame(gameId, category, 'online');
      expect(prompts.length, `${gameId}: ${category}`).toBeGreaterThanOrEqual(3);
      expect(new Set(prompts.map(p => p.text.toLowerCase())).size).toBe(prompts.length);
    }
  });

  it('guarantees all online prompts have unique IDs', () => {
    const ids = new Set<string>();
    ONLINE_STANDALONE_PROMPTS.forEach(p => {
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
    });
    expect(ONLINE_STANDALONE_PROMPTS.length).toBeGreaterThanOrEqual(1000);
  });

  it('adminService.getAllPromptsForManager strictly isolates online prompts', async () => {
    for (const gameId of coreGames) {
      const onlinePrompts = await adminService.getAllPromptsForManager(gameId, undefined, 'online');
      expect(onlinePrompts.length).toBeGreaterThan(0);
      expect(onlinePrompts.every(p => p.playMode === 'online')).toBe(true);

      const inPersonPrompts = await adminService.getAllPromptsForManager(gameId, undefined, 'in-person');
      expect(inPersonPrompts.length).toBeGreaterThan(0);
      expect(inPersonPrompts.every(p => p.playMode !== 'online')).toBe(true);
    }
  });

  it('keeps in-person default prompts isolated from online prompts', () => {
    coreGames.forEach(gameId => {
      const inPersonPrompts = getPromptsForGame(gameId, undefined, 'in-person');
      const onlinePrompts = getPromptsForGame(gameId, undefined, 'online');

      expect(inPersonPrompts.length).toBeGreaterThan(0);
      expect(onlinePrompts.length).toBeGreaterThan(0);

      // Verify that online prompt IDs are not present in in-person prompts
      const inPersonIds = new Set(inPersonPrompts.map(p => p.id));
      onlinePrompts.forEach(p => {
        expect(inPersonIds.has(p.id)).toBe(false);
      });
    });
  });

  it('filters online prompts accurately across categories', () => {
    const categories: GameCategory[] = ['easy', 'medium', 'extreme', 'unhinged', 'couples', '18+', 'spicy', 'kids'];
    categories.forEach(cat => {
      const prompts = getPromptsForGame('truth-or-dare', cat, 'online');
      expect(prompts.length).toBeGreaterThan(0);
      expect(prompts.every(p => p.category === cat)).toBe(true);
      expect(prompts.every(p => p.playMode === 'online')).toBe(true);
    });
  });

  it('serves remote-specific legendary cards when playMode is online', () => {
    const onlineLegendary = getLegendaryCardForCategory('extreme', 'truth-or-dare', 'online');
    expect(onlineLegendary).not.toBeNull();
    expect(onlineLegendary?.isLegendary).toBe(true);
    expect(onlineLegendary?.playMode).toBe('online');

    const inPersonLegendary = getLegendaryCardForCategory('extreme', 'truth-or-dare', 'in-person');
    expect(inPersonLegendary).not.toBeNull();
    expect(inPersonLegendary?.isLegendary).toBe(true);
    expect(inPersonLegendary?.id).not.toBe(onlineLegendary?.id);
  });

  it('rollForLegendaryCard upgrades to online legendary cards for remote draws', () => {
    const fallbackPrompt = {
      id: 'test-remote-prompt',
      gameId: 'dare-roulette' as GameId,
      category: 'unhinged' as GameCategory,
      playMode: 'online' as PlayMode,
      text: 'Test remote prompt text',
    };

    // 100% chance upgrade
    const rolled = rollForLegendaryCard(fallbackPrompt, 'unhinged', 'dare-roulette', 1.0, 'online');
    expect(rolled.isLegendary).toBe(true);
    expect(rolled.playMode).toBe('online');
  });

  it('filters community decks by playMode (In-Person vs Online)', async () => {
    const inPersonDecks = await deckService.getPublicDecks('in-person');
    expect(inPersonDecks.length).toBeGreaterThan(0);
    expect(inPersonDecks.every(d => (d.playMode || 'in-person') === 'in-person')).toBe(true);

    const onlineDecks = await deckService.getPublicDecks('online');
    expect(onlineDecks.length).toBeGreaterThan(0);
    expect(onlineDecks.every(d => d.playMode === 'online')).toBe(true);
  });

  it('creates custom decks with specified playMode format', async () => {
    const deck = await deckService.createDeck({
      creatorUid: 'user_host_123',
      creatorUsername: 'host_sam',
      title: 'Virtual Trivia Night',
      description: 'Test online deck',
      gameId: 'hot-takes',
      gameMode: 'medium',
      visibility: 'public',
      playMode: 'online',
      themeColor: '#00F0FF',
      cards: [
        { id: 'c1', gameId: 'hot-takes', category: 'medium', playMode: 'online', text: 'Prompt 1' },
      ],
    });

    expect(deck.playMode).toBe('online');
  });

  it('persists and updates playMode in multiplayer rooms', async () => {
    const { roomCode } = await multiplayerService.createRoom(
      'Host Player',
      {
        playerNames: ['Host Player'],
        selectedGames: ['truth-or-dare'],
        categories: ['medium'],
        roundCount: 10,
        enableChaosWheel: false,
        enableMysteryCards: false,
        enableScoring: true,
        timerSeconds: 30,
        contentBoundary: 'all',
      },
      'online'
    );

    let roomSnapshot: any = null;
    const unsub = multiplayerService.subscribeToRoom(roomCode, (room) => {
      roomSnapshot = room;
    });

    expect(roomSnapshot?.playMode).toBe('online');

    // Host updates room playMode to in-person
    await multiplayerService.updateRoomPlayMode(roomCode, 'in-person');
    expect(roomSnapshot?.playMode).toBe('in-person');

    unsub();
  });
});
