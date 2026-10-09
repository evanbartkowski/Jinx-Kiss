import React, { useState } from 'react';
import { GameMetadata, GameCategory } from '../../types/game';
import { CategorySelector } from '../common/CategorySelector';
import { PlayerSetupModal } from '../common/PlayerSetupModal';
import { SuggestCardModal } from '../common/SuggestCardModal';
import { useGameSettings } from '../../context/GameSettingsContext';
import { ArrowLeft, RotateCcw, Users, PlusCircle, Coffee, Wine } from 'lucide-react';

interface GameShellProps {
  metadata: GameMetadata;
  category: GameCategory;
  onCategoryChange: (cat: GameCategory) => void;
  onExit: () => void;
  onRestart: () => void;
  activePlayerName?: string;
  players?: string[];
  onUpdatePlayers?: (players: string[]) => void;
  children: React.ReactNode;
  supportsNonalcoholic?: boolean;
}

export const GameShell: React.FC<GameShellProps> = ({
  metadata,
  category,
  onCategoryChange,
  onExit,
  onRestart,
  activePlayerName,
  players = [],
  onUpdatePlayers,
  children,
  supportsNonalcoholic = false,
}) => {
  const { isNonAlcoholic, setIsNonAlcoholic } = useGameSettings();
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  const displayTitle = category === 'kids' && metadata.kidsAlternativeTitle ? metadata.kidsAlternativeTitle : metadata.title;
  const displayTagline = category === 'kids' && metadata.kidsAlternativeTagline ? metadata.kidsAlternativeTagline : metadata.tagline;

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between py-4 px-4 sm:px-6 max-w-5xl mx-auto">
      
      {/* Top Bar Controls */}
      <div className="w-full flex flex-col gap-3 pb-4">
        <div className="flex items-center justify-between gap-2">
          
          {/* Back button */}
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-zinc-800 transition-all text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games</span>
          </button>

          {/* Game Title & Theme Badge */}
          <div className="text-center">
            <h2
              className="text-lg sm:text-2xl font-black uppercase tracking-wider"
              style={{ color: metadata.themeColor, textShadow: `0 0 15px ${metadata.themeColor}55` }}
            >
              {displayTitle}
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-medium hidden sm:block">
              {displayTagline}
            </p>
          </div>

          {/* Controls: Players & Restart */}
          <div className="flex items-center gap-1.5">
            {supportsNonalcoholic && (
              <button
                onClick={() => setIsNonAlcoholic(!isNonAlcoholic)}
                title={isNonAlcoholic ? 'Non-alcoholic mode active' : 'Normal beverage mode'}
                className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                  isNonAlcoholic
                    ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-neon-green/20'
                    : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isNonAlcoholic ? <Coffee className="w-4 h-4 text-emerald-400" /> : <Wine className="w-4 h-4" />}
              </button>
            )}

            {onUpdatePlayers && (
              <button
                onClick={() => setIsPlayerModalOpen(true)}
                title="Manage Players"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-xs font-medium"
              >
                <Users className="w-4 h-4 text-brand-pink" />
                <span className="hidden sm:inline">{players.length} Players</span>
              </button>
            )}

            <button
              onClick={onRestart}
              title="Restart Deck"
              className="p-2 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center justify-between gap-4 border-t border-b border-white/[0.06] py-1">
          <CategorySelector
            applicableCategories={metadata.applicableCategories}
            currentCategory={category}
            onSelectCategory={onCategoryChange}
          />

          {/* Active Player Turn Pill */}
          {activePlayerName && (
            <div className="flex-shrink-0 px-3 py-1 rounded-full bg-brand-pink/15 border border-brand-pink/40 text-pink-300 text-xs font-bold shadow-neon-pink/20 animate-pulse-slow">
              Turn: {activePlayerName}
            </div>
          )}
        </div>
      </div>

      {/* Main Game Playing Arena */}
      <div className="flex-1 flex flex-col justify-center items-center py-4 sm:py-8 w-full">
        {children}
      </div>

      {/* Bottom Suggest Card Button */}
      <div className="w-full pt-4 flex items-center justify-center border-t border-white/[0.06]">
        <button
          onClick={() => setIsSuggestModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-zinc-900/40 text-xs font-medium text-zinc-400 hover:text-white hover:border-brand-pink/40 hover:bg-zinc-900/80 hover:shadow-neon-pink/20 transition-all active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5 text-brand-pink" />
          <span>+ Suggest a Card</span>
        </button>
      </div>

      {/* Modals */}
      {onUpdatePlayers && (
        <PlayerSetupModal
          isOpen={isPlayerModalOpen}
          onClose={() => setIsPlayerModalOpen(false)}
          players={players}
          onUpdatePlayers={onUpdatePlayers}
        />
      )}

      <SuggestCardModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        prefilledGameId={metadata.id}
        prefilledCategory={category}
      />

    </div>
  );
};
