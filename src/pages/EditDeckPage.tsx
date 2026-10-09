import React from 'react';
import { CustomDeck } from '../types/deck';
import { deckService } from '../services/deckService';
import { DeckEditor } from '../components/decks/DeckEditor';
import { useAuth } from '../context/AuthContext';

interface EditDeckPageProps {
  deck: CustomDeck;
  onDeckUpdated: (deck: CustomDeck) => void;
  onCancel: () => void;
}

export const EditDeckPage: React.FC<EditDeckPageProps> = ({ deck, onDeckUpdated, onCancel }) => {
  const { currentUser } = useAuth();

  const handleSave = async (deckData: any) => {
    if (!currentUser) return;
    const updated = await deckService.updateDeck(deck.id, deckData, currentUser.uid);
    onDeckUpdated(updated);
  };

  return <DeckEditor initialDeck={deck} onSave={handleSave} onCancel={onCancel} />;
};
