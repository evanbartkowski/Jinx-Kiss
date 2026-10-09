import { describe, it, expect } from 'vitest';
import { ALL_DEFAULT_PROMPTS, getDefaultPromptsForGame } from '../data/prompts';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { votingService } from '../services/votingService';

describe('Eight Playable Games & Category Filtering', () => {
  const allGameIds = Object.keys(GAMES_CONFIG) as (keyof typeof ALL_DEFAULT_PROMPTS)[];

  it('provides all eight games in configuration', () => {
    expect(allGameIds).toHaveLength(8);
    expect(allGameIds).toContain('truth-or-dare');
    expect(allGameIds).toContain('never-have-i-ever');
    expect(allGameIds).toContain('would-you-rather');
    expect(allGameIds).toContain('hot-takes');
    expect(allGameIds).toContain('dare-roulette');
    expect(allGameIds).toContain('red-flag-green-flag');
    expect(allGameIds).toContain('truth-or-sip');
    expect(allGameIds).toContain('point-and-drink');
  });

  it('has substantial, valid prompts for every game', () => {
    allGameIds.forEach(id => {
      const prompts = ALL_DEFAULT_PROMPTS[id];
      expect(prompts.length).toBeGreaterThan(15);
      prompts.forEach(p => {
        expect(p.text).toBeDefined();
        expect(p.category).toBeDefined();
        expect(p.gameId).toBe(id);
      });
    });
  });

  it('strictly excludes 18+ content from Kids mode', () => {
    allGameIds.forEach(id => {
      const kidsPrompts = getDefaultPromptsForGame(id, 'kids');
      kidsPrompts.forEach(p => {
        expect(p.category).toBe('kids');
        expect(p.category).not.toBe('18+');
        expect(p.category).not.toBe('spicy');
      });
    });
  });

  it('strictly isolates 18+ prompts when 18+ category is selected', () => {
    allGameIds.forEach(id => {
      const maturePrompts = getDefaultPromptsForGame(id, '18+');
      maturePrompts.forEach(p => {
        expect(p.category).toBe('18+');
        expect(p.category).not.toBe('kids');
      });
    });
  });

  it('records votes and calculates accurate percentages in votingService', async () => {
    const promptId = 'test_wyr_1';
    const vote1 = await votingService.recordVote(promptId, 'A');
    expect(vote1.totalVotes).toBeGreaterThan(0);
    expect(vote1.optionAPercentage + vote1.optionBPercentage).toBe(100);

    const vote2 = await votingService.recordVote(promptId, 'B');
    expect(vote2.totalVotes).toBe(vote1.totalVotes + 1);
    expect(vote2.optionAPercentage + vote2.optionBPercentage).toBe(100);
  });
});
