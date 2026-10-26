import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CategorySelector } from '../components/common/CategorySelector';
import { GameModeSelectScreen } from '../components/games/GameModeSelectScreen';
import { PartyModeGame } from '../components/party/PartyModeGame';
import { GameSettingsProvider } from '../context/GameSettingsContext';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { sessionService } from '../services/sessionService';
import { PartyModeConfig } from '../types/game';

vi.mock('../config/firebase', () => ({ db: undefined }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('../components/common/CardRatingBar', () => ({ CardRatingBar: () => null }));
vi.mock('../utils/audio', () => ({ soundEffects: { playClick: vi.fn(), playCardFlip: vi.fn(), playGameStart: vi.fn(), playBuzzer: vi.fn(), playTick: vi.fn() } }));

describe('Unhinged age confirmation', () => {
  let root: Root;
  let container: HTMLDivElement;
  const originalWidth = window.innerWidth;
  beforeEach(() => {
    localStorage.clear();
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    vi.restoreAllMocks();
  });
  const click = async (text: string) => {
    const button = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes(text));
    expect(button, text).toBeDefined();
    await act(async () => button!.click());
  };
  const mount = async (element: React.ReactNode) => {
    await act(async () => root.render(<GameSettingsProvider>{element}</GameSettingsProvider>));
  };

  it('does not switch the category until adult confirmation, and supports cancellation', async () => {
    const select = vi.fn();
    await mount(<CategorySelector currentCategory="easy" onSelectCategory={select} />);
    await click('Unhinged');
    expect(select).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Age Verification');
    await click('Go Back');
    expect(select).not.toHaveBeenCalled();
    await click('Unhinged');
    await click('I am 18+');
    expect(select).toHaveBeenCalledWith('unhinged');
  });

  for (const width of [390, 1024]) {
    it(`gates the ${width < 768 ? 'mobile' : 'desktop'} game launcher`, async () => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
      const launch = vi.fn();
      await mount(<GameModeSelectScreen metadata={GAMES_CONFIG['truth-or-dare']} onSelectCategory={launch} onBack={() => {}} />);
      await click('Unhinged');
      if (width >= 768) {
        await click('START GAME');
      }
      expect(launch).not.toHaveBeenCalled();
      expect(document.body.textContent).toContain('Age Verification');
      await click('I am 18+');
      expect(launch).toHaveBeenCalledWith('unhinged', false);
    });
  }

  it('gates resuming an old Unhinged session', async () => {
    sessionService.saveActiveSession({ gameId: 'truth-or-dare', category: 'unhinged', currentRound: 4 });
    const launch = vi.fn();
    await mount(<GameModeSelectScreen metadata={GAMES_CONFIG['truth-or-dare']} onSelectCategory={launch} onBack={() => {}} />);
    await click('Resume');
    expect(launch).not.toHaveBeenCalled();
    await click('I am 18+');
    expect(launch).toHaveBeenCalledWith('unhinged', false);
  });

  it('selects a desktop difficulty on the first click and starts it on the second', async () => {
    const launch = vi.fn();
    await mount(<GameModeSelectScreen metadata={GAMES_CONFIG['truth-or-dare']} onSelectCategory={launch} onBack={() => {}} />);
    await click('Easy');
    expect(launch).not.toHaveBeenCalled();
    expect(container.querySelector('button[aria-pressed="true"]')?.textContent).toContain('Easy');
    await click('Easy');
    expect(launch).toHaveBeenCalledExactlyOnceWith('easy', false);
  });

  it('selecting another difficulty does not start the previously selected one', async () => {
    const launch = vi.fn();
    await mount(<GameModeSelectScreen metadata={GAMES_CONFIG['truth-or-dare']} onSelectCategory={launch} onBack={() => {}} />);
    await click('Easy');
    await click('Extreme');
    expect(launch).not.toHaveBeenCalled();
    await click('Progressive Difficulty:');
    await click('Extreme');
    expect(launch).toHaveBeenCalledExactlyOnceWith('extreme', true);
  });

  it('keeps the adult gate on a second difficulty click and allows cancellation', async () => {
    const launch = vi.fn();
    await mount(<GameModeSelectScreen metadata={GAMES_CONFIG['truth-or-dare']} onSelectCategory={launch} onBack={() => {}} />);
    await click('Unhinged');
    expect(document.body.textContent).not.toContain('Age Verification');
    await click('Unhinged');
    expect(launch).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Age Verification');
    await click('Go Back');
    expect(launch).not.toHaveBeenCalled();
    await click('Unhinged');
    await click('I am 18+');
    expect(launch).toHaveBeenCalledExactlyOnceWith('unhinged', false);
  });

  it('does not draw a party card or start a saved round before confirmation', async () => {
    const config: PartyModeConfig = { playerNames: ['Sam', 'Jo'], selectedGames: ['truth-or-dare'], categories: ['unhinged'], roundCount: 10, enableChaosWheel: false, enableMysteryCards: false, enableSpecialCards: false, enableScoring: false, timerSeconds: 30, contentBoundary: 'all' };
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    await mount(<PartyModeGame config={config} onExit={() => {}} />);
    expect(document.body.textContent).toContain('Age Verification');
    expect(sessionService.getActiveSession()).toBeNull();
    await click('I am 18+');
    expect(document.body.textContent).not.toContain('Age Verification');
    expect(sessionService.getActiveSession()?.category).toBe('unhinged');
    expect(container.textContent).toContain('Round 1');
  });
});
