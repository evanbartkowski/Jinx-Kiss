import React, { useState, useEffect } from 'react';
import { GameId, GameCategory, PromptItem } from '../types/game';
import { CustomDeck } from '../types/deck';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { getDefaultPromptsForGame } from '../data/prompts';
import { adminService } from '../services/adminService';
import { useGameSettings } from '../context/GameSettingsContext';
import { GameShell } from '../components/games/GameShell';

// Game implementations
import { TruthOrDareGame } from '../components/games/TruthOrDareGame';
import { NeverHaveIEverGame } from '../components/games/NeverHaveIEverGame';
import { WouldYouRatherGame } from '../components/games/WouldYouRatherGame';
import { HotTakesGame } from '../components/games/HotTakesGame';
import { DareRouletteGame } from '../components/games/DareRouletteGame';
import { RedFlagGreenFlagGame } from '../components/games/RedFlagGreenFlagGame';
import { TruthOrSipGame } from '../components/games/TruthOrSipGame';
import { PointAndDrinkGame } from '../components/games/PointAndDrinkGame';
import { MostLikelyToGame } from '../components/games/MostLikelyToGame';
import { ImposterGame } from '../components/games/ImposterGame';
import { WhosLyingGame } from '../components/games/WhosLyingGame';
import { ConfessionsGame } from '../components/games/ConfessionsGame';

interface GamePageProps {
  gameId: GameId;
  customDeck?: CustomDeck | null;
  onExit: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({ gameId, customDeck, onExit }) => {
  const { selectedCategory, setSelectedCategory, savedPlayers, setSavedPlayers } = useGameSettings();
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [gameKey, setGameKey] = useState(0); // For clean restart

  const baseMetadata = GAMES_CONFIG[gameId] || GAMES_CONFIG['truth-or-dare'];
  const metadata = customDeck
    ? {
        ...baseMetadata,
        title: customDeck.title,
        tagline: customDeck.description || baseMetadata.tagline,
        themeColor: customDeck.themeColor || baseMetadata.themeColor,
      }
    : baseMetadata;

  // Load prompts for current game & category
  useEffect(() => {
    if (customDeck) {
      setPrompts(customDeck.cards);
      return;
    }

    const loadPrompts = async () => {
      // 1. Get base curated prompts for category
      const base = getDefaultPromptsForGame(gameId, selectedCategory);

      // 2. Merge any approved community/admin prompts
      try {
        const overrides = await adminService.getAllPromptsForManager(gameId, selectedCategory);
        const activeOverrides = overrides.filter(p => p.isActive !== false);
        setPrompts(activeOverrides.length > 0 ? activeOverrides : base);
      } catch {
        setPrompts(base);
      }
    };

    loadPrompts();
  }, [gameId, selectedCategory, customDeck, gameKey]);

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
  };

  const renderActiveGame = () => {
    if (prompts.length === 0) {
      return (
        <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/10">
          <p className="text-base font-bold text-white mb-2">No prompts found for this category.</p>
          <p className="text-xs text-zinc-400">Try choosing another category or suggesting a card!</p>
        </div>
      );
    }

    switch (gameId) {
      case 'truth-or-dare':
        return <TruthOrDareGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'never-have-i-ever':
        return <NeverHaveIEverGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'would-you-rather':
        return <WouldYouRatherGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'hot-takes':
        return <HotTakesGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'dare-roulette':
        return <DareRouletteGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'red-flag-green-flag':
        return <RedFlagGreenFlagGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'truth-or-sip':
        return <TruthOrSipGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'point-and-drink':
        return <PointAndDrinkGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'most-likely-to':
        return <MostLikelyToGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'imposter':
        return <ImposterGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'whos-lying':
        return <WhosLyingGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      case 'confessions':
        return <ConfessionsGame key={gameKey} prompts={prompts} players={savedPlayers} />;
      default:
        return <TruthOrDareGame key={gameKey} prompts={prompts} players={savedPlayers} />;
    }
  };

  return (
    <GameShell
      metadata={metadata}
      category={selectedCategory}
      onCategoryChange={setSelectedCategory}
      onExit={onExit}
      onRestart={handleRestart}
      players={savedPlayers}
      onUpdatePlayers={setSavedPlayers}
      supportsNonalcoholic={gameId === 'truth-or-sip' || gameId === 'point-and-drink'}
    >
      {renderActiveGame()}
    </GameShell>
  );
};

