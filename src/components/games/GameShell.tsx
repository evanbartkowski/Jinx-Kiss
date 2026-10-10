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
  onChangeMode?: () => void;
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
  onChangeMode,
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

  const hasPlayers = players && players.length > 0;

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between py-4 px-4 sm:px-8 xl:px-12">
      {/* Top Bar Controls */}
      <div className="w-full flex flex-col gap-3 pb-4">
        <div className="flex items-center justify-between gap-2">
          {/* Back button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-zinc-800 transition-all text-xs font-semibold active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Games</span>
            </button>
          </div>

          {/* Game Title & Theme Badge */}
          <div className="text-center">
            {metadata.id === 'red-flag-green-flag' ? (
              <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wider">
                <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">Red Flag</span>
                <span className="text-zinc-500 mx-1">/</span>
                <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">Green Flag</span>
              </h2>
            ) : metadata.id === 'chaos-mix' ? (
              <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-pink-400 via-purple-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                {displayTitle}
              </h2>
            ) : (
              <h2
                className="text-lg sm:text-2xl font-black uppercase tracking-wider"
                style={{ color: metadata.themeColor, textShadow: `0 0 15px ${metadata.themeColor}55` }}
              >
                {displayTitle}
              </h2>
            )}
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
                <span className="hidden sm:inline">
                  {hasPlayers ? `${players.length} Players` : 'Add Players (Optional)'}
                </span>
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
        <div className="flex items-center justify-between gap-4 border-t border-b border-white/[0.06] py-1.5">
          <CategorySelector
            applicableCategories={metadata.applicableCategories}
            currentCategory={category}
            onSelectCategory={onCategoryChange}
          />

          {/* Active Player Turn Pill (Only if player names were entered) */}
          {hasPlayers && activePlayerName && (
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

      {/* Bottom Request Card Button */}
      <div className="w-full pt-4 flex items-center justify-center border-t border-white/[0.06]">
        <button
          onClick={() => setIsSuggestModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-zinc-900/40 text-xs font-medium text-zinc-400 hover:text-white hover:border-brand-pink/40 hover:bg-zinc-900/80 hover:shadow-neon-pink/20 transition-all active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5 text-brand-pink" />
          <span>+ Request a Card to be added</span>
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
