import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetAdminBackend, seedDocument, seedPromptOverrides, storedDocument } from './mocks/adminBackend';
import { GameSettingsProvider } from '../context/GameSettingsContext';
import { GamePage } from '../pages/GamePage';
import { ChaosMixGame } from '../components/games/ChaosMixGame';
import { adminService } from '../services/adminService';
import { cachePromptOverrides } from '../utils/promptOverrides';
import { setDoc } from 'firebase/firestore';
import { PromptItem } from '../types/game';
import { CustomDeck } from '../types/deck';

const account = vi.hoisted(() => ({ isAdmin: true }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => account }));
vi.mock('../context/ToastContext', () => ({ useToast: () => ({ showToast: vi.fn() }) }));
vi.mock('../components/games/GameShell', () => ({ GameShell: ({ children }: any) => <div>{children}</div> }));
vi.mock('../components/games/GameModeSelectScreen', () => ({
  GameModeSelectScreen: ({ onSelectCategory }: any) => (
    <button onClick={() => onSelectCategory('easy')}>Start game</button>
  ),
}));
vi.mock('../services/ratingService', () => ({
  ratingService: { getRating: vi.fn(async () => ({ likes: 0, dislikes: 0, userVote: null })) },
}));
vi.mock('../services/favoritesService', () => ({ favoritesService: { isFavorite: () => false } }));
vi.mock('../services/votingService', () => ({
  votingService: { recordVote: vi.fn(async () => ({ optionAPercentage: 100, optionBPercentage: 0 })) },
}));
vi.mock('../utils/audio', () => ({ soundEffects: new Proxy({}, { get: () => vi.fn() }) }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

describe('Permanent prompt editing during a running game', () => {
  const first: PromptItem = {
    id: 'live-first',
    gameId: 'hot-takes',
    category: 'easy',
    playMode: 'in-person',
    text: 'Soup deserves its own dedicated drinking fountain.',
  };
  const second: PromptItem = { ...first, id: 'live-second', text: 'Every office needs a ceremonial snack referee.' };
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    localStorage.clear();
    resetAdminBackend();
    account.isAdmin = true;
    seedPromptOverrides([first, second]);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.spyOn(adminService, 'getAllPromptsForManager').mockImplementation(async (game, category, mode) =>
      [first, second]
        .map((p) => storedDocument(`official_prompts/${p.id}`) || p)
        .filter(
          (p) =>
            (!game || p.gameId === game) &&
            (!category || p.category === category) &&
            (p.playMode || 'in-person') === (mode || 'in-person')
        )
    );
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });
  async function click(label: string) {
    const button = [...document.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === label || b.getAttribute('aria-label') === label
    );
    expect(button, label).toBeDefined();
    await act(async () => button!.click());
  }
  async function start(deck?: CustomDeck) {
    await act(async () =>
      root.render(
        <GameSettingsProvider>
          <GamePage gameId="hot-takes" customDeck={deck} onExit={() => {}} />
        </GameSettingsProvider>
      )
    );
    if (!deck) await click('Start game');
  }
  async function edit(text: string) {
    await click('Edit promptAdmin');
    const textarea = document.querySelector('[role=dialog] textarea') as HTMLTextAreaElement;
    expect(textarea).not.toBeNull();
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(textarea, text);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      document
        .querySelector('[role=dialog] form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  }

  it('saves the current official card, updates its visible text, and preserves the vote', async () => {
    await start();
    await click('Agree');
    expect(container.textContent).toContain('Next Take');
    const text = 'Office printers deserve a tiny courtroom for paper jams.';
    await edit(text);
    expect(container.textContent).toContain(text);
    expect(container.textContent).not.toContain(first.text);
    expect(container.textContent).toContain('Next Take');
    expect(storedDocument(`official_prompts/${first.id}`).text).toBe(text);
    expect(document.querySelector('[role=dialog]')).toBeNull();
    await act(async () => root.unmount());
    root = createRoot(container);
    localStorage.clear();
    await start();
    expect(container.textContent).toContain(text);
  });

  it('updates an already displayed card after an external dashboard edit', async () => {
    await start();
    await click('Agree');
    await act(async () =>
      cachePromptOverrides([{ ...first, text: 'Every elevator should have a dramatic narrator.' }, second])
    );
    expect(container.textContent).toContain('Every elevator should have a dramatic narrator.');
    expect(container.textContent).toContain('Next Take');
  });

  it('keeps the existing card and displays the failure when a permanent save is denied', async () => {
    await start();
    vi.mocked(setDoc).mockRejectedValueOnce(new Error('Permission denied'));
    await edit('Every meeting should include a mandatory kazoo solo.');
    expect(document.querySelector('[role=alert]')?.textContent).toContain('Permission denied');
    expect(container.textContent).toContain(first.text);
    expect(storedDocument(`official_prompts/${first.id}`).text).toBe(first.text);
  });

  it('removes deleted cards from the active round and future draws', async () => {
    await start();
    await act(async () => cachePromptOverrides([{ ...first, isActive: false }, second]));
    expect(container.textContent).not.toContain(first.text);
    expect(container.textContent).toContain('This card was removed');
    await click('Next card');
    expect(container.textContent).toContain(second.text);
    await act(async () =>
      cachePromptOverrides([
        { ...first, isActive: false },
        { ...second, isActive: false },
      ])
    );
    expect(container.textContent).toContain('No prompts found');
    expect(container.textContent).not.toContain(second.text);
  });

  it('does not display adult wording when a card moves out of the current category', async () => {
    await start();
    await act(async () =>
      cachePromptOverrides([{ ...first, category: '18+', text: 'Moved adult card wording' }, second])
    );
    expect(container.textContent).not.toContain('Moved adult card wording');
    expect(container.textContent).not.toContain(first.text);
  });

  it('edits the source card when it was drawn in Chaos Mix', async () => {
    const chaos = { ...first, gameId: 'chaos-mix' as const, originGameId: first.gameId };
    await act(async () => root.render(<ChaosMixGame prompts={[chaos]} players={[]} />));
    await edit('Every traffic cone should have a performance review.');
    expect(storedDocument(`official_prompts/${first.id}`)).toMatchObject({
      gameId: 'hot-takes',
      text: 'Every traffic cone should have a performance review.',
    });
    expect(storedDocument(`official_prompts/${first.id}`).originGameId).toBeUndefined();
    expect(container.textContent).toContain('Every traffic cone should have a performance review.');
  });

  it('saves deck edits to the deck without changing an official card sharing its ID', async () => {
    const deck: CustomDeck = {
      id: 'live-private-deck',
      shareToken: 'private-token',
      title: 'Private deck',
      description: '',
      gameId: 'hot-takes',
      themeColor: '#FF4DA6',
      creatorUid: 'other-player',
      creatorUsername: 'Other',
      visibility: 'private',
      moderationStatus: 'approved',
      cards: [{ ...first, text: 'The private deck version deserves its own crown.' }],
      createdAt: 1,
      updatedAt: 1,
    };
    seedDocument(`custom_decks/${deck.id}`, deck);
    await start(deck);
    await edit('Private snack cabinets require tiny security guards.');
    expect(container.textContent).toContain('Private snack cabinets require tiny security guards.');
    expect(storedDocument(`custom_decks/${deck.id}`).cards[0].text).toBe(
      'Private snack cabinets require tiny security guards.'
    );
    expect(storedDocument(`official_prompts/${first.id}`).text).toBe(first.text);
  });

  it('does not expose editing controls to regular players', async () => {
    account.isAdmin = false;
    await start();
    expect(container.querySelector('[data-admin-prompt-id]')).toBeNull();
    expect(container.textContent).toContain(first.text);
  });
});
