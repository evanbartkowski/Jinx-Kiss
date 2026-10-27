import React, { createContext, useContext } from 'react';
import { CustomDeck } from '../types/deck';

const PlayingDeckContext = createContext<CustomDeck | undefined>(undefined);
export const PlayingDeckProvider = PlayingDeckContext.Provider;
export function usePlayingDeck() {
  return useContext(PlayingDeckContext);
}
