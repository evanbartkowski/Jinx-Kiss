import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PromptEditor } from '../components/admin/PromptEditor';
import { AuthModal } from '../components/auth/AuthModal';

const authentication = vi.hoisted(() => ({
  isAuthModalOpen: true,
  authModalMode: 'login',
  closeAuthModal: vi.fn(),
  openAuthModal: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
}));
vi.mock('../context/AuthContext', () => ({ useAuth: () => authentication }));

describe('Administrator sign-in and card editor controls', () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    authentication.authModalMode = 'login';
    vi.clearAllMocks();
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });
  async function render(component: React.ReactNode) {
    await act(async () => root.render(component));
  }
  async function input(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
    await act(async () => {
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')!.set!.call(element, value);
      element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
    });
  }
  function field(text: string) {
    return [...container.querySelectorAll('label')]
      .find((label) => label.textContent?.startsWith(text))!
      .querySelector('input, textarea, select') as HTMLInputElement;
  }
  async function submit() {
    await act(async () => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  }

  it('accepts the three-character admin password in the sign-in form', async () => {
    await render(<AuthModal />);
    const password = container.querySelector('input[type=password]') as HTMLInputElement;
    expect(password.minLength).toBe(1);
    await input(container.querySelector('input[type=text]')!, 'admin');
    await input(password, 'xyz');
    await submit();
    expect(authentication.login).toHaveBeenCalledWith('admin', 'xyz');
  });

  it('keeps normal registration password validation', async () => {
    authentication.authModalMode = 'register';
    await render(<AuthModal />);
    expect((container.querySelector('input[type=password]') as HTMLInputElement).minLength).toBe(4);
  });

  it('creates a Would You Rather card from both options without a hidden text field', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn();
    await render(
      <PromptEditor
        initial={{ gameId: 'would-you-rather', category: 'kids', playMode: 'online' }}
        onSave={save}
        onClose={close}
      />
    );
    await input(field('Option A'), 'have a backpack that tells knock-knock jokes');
    await input(field('Option B'), 'have shoes that sing every time you jump');
    await submit();
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        gameId: 'would-you-rather',
        category: 'kids',
        playMode: 'online',
        optionA: 'have a backpack that tells knock-knock jokes',
        optionB: 'have shoes that sing every time you jump',
        text: expect.stringContaining('Would you rather'),
      })
    );
    expect(close).toHaveBeenCalledOnce();
  });

  it('saves Truth or Dare type and play mode selections', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    await render(<PromptEditor onSave={save} onClose={() => {}} />);
    await input(field('Card type'), 'dare');
    await input(field('Play mode'), 'online');
    await input(field('Card text'), 'Perform a dramatic weather report about the nearest pillow.');
    await submit();
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ type: 'dare', playMode: 'online' }));
  });

  it('shows cloud errors and leaves the editor open for retry', async () => {
    const save = vi.fn().mockRejectedValue(new Error('Permission denied'));
    const close = vi.fn();
    await render(
      <PromptEditor
        initial={{ gameId: 'hot-seat', text: 'Which appliance would be the worst babysitter?' }}
        onSave={save}
        onClose={close}
      />
    );
    await submit();
    expect(container.querySelector('[role=alert]')?.textContent).toBe('Permission denied');
    expect(close).not.toHaveBeenCalled();
    expect((container.querySelector('button:not([type=button])') as HTMLButtonElement).disabled).toBe(false);
  });

  it('rejects mismatched category content before a save request', async () => {
    const save = vi.fn();
    await render(
      <PromptEditor
        initial={{ gameId: 'hot-seat', category: 'kids', text: 'Which cocktail would you order?' }}
        onSave={save}
        onClose={() => {}}
      />
    );
    await submit();
    expect(container.querySelector('[role=alert]')?.textContent).toContain('Kids cards');
    expect(save).not.toHaveBeenCalled();
  });
});
