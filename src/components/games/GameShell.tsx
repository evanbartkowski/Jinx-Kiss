import React, { useState } from 'react';
import { GameMetadata, GameCategory } from '../../types/game';
import { CategorySelector } from '../common/CategorySelector';
import { PlayerSetupModal } from '../common/PlayerSetupModal';
import { SuggestCardModal } from '../common/SuggestCardModal';
import { useGameSettings } from '../../context/GameSettingsContext';
import { soundEffects } from '../../utils/audio';
import { ArrowLeft, RotateCcw, Users, PlusCircle, Coffee, Wine, Shuffle, X } from 'lucide-react';

interface GameShellProps {
  metadata: GameMetadata;
  category: GameCategory;
  onCategoryChange: (cat: GameCategory) => void;
  onExit: () => void;
  onRestart: () => void;
  onShuffle?: () => void;
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
  onShuffle,
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
  const [showFirstPromptPlayerBanner, setShowFirstPromptPlayerBanner] = useState(true);

  const displayTitle = category === 'kids' && metadata.kidsAlternativeTitle ? metadata.kidsAlternativeTitle : metadata.title;
  const displayTagline = category === 'kids' && metadata.kidsAlternativeTagline ? metadata.kidsAlternativeTagline : metadata.tagline;

  const hasPlayers = players && players.length > 0;

  return (
    <div 
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between py-4 px-4 sm:px-8 xl:px-12 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 10%, ${metadata.themeColor}22 0%, rgba(5,5,5,0) 60%), radial-gradient(circle at 80% 80%, ${metadata.themeColor}12 0%, rgba(5,5,5,0) 50%), #050505`,
      }}
    >
      {/* Dynamic Animated Ambient Neon Orbs */}
      <div 
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[38rem] h-[22rem] blur-[120px] rounded-full pointer-events-none transition-all duration-700 opacity-60 -z-10 animate-pulse-slow"
        style={{ backgroundColor: `${metadata.themeColor}25` }}
      />
      <div 
        className="absolute bottom-8 right-12 w-[24rem] h-[18rem] blur-[100px] rounded-full pointer-events-none -z-10 opacity-30"
        style={{ backgroundColor: `${metadata.themeColor}18` }}
      />
      <div 
        className="absolute top-1/3 left-8 w-[20rem] h-[16rem] blur-[90px] rounded-full pointer-events-none -z-10 opacity-25"
        style={{ backgroundColor: '#A855F715' }}
      />

      {/* Top Bar Controls */}
      <div className="w-full flex flex-col gap-2.5 pb-2 relative z-30">
        <div className="w-full p-2 rounded-2xl bg-zinc-950/70 border border-white/[0.07] backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Top Row on Mobile: Back button & Mobile Controls */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-zinc-800 transition-all text-xs font-semibold active:scale-95 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Games</span>
            </button>

            {/* Mobile Controls Right side */}
            <div className="sm:hidden flex items-center gap-1.5">
              {supportsNonalcoholic && (
                <button
                  onClick={() => setIsNonAlcoholic(!isNonAlcoholic)}
                  title={isNonAlcoholic ? 'Non-alcoholic mode active' : 'Normal beverage mode'}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                    isNonAlcoholic
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                      : 'border-white/10 bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  {isNonAlcoholic ? <Coffee className="w-3.5 h-3.5 text-emerald-400" /> : <Wine className="w-3.5 h-3.5" />}
                </button>
              )}

              {onUpdatePlayers && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setIsPlayerModalOpen(true);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold active:scale-95 cursor-pointer ${
                    hasPlayers
                      ? 'border border-white/10 bg-zinc-900/60 text-zinc-300'
                      : 'border border-brand-pink/70 bg-brand-pink/20 text-pink-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-brand-pink" />
                  <span>{hasPlayers ? `${players.length}` : '+ Players'}</span>
                </button>
              )}

              {onShuffle && (
                <button
                  onClick={() => {
                    soundEffects.playShuffle();
                    onShuffle();
                  }}
                  title="Reshuffle"
                  className="p-2 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-300 active:scale-95 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-brand-pink" />
                </button>
              )}

              <button
                onClick={() => {
                  soundEffects.playClick();
                  onRestart();
                }}
                title="Restart Deck"
                className="p-2 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-400 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Game Title & Theme Badge (Perfect Center) */}
          <div className="text-center w-full sm:w-auto">
            {metadata.id === 'red-flag-green-flag' ? (
              <h2 className="text-base sm:text-2xl font-black uppercase tracking-wider">
                <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">Red Flag</span>
                <span className="text-zinc-500 mx-1">/</span>
                <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">Green Flag</span>
              </h2>
            ) : metadata.id === 'chaos-mix' ? (
              <h2 className="text-base sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-pink-400 via-purple-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                {displayTitle}
              </h2>
            ) : (
              <h2
                className="text-base sm:text-2xl font-black uppercase tracking-wider"
                style={{ color: metadata.themeColor, textShadow: `0 0 15px ${metadata.themeColor}55` }}
              >
                {displayTitle}
              </h2>
            )}
            <p className="text-[11px] sm:text-xs text-zinc-400 font-medium hidden sm:block">
              {displayTagline}
            </p>
          </div>

          {/* Desktop Controls: Players & Restart */}
          <div className="hidden sm:flex items-center gap-1.5">
            {supportsNonalcoholic && (
              <button
                onClick={() => setIsNonAlcoholic(!isNonAlcoholic)}
                title={isNonAlcoholic ? 'Non-alcoholic mode active' : 'Normal beverage mode'}
                className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
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
                onClick={() => {
                  soundEffects.playClick();
                  setIsPlayerModalOpen(true);
                }}
                title={hasPlayers ? 'Manage Players' : 'Add Player Names'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold active:scale-95 cursor-pointer ${
                  hasPlayers
                    ? 'border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800'
                    : 'border border-brand-pink/70 bg-gradient-to-r from-brand-pink/30 via-purple-600/30 to-brand-pink/30 text-pink-200 shadow-[0_0_20px_rgba(255,77,166,0.45)] hover:shadow-neon-pink hover:border-brand-pink animate-pulse'
                }`}
              >
                <Users className={`w-4 h-4 ${hasPlayers ? 'text-brand-pink' : 'text-pink-300 animate-bounce'}`} />
                <span>
                  {hasPlayers ? `${players.length} Players` : '+ Add Players'}
                </span>
              </button>
            )}

            {onShuffle && (
              <button
                onClick={() => {
                  soundEffects.playShuffle();
                  onShuffle();
                }}
                title="Reshuffle All Cards"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-brand-pink/50 hover:shadow-neon-pink/20 transition-all text-xs font-bold active:scale-95 shadow-sm cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-brand-pink" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playClick();
                onRestart();
              }}
              title="Restart Deck"
              className="p-2 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="w-full flex items-center justify-between gap-2 border-t border-b border-white/[0.06] py-1.5 min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0">
            <CategorySelector
              applicableCategories={metadata.applicableCategories}
              currentCategory={category}
              onSelectCategory={onCategoryChange}
            />
          </div>

          {/* Active Player Turn Pill (Only if player names were entered) */}
          {hasPlayers && activePlayerName && (
            <div className="flex-shrink-0 px-3 py-1 rounded-full bg-brand-pink/15 border border-brand-pink/40 text-pink-300 text-xs font-bold shadow-neon-pink/20 animate-pulse-slow">
              Turn: {activePlayerName}
            </div>
          )}
        </div>

        {/* Noticeable "Add Players" Callout Banner on First Prompt */}
        {onUpdatePlayers && !hasPlayers && showFirstPromptPlayerBanner && (
          <div className="w-full max-w-2xl mx-auto mt-2 animate-fade-in">
            <div className="p-3 sm:p-4 rounded-2xl glass-panel border border-brand-pink/60 bg-gradient-to-r from-pink-950/70 via-zinc-900/90 to-purple-950/70 shadow-[0_0_25px_rgba(255,77,166,0.3)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-pink/20 border border-brand-pink/50 flex items-center justify-center text-brand-pink shadow-neon-pink/30 shrink-0">
                  <Users className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                      Playing with friends?
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-brand-pink/30 text-pink-300 border border-brand-pink/50">
                      GROUP PLAY
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-300 font-medium">
                    Add player names for turns, custom dares, and live counters!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setIsPlayerModalOpen(true);
                  }}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-neon-pink cursor-pointer active:scale-95 transition-all"
                >
                  Add Players
                </button>
                <button
                  onClick={() => setShowFirstPromptPlayerBanner(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Playing Arena */}
      <div className="flex-1 flex flex-col justify-center items-center py-4 sm:py-8 w-full relative z-10">
        {children}
      </div>

      {/* Bottom Request Card Button */}
      <div className="w-full pt-4 flex items-center justify-center border-t border-white/[0.06] relative z-10">
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
