import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GamePage } from '../pages/GamePage';
import { GameSettingsProvider, useGameSettings } from '../context/GameSettingsContext';
import { adminService } from '../services/adminService';
import { getPromptsForGame } from '../data/prompts';
import { PromptItem } from '../types/game';
import { CustomDeck } from '../types/deck';

vi.mock('../config/firebase', () => ({ db: undefined }));
vi.mock('../components/games/GameShell', () => ({
  GameShell: ({ children, onCategoryChange }: any) => <div>
    <button onClick={() => onCategoryChange('kids')}>Kids category</button>
    <button onClick={() => onCategoryChange('easy')}>Easy category</button>
    {children}
  </div>,
}));
vi.mock('../components/games/GameModeSelectScreen', () => ({
  GameModeSelectScreen: ({ onSelectCategory }: any) => <button onClick={() => onSelectCategory('medium')}>Start game</button>,
}));
vi.mock('../components/games/TruthOrDareGame', () => ({
  TruthOrDareGame: ({ prompts, players }: { prompts: PromptItem[]; players: string[] }) => <div data-testid="game">{prompts.map(p => p.text).join(' | ')} Players: {players.join(', ')}</div>,
}));

function Controls() {
  const { setPlayMode, setSavedPlayers } = useGameSettings();
  return <>
    <button onClick={() => setPlayMode('online')}>Go online</button>
    <button onClick={() => setSavedPlayers(['Sam', 'Jo'])}>Add players</button>
  </>;
}

function deferred() {
  let resolve!: (value: PromptItem[]) => void;
  const promise = new Promise<PromptItem[]>(r => { resolve = r; });
  return { promise, resolve };
}

describe('Game prompt loading', () => {
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(() => {
    localStorage.clear();
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });
  const click = async (label: string) => {
    const button = Array.from(container.querySelectorAll('button')).find(b => b.textContent === label);
    expect(button, label).toBeDefined();
    await act(async () => button!.click());
  };
  const mount = async () => {
    await act(async () => root.render(<GameSettingsProvider><Controls /><GamePage gameId="truth-or-dare" onExit={() => {}} /></GameSettingsProvider>));
    await click('Start game');
  };

  it('discards an older category response arriving after the new category', async () => {
    const oldRequest = deferred(), newRequest = deferred();
    vi.spyOn(adminService, 'getAllPromptsForManager').mockImplementation((_game, category) => category === 'kids' ? newRequest.promise : oldRequest.promise);
    await mount();
    await click('Kids category');
    expect(container.querySelector('[role="status"]')?.textContent).toContain('Loading');
    await act(async () => newRequest.resolve([{ id: 'kids-card', gameId: 'truth-or-dare', category: 'kids', type: 'truth', text: 'Which dinosaur would win a dance contest?' }]));
    expect(container.textContent).toContain('Which dinosaur would win a dance contest?');
    await act(async () => oldRequest.resolve([{ id: 'old-card', gameId: 'truth-or-dare', category: 'medium', type: 'truth', text: 'What was your most awkward work meeting?' }]));
    expect(container.textContent).toContain('Which dinosaur would win a dance contest?');
    expect(container.textContent).not.toContain('most awkward work meeting');
  });

  it('does not display the previous mode while the online pool is loading', async () => {
    const remote = deferred();
    vi.spyOn(adminService, 'getAllPromptsForManager').mockImplementation((_game, _category, mode) => mode === 'online' ? remote.promise : Promise.resolve(getPromptsForGame('truth-or-dare', 'medium')));
    await mount();
    expect(container.querySelector('[data-testid="game"]')).not.toBeNull();
    await click('Go online');
    expect(container.querySelector('[data-testid="game"]')).toBeNull();
    await act(async () => remote.resolve([{ id: 'remote-card', gameId: 'truth-or-dare', category: 'medium', playMode: 'online', type: 'truth', text: 'What is your funniest microphone mistake?' }]));
    expect(container.textContent).toContain('funniest microphone mistake');
  });

  it('keeps a disabled category empty instead of resurrecting default cards', async () => {
    vi.spyOn(adminService, 'getAllPromptsForManager').mockResolvedValue(getPromptsForGame('truth-or-dare', 'medium').map(p => ({ ...p, isActive: false })));
    await mount();
    expect(container.textContent).toContain('No prompts found for this category.');
    expect(container.querySelector('[data-testid="game"]')).toBeNull();
  });

  it('keeps entered players when category settings cause a provider render', async () => {
    vi.spyOn(adminService, 'getAllPromptsForManager').mockImplementation((game, category, mode) => Promise.resolve(getPromptsForGame(game!, category, mode)));
    await mount();
    await click('Add players');
    expect(container.textContent).toContain('Players: Sam, Jo');
    await click('Kids category');
    expect(container.textContent).toContain('Players: Sam, Jo');
  });

  it('filters custom deck categories and inherits legacy online card metadata', async () => {
    const deck: CustomDeck = {
      id: 'custom-online', shareToken: 'test-token', title: 'Online test', description: '',
      gameId: 'truth-or-dare', gameMode: 'easy', playMode: 'online', themeColor: '#FF4DA6',
      creatorUid: 'test-user', creatorUsername: 'Tester', visibility: 'private', moderationStatus: 'approved',
      createdAt: 1, updatedAt: 1,
      cards: [
        { id: 'custom-easy', gameId: 'truth-or-dare', category: 'easy', type: 'truth', text: 'What is your favorite webcam background?' },
        { id: 'custom-kids', gameId: 'truth-or-dare', category: 'kids', type: 'truth', text: 'Which animal would make the funniest video call?' },
        { id: 'foreign-mode', gameId: 'truth-or-dare', category: 'kids', type: 'truth', playMode: 'in-person', text: 'Which snack would you share at the table?' },
      ],
    };
    await act(async () => root.render(<GameSettingsProvider><GamePage gameId="truth-or-dare" customDeck={deck} onExit={() => {}} /></GameSettingsProvider>));
    expect(container.textContent).toContain('favorite webcam background');
    expect(container.textContent).not.toContain('funniest video call');
    await click('Kids category');
    expect(container.textContent).toContain('funniest video call');
    expect(container.textContent).not.toContain('favorite webcam background');
    expect(container.textContent).not.toContain('share at the table');
  });
});
