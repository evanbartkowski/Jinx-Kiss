import { describe, it, expect, beforeEach } from 'vitest';
import { sessionService } from '../services/sessionService';
import { reportService } from '../services/reportService';
import { drawRandomSpecialCard, getSpecialCardChance } from '../data/specialCards';
import { advanceProgressiveRound, ProgressiveDifficultyState } from '../utils/progressiveDifficulty';

describe('Session History, Deduplication & Special Cards', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deduplicates seen cards and auto-resets when all cards are exhausted', () => {
    const pool = [
      { id: 'c1', text: 'Card 1' },
      { id: 'c2', text: 'Card 2' },
      { id: 'c3', text: 'Card 3' },
    ];

    // Mark c1 and c2 as seen
    sessionService.markCardSeen('test_deck', 'c1');
    sessionService.markCardSeen('test_deck', 'c2');

    // Filter should only return c3
    const unseen1 = sessionService.filterUnseenCards('test_deck', pool);
    expect(unseen1).toHaveLength(1);
    expect(unseen1[0].id).toBe('c3');

    // Mark c3 as seen
    sessionService.markCardSeen('test_deck', 'c3');

    // Now all cards seen -> should auto-reset and return all cards
    const unseen2 = sessionService.filterUnseenCards('test_deck', pool);
    expect(unseen2).toHaveLength(3);
  });

  it('saves active session and retrieves it accurately', () => {
    sessionService.saveActiveSession({
      gameId: 'truth-or-dare',
      category: 'medium',
      players: ['Evan', 'Jordan'],
      currentRound: 3,
    });

    const active = sessionService.getActiveSession();
    expect(active).not.toBeNull();
    expect(active?.gameId).toBe('truth-or-dare');
    expect(active?.category).toBe('medium');
    expect(active?.currentRound).toBe(3);
    expect(active?.players).toEqual(['Evan', 'Jordan']);
  });

  it('allows renaming, archiving and deleting saved sessions', async () => {
    const saved = sessionService.saveActiveSession({
      name: 'Friday Night Party',
      gameId: 'chaos-mix',
      category: 'spicy',
      players: ['Sam', 'Riley'],
      currentRound: 1,
    });

    await sessionService.renameSession(saved.id, 'Epic Night Party');
    const updated = sessionService.getActiveSession();
    expect(updated?.name).toBe('Epic Night Party');

    await sessionService.toggleArchiveSession(saved.id);
    const afterArchive = sessionService.getActiveSession();
    expect(afterArchive).toBeNull(); // Archived sessions are cleared from active slot

    await sessionService.deleteSession(saved.id);
    const history = sessionService.getLocalSessionHistory();
    expect(history.find(s => s.id === saved.id)).toBeUndefined();
  });

  it('draws special cards with valid types and rarities', () => {
    const chance = getSpecialCardChance('normal');
    expect(chance).toBe(0.15);

    const highChance = getSpecialCardChance('high');
    expect(highChance).toBe(0.25);

    const card = drawRandomSpecialCard();
    expect(card).toBeDefined();
    expect(card.title).toBeTruthy();
    expect(card.rarity).toMatch(/uncommon|rare|epic|legendary/);
  });

  it('advances progressive difficulty across tiers', () => {
    let state: ProgressiveDifficultyState = {
      enabled: true,
      currentCategory: 'easy',
      initialCategory: 'easy',
      roundsPerLevel: 3,
      roundsCompletedAtTier: 0,
      totalProgressiveRounds: 0,
      isPaused: false,
      hasJustLeveledUp: false,
    };

    // Round 1
    const res1 = advanceProgressiveRound(state);
    state = res1.newState;
    expect(state.roundsCompletedAtTier).toBe(1);
    expect(state.currentCategory).toBe('easy');
    expect(res1.didLevelUp).toBe(false);

    // Round 2
    const res2 = advanceProgressiveRound(state);
    state = res2.newState;
    expect(state.roundsCompletedAtTier).toBe(2);

    // Round 3 -> Level up!
    const res3 = advanceProgressiveRound(state);
    state = res3.newState;
    expect(state.currentCategory).toBe('medium');
    expect(res3.didLevelUp).toBe(true);
    expect(state.roundsCompletedAtTier).toBe(0);
  });

  it('records card reports and handles rate limiting and card disabling', async () => {
    const report = await reportService.submitReport(
      'broken_card_1',
      'A glitchy test card',
      'truth-or-dare',
      'medium',
      'broken',
      'Spelling mistake in prompt'
    );

    expect(report.status).toBe('pending');
    expect(reportService.isCardDisabled('broken_card_1')).toBe(false);

    // Admin disables card
    reportService.disableCard('broken_card_1');
    expect(reportService.isCardDisabled('broken_card_1')).toBe(true);
  });
});
