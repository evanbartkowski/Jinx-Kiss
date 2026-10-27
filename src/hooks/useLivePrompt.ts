import { Dispatch, SetStateAction, useState, useSyncExternalStore } from 'react';
import { PromptItem } from '../types/game';
import { usePlayingDeck } from '../context/PlayingDeckContext';
import { getPromptContentVersion, resolveLivePrompt, subscribePromptContent } from '../utils/promptOverrides';

export function usePromptContentVersion() {
  return useSyncExternalStore(subscribePromptContent, getPromptContentVersion, getPromptContentVersion);
}

export function useLivePrompt(prompt: PromptItem | null | undefined): PromptItem | null {
  usePromptContentVersion();
  const deck = usePlayingDeck();
  return resolveLivePrompt(prompt || null, deck);
}

export function useLivePromptState<T extends PromptItem | null>(
  initial: T | (() => T)
): [PromptItem | null, Dispatch<SetStateAction<T>>] {
  const [prompt, setPrompt] = useState(initial);
  return [useLivePrompt(prompt), setPrompt];
}
