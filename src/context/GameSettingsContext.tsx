import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameCategory } from '../types/game';

const CATEGORY_STORAGE_KEY = 'jinxkiss_selected_category_v1';
const PLAYERS_STORAGE_KEY = 'jinxkiss_saved_players_v1';
const AGE_CONFIRMATION_KEY = 'jinxkiss_age_confirmed_v1';
const NON_ALCOHOLIC_KEY = 'jinxkiss_non_alcoholic_v1';

interface GameSettingsContextType {
  selectedCategory: GameCategory;
  setSelectedCategory: (category: GameCategory) => void;
  savedPlayers: string[];
  setSavedPlayers: (players: string[]) => void;
  addSavedPlayer: (name: string) => void;
  removeSavedPlayer: (name: string) => void;
  isAgeConfirmed: boolean;
  confirmAge: () => void;
  isNonAlcoholic: boolean;
  setIsNonAlcoholic: (val: boolean) => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export const GameSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategoryState] = useState<GameCategory>('medium');
  const [savedPlayers, setSavedPlayersState] = useState<string[]>([]);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState<boolean>(false);
  const [isNonAlcoholic, setIsNonAlcoholicState] = useState<boolean>(false);

  useEffect(() => {
    // Restore selected category
    const storedCat = localStorage.getItem(CATEGORY_STORAGE_KEY) as GameCategory | null;
    if (storedCat) {
      setSelectedCategoryState(storedCat);
    }

    // Restore saved players (ignore legacy default ['Alex', 'Jordan', 'Sam'])
    const storedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
    if (storedPlayers) {
      try {
        const parsed = JSON.parse(storedPlayers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isLegacyDefault = parsed.length === 3 && parsed[0] === 'Alex' && parsed[1] === 'Jordan' && parsed[2] === 'Sam';
          if (!isLegacyDefault) {
            setSavedPlayersState(parsed);
          } else {
            localStorage.removeItem(PLAYERS_STORAGE_KEY);
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    // Restore age confirmation
    const storedAge = localStorage.getItem(AGE_CONFIRMATION_KEY);
    if (storedAge === 'true') {
      setIsAgeConfirmed(true);
    }

    // Restore non-alcoholic
    const storedNA = localStorage.getItem(NON_ALCOHOLIC_KEY);
    if (storedNA === 'true') {
      setIsNonAlcoholicState(true);
    }
  }, []);

  const setSelectedCategory = (category: GameCategory) => {
    setSelectedCategoryState(category);
    localStorage.setItem(CATEGORY_STORAGE_KEY, category);
  };

  const setSavedPlayers = (players: string[]) => {
    setSavedPlayersState(players);
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
  };

  const addSavedPlayer = (name: string) => {
    const clean = name.trim();
    if (!clean || savedPlayers.includes(clean)) return;
    const updated = [...savedPlayers, clean];
    setSavedPlayers(updated);
  };

  const removeSavedPlayer = (name: string) => {
    const updated = savedPlayers.filter(p => p !== name);
    setSavedPlayers(updated);
  };

  const confirmAge = () => {
    setIsAgeConfirmed(true);
    localStorage.setItem(AGE_CONFIRMATION_KEY, 'true');
  };

  const setIsNonAlcoholic = (val: boolean) => {
    setIsNonAlcoholicState(val);
    localStorage.setItem(NON_ALCOHOLIC_KEY, val ? 'true' : 'false');
  };

  return (
    <GameSettingsContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        savedPlayers,
        setSavedPlayers,
        addSavedPlayer,
        removeSavedPlayer,
        isAgeConfirmed,
        confirmAge,
        isNonAlcoholic,
        setIsNonAlcoholic,
      }}
    >
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (!context) throw new Error('useGameSettings must be used within GameSettingsProvider');
  return context;
};

