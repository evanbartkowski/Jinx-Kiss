import { describe, it, expect } from 'vitest';
import { ALL_DEFAULT_PROMPTS, getDefaultPromptsForGame } from '../data/prompts';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { votingService } from '../services/votingService';
import { CHAOS_WHEEL_SEGMENTS } from '../data/chaosWheel';
import { MYSTERY_CARDS } from '../data/mysteryCards';
import { SECRET_MISSIONS } from '../data/secretMissions';
import { achievementsService } from '../services/achievementsService';
import { favoritesService } from '../services/favoritesService';
import { ratingService } from '../services/ratingService';

describe('Fourteen Playable Games & Category Filtering', () => {
  const allGameIds = Object.keys(GAMES_CONFIG) as (keyof typeof ALL_DEFAULT_PROMPTS)[];

  it('provides all fourteen games in configuration', () => {
    expect(allGameIds).toHaveLength(14);
    // Original 8 games
    expect(allGameIds).toContain('truth-or-dare');
    expect(allGameIds).toContain('never-have-i-ever');
    expect(allGameIds).toContain('would-you-rather');
    expect(allGameIds).toContain('hot-takes');
    expect(allGameIds).toContain('dare-roulette');
    expect(allGameIds).toContain('red-flag-green-flag');
    expect(allGameIds).toContain('truth-or-sip');
    expect(allGameIds).toContain('point-and-drink');
    // 6 Additional games
    expect(allGameIds).toContain('most-likely-to');
    expect(allGameIds).toContain('imposter');
    expect(allGameIds).toContain('whos-lying');
    expect(allGameIds).toContain('confessions');
    expect(allGameIds).toContain('chaos-mix');
    expect(allGameIds).toContain('hot-seat');
  });

  it('has substantial, valid prompts for every game', () => {
    allGameIds.forEach(id => {
      const prompts = ALL_DEFAULT_PROMPTS[id];
      expect(prompts).toBeDefined();
      expect(prompts.length).toBeGreaterThanOrEqual(15);
      prompts.forEach(p => {
        expect(p.text).toBeDefined();
        expect(p.category).toBeDefined();
        expect(p.gameId).toBe(id);
      });
    });
  });

  it('strictly excludes 18+ and spicy content from Kids mode', () => {
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

  it('configures exactly 12 vibrant Chaos Wheel segments with valid properties', () => {
    expect(CHAOS_WHEEL_SEGMENTS).toHaveLength(12);
    CHAOS_WHEEL_SEGMENTS.forEach(seg => {
      expect(seg.id).toBeDefined();
      expect(seg.label).toBeDefined();
      expect(seg.description).toBeDefined();
      expect(seg.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('provides rare mystery cards and secret missions with reward points', () => {
    expect(MYSTERY_CARDS.length).toBeGreaterThanOrEqual(6);
    expect(SECRET_MISSIONS.length).toBeGreaterThanOrEqual(5);

    SECRET_MISSIONS.forEach(mission => {
      expect(mission.mission).toBeDefined();
      expect(mission.rewardPoints).toBeGreaterThan(0);
    });
  });

  it('unlocks achievements and maintains uniqueness', () => {
    const ach = achievementsService.unlock('truth-teller');
    if (ach) {
      expect(ach.id).toBe('truth-teller');
      expect(ach.unlockedAt).toBeDefined();
    }
    expect(achievementsService.isUnlocked('truth-teller')).toBe(true);

    // Repeated unlock should return null (prevent duplicate)
    const repeat = achievementsService.unlock('truth-teller');
    expect(repeat).toBeNull();
  });

  it('adds and removes favorite prompt cards', () => {
    const samplePrompt = ALL_DEFAULT_PROMPTS['most-likely-to'][0];
    const isNowFav = favoritesService.toggleFavorite(samplePrompt);
    expect(isNowFav).toBe(true);
    expect(favoritesService.isFavorite(samplePrompt.id)).toBe(true);

    const isRemoved = favoritesService.toggleFavorite(samplePrompt);
    expect(isRemoved).toBe(false);
    expect(favoritesService.isFavorite(samplePrompt.id)).toBe(false);
  });
});
