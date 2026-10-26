import credits from '../../public/prompt-sources.txt?raw';
import { describe, expect, it } from 'vitest';
import { RESEARCHED_PROMPTS } from '../data/prompts/researchedPrompts';
import { PROMPT_SOURCES } from '../data/prompts/sources';
import { getPromptsForGame } from '../data/prompts';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { getPromptValidationErrors, PROMPT_CATEGORIES } from '../utils/promptValidation';
import { promptIdeaKey } from '../utils/promptQuality';
import { GameId } from '../types/game';

describe('Researched prompt integration', () => {
  it('records a known reference and honest reuse relationship on every addition', () => {
    for (const prompt of RESEARCHED_PROMPTS) {
      const provenance = prompt.provenance!;
      const source = PROMPT_SOURCES[provenance.sourceId as keyof typeof PROMPT_SOURCES];
      expect(source, prompt.id).toBeDefined();
      expect(source.url).toMatch(/^https:\/\//);
      if (provenance.relationship === 'licensed-copy') {
        expect(source).toHaveProperty('license', 'MIT');
        expect(provenance.originalItemId).toBeTruthy();
        expect(source).toHaveProperty('licenseUrl');
      } else {
        expect(provenance.relationship).toBe('format-inspired');
        expect(provenance.originalItemId).toBeUndefined();
      }
    }
  });

  it('assigns every addition to its exact game, category, and play mode', () => {
    for (const prompt of RESEARCHED_PROMPTS) {
      expect(getPromptValidationErrors(prompt), prompt.id).toEqual([]);
      const pool = getPromptsForGame(prompt.gameId, prompt.category, prompt.playMode);
      expect(pool.find(p => p.id === prompt.id)).toEqual(prompt);
      expect(pool.filter(p => p.id === prompt.id)).toHaveLength(1);
      const otherMode = prompt.playMode === 'online' ? 'in-person' : 'online';
      expect(getPromptsForGame(prompt.gameId, prompt.category, otherMode).some(p => p.id === prompt.id)).toBe(false);
    }
  });

  it('adds material for every source game and all eight categories without duplicate ideas', () => {
    const sourceGames = (Object.keys(GAMES_CONFIG) as GameId[]).filter(id => id !== 'chaos-mix');
    for (const game of sourceGames) expect(RESEARCHED_PROMPTS.some(p => p.gameId === game), game).toBe(true);
    for (const category of PROMPT_CATEGORIES) expect(RESEARCHED_PROMPTS.some(p => p.category === category), category).toBe(true);
    expect(new Set(RESEARCHED_PROMPTS.map(p => p.id)).size).toBe(RESEARCHED_PROMPTS.length);
    expect(new Set(RESEARCHED_PROMPTS.map(p => promptIdeaKey(p.text))).size).toBe(RESEARCHED_PROMPTS.length);
  });

  it('retains source provenance when a card enters Chaos Mix', () => {
    for (const prompt of RESEARCHED_PROMPTS) {
      const chaos = getPromptsForGame('chaos-mix', prompt.category, prompt.playMode).find(p => p.id === prompt.id);
      expect(chaos?.provenance).toEqual(prompt.provenance);
      expect(chaos?.originGameId).toBe(prompt.gameId);
    }
  });

  it('ships readable source credits and the required licensed-copy notice', () => {
    for (const source of Object.values(PROMPT_SOURCES)) expect(credits).toContain(source.url);
    expect(credits).toContain('Copyright (c) 2022 Parabol');
    expect(credits).toContain('Permission is hereby granted');
    expect(credits).toContain('THE SOFTWARE IS PROVIDED "AS IS"');
  });
});
