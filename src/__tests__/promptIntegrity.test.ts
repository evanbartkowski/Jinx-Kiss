import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_DEFAULT_PROMPTS, ALL_ONLINE_PROMPTS, getPromptsForGame } from '../data/prompts';
import { LEGENDARY_CARDS } from '../data/prompts/legendaryCards';
import { ONLINE_LEGENDARY_CARDS } from '../data/prompts/online/onlineLegendaryCards';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { GameId, PartyModeConfig, PlayMode, PromptItem } from '../types/game';
import { AdminService } from '../services/adminService';
import { SubmissionService } from '../services/submissionService';
import { getLegendaryCardForCategory, rollForLegendaryCard } from '../utils/legendaryCards';
import { filterPromptsForScope, getPromptValidationErrors, PROMPT_CATEGORIES, promptContentKey } from '../utils/promptValidation';
import { getPartyPromptPool } from '../utils/partyPrompts';
import { getPromptQualityIssue, promptIdeaKey } from '../utils/promptQuality';
import { EDITORIAL_SPOTLIGHT_PROMPTS, ONLINE_EDITORIAL_SPOTLIGHT_PROMPTS } from '../data/prompts/editorialSpotlights';

vi.mock('../config/firebase', () => ({ db: undefined }));

const gameIds = Object.keys(GAMES_CONFIG) as GameId[];
const modes: PlayMode[] = ['in-person', 'online'];
const overrideKey = 'jinxkiss_official_prompts_override_v1';

describe('Official prompt content audit', () => {
  for (const mode of modes) {
    for (const gameId of gameIds) {
      it(`${mode}: ${gameId} has valid, distinct cards in every category`, () => {
        const prompts = getPromptsForGame(gameId, undefined, mode);
        expect(prompts.length).toBeGreaterThan(0);
        expect(new Set(prompts.map(p => p.id)).size).toBe(prompts.length);
        expect(new Set(prompts.map(promptContentKey)).size).toBe(prompts.length);
        expect(prompts.flatMap(p => getPromptValidationErrors(p).map(error => `${p.id}: ${error}`))).toEqual([]);
        expect(prompts.filter(p => /\([^()]*#\d+\)|absolute most honest, unfiltered opinion|impression inspired by/.test(p.text))).toEqual([]);
        for (const category of PROMPT_CATEGORIES) {
          const pool = getPromptsForGame(gameId, category, mode);
          expect(pool.length, category).toBeGreaterThan(0);
          expect(pool.every(p => p.gameId === gameId && p.category === category && (p.playMode || 'in-person') === mode)).toBe(true);
          if (gameId === 'truth-or-dare') {
            expect(pool.some(p => p.type === 'truth'), `${category} truths`).toBe(true);
            expect(pool.some(p => p.type === 'dare'), `${category} dares`).toBe(true);
          }
        }
      });
    }
  }

  it('preserves game-specific fields when deriving Chaos Mix', () => {
    for (const catalog of [ALL_DEFAULT_PROMPTS, ALL_ONLINE_PROMPTS]) {
      for (const prompt of catalog['chaos-mix']) {
        expect(prompt.originGameId).not.toBe('chaos-mix');
        const original = catalog[prompt.originGameId!].find(p => p.id === prompt.id);
        expect(original).toBeDefined();
        expect(prompt).toEqual({ ...original, gameId: 'chaos-mix', originGameId: original!.gameId });
      }
    }
  });

  it('keeps original challenges and choice cards in their proper games', () => {
    expect(ALL_DEFAULT_PROMPTS['truth-or-dare'].find(p => p.id === 'spotlight-in-person-truth-or-dare-easy-2')).toMatchObject({ type: 'dare', category: 'easy' });
    expect(ALL_DEFAULT_PROMPTS['would-you-rather'].some(p => p.type === 'dare')).toBe(false);
    const choice = ALL_DEFAULT_PROMPTS['would-you-rather'].find(p => p.id === 'spotlight-in-person-would-you-rather-kids-1');
    expect(choice?.optionA).toBeTruthy();
    expect(choice?.optionB).toBeTruthy();
  });

  it('rejects bare favorites and recycled templates while keeping specific hooks', () => {
    expect(getPromptQualityIssue('What is your favorite movie?')).toBeTruthy();
    expect(getPromptQualityIssue('What is your biggest fear?')).toBeTruthy();
    expect(getPromptQualityIssue('What is your favorite movie to quote when a robot challenges you to a cooking contest?')).toBeNull();
    expect(getPromptQualityIssue('What is your absolute most honest, unfiltered opinion or experience regarding coffee orders?')).toBeTruthy();
  });

  it('does not recycle the same idea behind decorative intensifiers', () => {
    for (const catalog of [ALL_DEFAULT_PROMPTS, ALL_ONLINE_PROMPTS]) {
      const cards = catalog['chaos-mix'];
      expect(new Set(cards.map(p => promptIdeaKey(p.text))).size).toBe(cards.length);
    }
  });

  it('provides original spotlight cards with game and category coverage in both formats', () => {
    for (const prompts of [EDITORIAL_SPOTLIGHT_PROMPTS, ONLINE_EDITORIAL_SPOTLIGHT_PROMPTS]) {
      for (const game of gameIds.filter(id => id !== 'chaos-mix')) for (const category of PROMPT_CATEGORIES) {
        expect(prompts.some(p => p.gameId === game && p.category === category)).toBe(true);
      }
    }
  });

  it('validates legendary content and never substitutes another game or Truth/Dare type', () => {
    expect([...LEGENDARY_CARDS, ...ONLINE_LEGENDARY_CARDS].flatMap(getPromptValidationErrors)).toEqual([]);
    for (const mode of modes) for (const gameId of gameIds) for (const category of PROMPT_CATEGORIES) {
      const legendary = getLegendaryCardForCategory(category, gameId, mode);
      if (legendary) {
        expect(legendary.gameId).toBe(gameId);
        expect(legendary.category).toBe(category);
        expect(legendary.playMode || 'in-person').toBe(mode);
      }
      const original = getPromptsForGame(gameId, category, mode)[0];
      const rolled = rollForLegendaryCard(original, category, gameId, 1, mode);
      expect(rolled.gameId).toBe(gameId);
      expect(rolled.category).toBe(category);
      if (original.type) expect(rolled.type).toBe(original.type);
    }
    expect(getLegendaryCardForCategory('kids', 'hot-seat', 'online')).toBeNull();
  });
});

describe('Admin prompt isolation and moderation', () => {
  const admin = new AdminService();
  beforeEach(() => localStorage.clear());

  it('keeps saved overrides scoped to their own game, category, and mode', async () => {
    const added: PromptItem[] = [
      { id: 'override-tod', gameId: 'truth-or-dare', category: 'easy', text: 'What is your funniest kitchen mishap?', type: 'truth' },
      { id: 'override-take', gameId: 'hot-takes', category: 'easy', text: 'Kitchen timers deserve a snooze button.' },
      { id: 'override-online', gameId: 'truth-or-dare', category: 'easy', playMode: 'online', text: 'What is your funniest call mishap?', type: 'truth' },
    ];
    localStorage.setItem(overrideKey, JSON.stringify(added));
    for (const mode of modes) for (const gameId of gameIds) {
      const pool = await admin.getAllPromptsForManager(gameId, 'easy', mode);
      expect(pool.every(p => p.gameId === gameId && p.category === 'easy' && (p.playMode || 'in-person') === mode)).toBe(true);
    }
  });

  it('moves a card without keeping a copy in its original category or play mode', async () => {
    const prompt = ALL_DEFAULT_PROMPTS['truth-or-dare'].find(p => p.category === 'easy' && p.type === 'truth')!;
    await admin.updateOfficialPrompt(prompt.id, { category: 'medium', playMode: 'online' });
    expect((await admin.getAllPromptsForManager('truth-or-dare', 'easy')).some(p => p.id === prompt.id)).toBe(false);
    expect((await admin.getAllPromptsForManager('truth-or-dare', 'medium', 'online')).find(p => p.id === prompt.id)).toMatchObject({ category: 'medium', playMode: 'online' });
  });

  it('keeps disabled categories empty and applies disabled overrides to Chaos Mix', async () => {
    const pool = getPromptsForGame('point-and-drink', 'kids');
    localStorage.setItem(overrideKey, JSON.stringify(pool.map(p => ({ ...p, isActive: false }))));
    const managed = await admin.getAllPromptsForManager('point-and-drink', 'kids');
    expect(filterPromptsForScope(managed, 'point-and-drink', 'kids')).toEqual([]);
    const chaos = filterPromptsForScope(await admin.getAllPromptsForManager('chaos-mix', 'kids'), 'chaos-mix', 'kids');
    expect(chaos.some(p => pool.some(disabled => disabled.id === p.id))).toBe(false);
  });

  it('can disable an online default card', async () => {
    const prompt = getPromptsForGame('hot-takes', 'kids', 'online')[0];
    await admin.deleteOfficialPrompt(prompt.id);
    expect((await admin.getAllPromptsForManager('hot-takes', 'kids', 'online')).find(p => p.id === prompt.id)?.isActive).toBe(false);
  });

  it('rejects malformed and miscategorized new cards before publishing', async () => {
    await expect(admin.addOfficialPrompt({ id: 'invalid-choice', gameId: 'would-you-rather', category: 'easy', text: 'Balance a spoon on your nose.' })).rejects.toThrow('two different');
    await expect(admin.addOfficialPrompt({ id: 'invalid-statement', gameId: 'never-have-i-ever', category: 'easy', text: 'What is your favorite snack?' })).rejects.toThrow('Never have I ever');
    await expect(admin.addOfficialPrompt({ id: 'invalid-kids', gameId: 'hot-seat', category: 'kids', text: 'What is your favorite cocktail?' })).rejects.toThrow('Kids');
    expect(admin.getLocalOfficialPrompts()).toEqual([]);
  });

  it('preserves online submissions through approval and prevents cross-game publication', async () => {
    const submission = await new SubmissionService().submitPrompt('hot-takes', 'easy', 'Video call snack breaks should be a mandatory feature.', 'test-user', 'TestUser', { playMode: 'online' });
    await admin.approveSubmission(submission.id);
    const id = `approved_${submission.id}`;
    expect((await admin.getAllPromptsForManager('hot-takes', 'easy', 'online')).some(p => p.id === id)).toBe(true);
    expect((await admin.getAllPromptsForManager('hot-takes', 'easy')).some(p => p.id === id)).toBe(false);
    expect((await admin.getAllPromptsForManager('truth-or-dare', 'easy', 'online')).some(p => p.id === id)).toBe(false);
  });

  it('does not label ordinary dirty socks or bedroom toys as adult content', () => {
    expect(getPromptValidationErrors({ id: 'safe-kids', gameId: 'hot-seat', category: 'kids', text: 'Which toy in your bedroom would help a superhero find a missing dirty sock?' })).toEqual([]);
  });
});

describe('Party and multiplayer category boundaries', () => {
  const config: PartyModeConfig = { playerNames: ['Sam', 'Jo'], selectedGames: gameIds, categories: ['couples'], roundCount: 10, enableChaosWheel: false, enableMysteryCards: false, enableScoring: false, timerSeconds: 0, contentBoundary: 'all' };
  it('uses the selected categories on every draw in either play mode', () => {
    for (const playMode of modes) for (const gameId of gameIds) {
      const pool = getPartyPromptPool(gameId, { ...config, playMode });
      expect(pool.length).toBeGreaterThan(0);
      expect(pool.every(p => p.category === 'couples' && p.gameId === gameId && (p.playMode || 'in-person') === playMode)).toBe(true);
    }
  });
  it('keeps Kids and Adults Only boundaries even when a different category is requested', () => {
    for (const playMode of modes) for (const gameId of gameIds) {
      expect(getPartyPromptPool(gameId, { ...config, playMode, contentBoundary: 'kids-only' }, '18+').every(p => p.category === 'kids')).toBe(true);
      expect(getPartyPromptPool(gameId, { ...config, playMode, contentBoundary: 'adults-only' }, 'kids').every(p => p.category === '18+')).toBe(true);
    }
  });
});
