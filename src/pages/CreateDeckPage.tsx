import React from 'react';
import { CustomDeck } from '../types/deck';
import { deckService } from '../services/deckService';
import { DeckEditor } from '../components/decks/DeckEditor';

interface CreateDeckPageProps {
  onDeckCreated: (deck: CustomDeck) => void;
  onCancel: () => void;
}

export const CreateDeckPage: React.FC<CreateDeckPageProps> = ({ onDeckCreated, onCancel }) => {
  const handleSave = async (deckData: any) => {
    const created = await deckService.createDeck(deckData);
    onDeckCreated(created);
  };

  return <DeckEditor onSave={handleSave} onCancel={onCancel} />;
};
