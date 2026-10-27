import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CustomDeck } from '../types/deck';
import { cachePlayingDeck, getPlayingDeck } from '../utils/playingDeckUpdates';
import { usePromptContentVersion } from './useLivePrompt';

export function usePlayingDeckUpdates(initial?: CustomDeck | null) {
  usePromptContentVersion();
  useEffect(() => {
    if (!initial?.id || !db) return;
    return onSnapshot(
      doc(db, 'custom_decks', initial.id),
      (snapshot) => {
        if (snapshot.exists()) cachePlayingDeck({ ...snapshot.data(), id: snapshot.id } as CustomDeck);
      },
      () => {
        /* Keep the current deck available when offline. */
      }
    );
  }, [initial?.id]);
  return initial ? getPlayingDeck(initial.id) || initial : initial;
}
