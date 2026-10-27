import React, { useState, useEffect, useMemo } from 'react';
import { GameId, GameCategory, PromptItem } from '../types/game';
import { CustomDeck } from '../types/deck';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { getPromptsForGame } from '../data/prompts';
import { adminService } from '../services/adminService';
import { sessionService } from '../services/sessionService';
import { useGameSettings } from '../context/GameSettingsContext';
import { GameShell } from '../components/games/GameShell';
import { GameModeSelectScreen } from '../components/games/GameModeSelectScreen';
import { filterPromptsForScope } from '../utils/promptValidation';
import { requiresAdultConfirmation } from '../utils/contentPolicy';
import { AgeConfirmationModal } from '../components/common/AgeConfirmationModal';
import { PlayingDeckProvider } from '../context/PlayingDeckContext';
import { usePlayingDeckUpdates } from '../hooks/usePlayingDeckUpdates';
import { usePromptContentVersion } from '../hooks/useLivePrompt';
import { getCachedPromptOverrides, mergePromptOverrides } from '../utils/promptOverrides';

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
import { ConfessionsGame } from '../components/games/ConfessionsGame';
import { ChaosMixGame } from '../components/games/ChaosMixGame';
import { HotSeatGame } from '../components/games/HotSeatGame';

interface GamePageProps {
  gameId: GameId;
  customDeck?: CustomDeck | null;
  onExit: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({ gameId, customDeck: initialDeck, onExit }) => {
  const customDeck = usePlayingDeckUpdates(initialDeck);
  const contentVersion = usePromptContentVersion();
  const { selectedCategory, setSelectedCategory, savedPlayers, setSavedPlayers, playMode, setPlayMode, isAgeConfirmed, confirmAge } = useGameSettings();
  const [loadedPrompts, setPrompts] = useState<PromptItem[]>([]);
  const prompts = useMemo(() => {
    if (customDeck) {
      const mode = customDeck.playMode || 'in-person';
      const cards = customDeck.cards.map(card => ({ ...card, playMode: card.playMode || mode, ...(gameId === 'chaos-mix' && card.gameId !== 'chaos-mix' ? { originGameId: card.gameId, gameId } : {}) }));
      return filterPromptsForScope(cards, gameId, selectedCategory, mode);
    }
    const pool = mergePromptOverrides(loadedPrompts, getCachedPromptOverrides(), playMode);
    const scoped = gameId === 'chaos-mix' ? pool.map(card => ({ ...card, originGameId: card.originGameId || card.gameId, gameId })) : pool;
    return filterPromptsForScope(scoped, gameId, selectedCategory, playMode);
  }, [loadedPrompts, customDeck, gameId, selectedCategory, playMode, contentVersion]);
  const [loadedScope, setLoadedScope] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0); // For clean restart
  const [isSelectingMode, setIsSelectingMode] = useState<boolean>(!customDeck);
  const promptScope = `${gameId}_${selectedCategory}_${playMode}_${customDeck?.id || 'official'}_${gameKey}`;

  useEffect(() => {
    if (customDeck) {
      setSelectedCategory(customDeck.gameMode || customDeck.cards[0]?.category || 'medium');
      setPlayMode(customDeck.playMode || 'in-person');
    }
  }, [customDeck?.id]);

  // Clear player list when navigating away or unmounting so players must be re-entered fresh
  useEffect(() => {
    return () => {
      setSavedPlayers([]);
    };
  }, [setSavedPlayers]);

  const handleExitGame = () => {
    setSavedPlayers([]);
    onExit();
  };

  const baseMetadata = GAMES_CONFIG[gameId] || GAMES_CONFIG['truth-or-dare'];
  const metadata = customDeck
    ? {
        ...baseMetadata,
        title: customDeck.title,
        tagline: customDeck.description || baseMetadata.tagline,
        themeColor: customDeck.themeColor || baseMetadata.themeColor,
        applicableCategories: baseMetadata.applicableCategories.filter(category => customDeck.cards.some(card => card.category === category)),
      }
    : baseMetadata;

  // Load prompts for current game, category, and playMode (In-Person vs Online)
  useEffect(() => {
    let cancelled = false;
    if (customDeck) {
      const deckMode = customDeck.playMode || 'in-person';
      // Legacy custom cards inherit the deck's mode when it was stored only on
      // the deck. Explicitly different modes and categories remain isolated.
      const deckCards = customDeck.cards.map(card => ({ ...card, playMode: card.playMode || deckMode }));
      const validCards = filterPromptsForScope(deckCards, gameId, selectedCategory, deckMode);
      const unseen = sessionService.filterUnseenCards(customDeck.id, validCards);
      setPrompts(unseen);
      setLoadedScope(promptScope);
      setIsSelectingMode(false);
      sessionService.saveActiveSession({
        mode: 'solo',
        playMode,
        gameId,
        category: selectedCategory,
        customDeckId: customDeck.id,
        customDeckTitle: customDeck.title,
        players: savedPlayers,
        currentRound: 1,
      });
      return;
    }

    const loadPrompts = async () => {
      // 1. Get base curated prompts for category and playMode (isolated between In-Person and Online)
      const base = getPromptsForGame(gameId, selectedCategory, playMode);

      // 2. Merge any approved community/admin prompts
      let rawPool: PromptItem[] = base;
      try {
        const overrides = await adminService.getAllPromptsForManager(gameId, selectedCategory, playMode);
        rawPool = filterPromptsForScope(overrides, gameId, selectedCategory, playMode);
      } catch {
        rawPool = base;
      }

      if (cancelled) return;
      rawPool = filterPromptsForScope(rawPool, gameId, selectedCategory, playMode);

      // 3. Deduplicate: only show unseen cards until collection exhausted (isolated by playMode and category)
      const historyKey = `${playMode}_${gameId}_${selectedCategory}`;
      const deduplicated = sessionService.filterUnseenCards(historyKey, rawPool);
      setPrompts(deduplicated);
      setLoadedScope(promptScope);

      // 4. Auto-save session (preserve round if resuming existing session for this game & category)
      const existing = sessionService.getActiveSession();
      const isSameSession = existing && existing.gameId === gameId && existing.category === selectedCategory && existing.playMode === playMode;
      sessionService.saveActiveSession({
        mode: 'solo',
        playMode,
        gameId,
        category: selectedCategory,
        players: isSameSession && existing.players && existing.players.length > 0 ? existing.players : savedPlayers,
        currentRound: isSameSession ? existing.currentRound : 1,
      });
    };

    loadPrompts();
    return () => { cancelled = true; };
  }, [gameId, selectedCategory, customDeck?.id, gameKey, playMode]);

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
  };

  const handleShuffle = () => {
    const historyKey = customDeck ? customDeck.id : `${playMode}_${gameId}_${selectedCategory}`;
    sessionService.resetCardHistory(historyKey);
    setGameKey(prev => prev + 1);
  };

  const handleSelectMode = (cat: GameCategory, progressive?: boolean) => {
    setSelectedCategory(cat);
    setIsSelectingMode(false);
  };

  // If user is choosing a game mode (and not playing a custom deck)
  if (isSelectingMode && !customDeck) {
    return (
      <GameModeSelectScreen
        metadata={metadata}
        onSelectCategory={handleSelectMode}
        onBack={handleExitGame}
      />
    );
  }

  if (requiresAdultConfirmation(selectedCategory) && !isAgeConfirmed) {
    return <AgeConfirmationModal isOpen onConfirm={confirmAge} onCancel={handleExitGame} />;
  }

  const renderActiveGame = () => {
    if (loadedScope !== promptScope) return <p role="status" className="text-zinc-400">Loading cards…</p>;
    if (prompts.length === 0) {
      return (
        <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
          <p className="text-base font-bold text-white mb-2">No prompts found for this category.</p>
          <p className="text-xs text-zinc-400 mb-4">Try choosing another category or requesting a card to be added!</p>
          <button
            onClick={() => setIsSelectingMode(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-pink/20 border border-brand-pink/50 text-pink-300 text-xs font-bold"
          >
            Choose Another Mode
          </button>
        </div>
      );
    }

    const compKey = promptScope;

    switch (gameId) {
      case 'truth-or-dare':
        return <TruthOrDareGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'never-have-i-ever':
        return <NeverHaveIEverGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'would-you-rather':
        return <WouldYouRatherGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'hot-takes':
        return <HotTakesGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'dare-roulette':
        return <DareRouletteGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'red-flag-green-flag':
        return <RedFlagGreenFlagGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'truth-or-sip':
        return <TruthOrSipGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'point-and-drink':
        return <PointAndDrinkGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'most-likely-to':
        return <MostLikelyToGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'confessions':
        return <ConfessionsGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'chaos-mix':
        return <ChaosMixGame key={compKey} prompts={prompts} players={savedPlayers} />;
      case 'hot-seat':
        return <HotSeatGame key={compKey} prompts={prompts} players={savedPlayers} />;
      default:
        return <TruthOrDareGame key={compKey} prompts={prompts} players={savedPlayers} />;
    }
  };

  return (
    <PlayingDeckProvider value={customDeck || undefined}><GameShell
      metadata={metadata}
      category={selectedCategory}
      onCategoryChange={setSelectedCategory}
      onChangeMode={() => setIsSelectingMode(true)}
      onExit={handleExitGame}
      onRestart={handleRestart}
      onShuffle={handleShuffle}
      players={savedPlayers}
      onUpdatePlayers={setSavedPlayers}
      supportsNonalcoholic={gameId === 'truth-or-sip' || gameId === 'point-and-drink'}
    >
      {renderActiveGame()}
    </GameShell></PlayingDeckProvider>
  );
};
