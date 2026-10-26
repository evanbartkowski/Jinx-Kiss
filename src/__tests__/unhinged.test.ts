import { describe, expect, it, vi } from 'vitest';
import { getPromptsForGame } from '../data/prompts';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { UNHINGED_PROMPTS, ONLINE_UNHINGED_PROMPTS, UNHINGED_LEGENDARY_CARDS, ONLINE_UNHINGED_LEGENDARY_CARDS } from '../data/prompts/unhinged';
import { GameId, PartyModeConfig, PlayMode } from '../types/game';
import { getPartyCategories, getPartyPromptPool, getPartyProgressionLadder } from '../utils/partyPrompts';
import { partyRequiresAdultConfirmation, requiresAdultConfirmation } from '../utils/contentPolicy';
import { getPromptValidationErrors } from '../utils/promptValidation';
import { advanceProgressiveRound, ProgressiveDifficultyState } from '../utils/progressiveDifficulty';
import { RESEARCHED_PROMPTS } from '../data/prompts/researchedPrompts';

vi.mock('../config/firebase', () => ({ db: undefined }));
const games = (Object.keys(GAMES_CONFIG) as GameId[]).filter(game => game !== 'chaos-mix');
const config: PartyModeConfig = { playerNames: ['Sam', 'Jo'], selectedGames: games, categories: ['unhinged'], roundCount: 10, enableChaosWheel: false, enableMysteryCards: false, enableScoring: false, timerSeconds: 0, contentBoundary: 'all' };

describe('Unhinged replacement decks', () => {
  for (const mode of ['in-person', 'online'] as PlayMode[]) {
    it(`replaces the entire ${mode} category without old cards leaking through`, () => {
      const source = [
        ...(mode === 'online' ? ONLINE_UNHINGED_PROMPTS : UNHINGED_PROMPTS),
        ...RESEARCHED_PROMPTS.filter(p => p.category === 'unhinged' && p.playMode === mode),
      ];
      const expectedIds = new Set(source.map(p => p.id));
      for (const game of games) {
        const pool = getPromptsForGame(game, 'unhinged', mode);
        expect(pool.length, game).toBeGreaterThanOrEqual(20);
        expect(pool.every(p => expectedIds.has(p.id) && p.gameId === game && p.playMode === mode)).toBe(true);
        expect(pool.flatMap(getPromptValidationErrors)).toEqual([]);
      }
      const chaos = getPromptsForGame('chaos-mix', 'unhinged', mode);
      expect(new Set(chaos.map(p => p.id))).toEqual(expectedIds);
      expect(chaos.every(p => p.originGameId && p.originGameId !== 'chaos-mix')).toBe(true);
    });
  }

  it('keeps remote and local writing distinct and replaces the rare pool too', () => {
    const local = new Set(UNHINGED_PROMPTS.map(p => p.text.toLowerCase()));
    expect(ONLINE_UNHINGED_PROMPTS.some(p => local.has(p.text.toLowerCase()))).toBe(false);
    for (const card of [...UNHINGED_LEGENDARY_CARDS, ...ONLINE_UNHINGED_LEGENDARY_CARDS]) {
      expect(card.isLegendary).toBe(true);
      expect(card.category).toBe('unhinged');
      expect(getPromptValidationErrors(card)).toEqual([]);
    }
  });
});

describe('Adult category boundaries', () => {
  it('requires adult confirmation for Unhinged, adult rooms, and progression into adult tiers', () => {
    expect(requiresAdultConfirmation('unhinged')).toBe(true);
    expect(requiresAdultConfirmation('18+')).toBe(true);
    expect(requiresAdultConfirmation('kids')).toBe(false);
    expect(partyRequiresAdultConfirmation(config)).toBe(true);
    expect(partyRequiresAdultConfirmation({ ...config, categories: ['easy'], enableProgressiveDifficulty: true })).toBe(true);
    expect(partyRequiresAdultConfirmation({ ...config, contentBoundary: 'clean', enableProgressiveDifficulty: true })).toBe(false);
  });

  it('allows non-graphic adult subject matter in Unhinged without weakening Kids or Easy', () => {
    const card = UNHINGED_PROMPTS.find(p => /sex life/.test(p.text))!;
    expect(card).toBeDefined();
    expect(getPromptValidationErrors(card)).toEqual([]);
    expect(getPromptValidationErrors({ ...card, category: 'kids' }).length).toBeGreaterThan(0);
    expect(getPromptValidationErrors({ ...card, category: 'easy' }).length).toBeGreaterThan(0);
  });

  it('excludes Unhinged from Clean pools even when requested explicitly', () => {
    const clean = { ...config, contentBoundary: 'clean' as const };
    expect(getPartyCategories(clean, 'unhinged')).toEqual(['easy']);
    for (const game of games) {
      const pool = getPartyPromptPool(game, clean, 'unhinged');
      expect(pool.length).toBeGreaterThan(0);
      expect(pool.some(p => requiresAdultConfirmation(p.category))).toBe(false);
    }
  });

  it('cannot progress a Clean or Kids party into adult Unhinged', () => {
    for (const contentBoundary of ['clean', 'kids-only'] as const) {
      const ladder = getPartyProgressionLadder({ ...config, contentBoundary });
      let state: ProgressiveDifficultyState = { enabled: true, currentCategory: 'kids', initialCategory: 'kids', roundsPerLevel: 1, roundsCompletedAtTier: 0, totalProgressiveRounds: 0, isPaused: false, hasJustLeveledUp: false };
      for (let round = 0; round < 50; round++) {
        state = advanceProgressiveRound(state, ladder).newState;
        expect(requiresAdultConfirmation(state.currentCategory)).toBe(false);
      }
    }
  });
});
