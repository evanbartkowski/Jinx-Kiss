import React, { useState } from 'react';
import { GameMetadata, GameCategory } from '../../types/game';
import { CATEGORY_LABELS } from '../../data/gamesConfig';
import { sessionService, GameSession } from '../../services/sessionService';
import { ArrowLeft, Sparkles, ArrowRight, TrendingUp, History, Play } from 'lucide-react';

interface GameModeSelectScreenProps {
  metadata: GameMetadata;
  onSelectCategory: (category: GameCategory, progressive?: boolean) => void;
  onBack: () => void;
}

export const GameModeSelectScreen: React.FC<GameModeSelectScreenProps> = ({
  metadata,
  onSelectCategory,
  onBack,
}) => {
  const [isProgressive, setIsProgressive] = useState(false);
  const [activeSession, setActiveSession] = useState<GameSession | null>(() => {
    const current = sessionService.getActiveSession();
    if (current && current.gameId === metadata.id) {
      return current;
    }
    return null;
  });
  // 8 Total Difficulty Modes
  const categories: GameCategory[] = [
    'easy',
    'medium',
    'extreme',
    'unhinged',
    'couples',
    '18+',
    'spicy',
    'kids',
  ];

  const getCategoryDetails = (cat: GameCategory) => {
    switch (cat) {
      case 'easy':
        return {
          color: '#10B981',
          icon: '🟢',
          badge: 'Casual & Fun',
          desc: 'Lighthearted, hilarious prompts perfect for warming up any group.',
        };
      case 'medium':
        return {
          color: '#3B82F6',
          icon: '🔵',
          badge: 'Personal & Bold',
          desc: 'Spicier, more revealing, and slightly embarrassing group questions.',
        };
      case 'extreme':
        return {
          color: '#EF4444',
          icon: '🔴',
          badge: 'No Limits',
          desc: 'Intense physical dares, wild questions, and high-adrenaline tests.',
        };
      case 'unhinged':
        return {
          color: '#D946EF',
          icon: '⚡',
          badge: 'Pure Chaos',
          desc: 'Wild, unpredictable, absurd, and chaotic prompts that test every boundary.',
        };
      case 'couples':
        return {
          color: '#EC4899',
          icon: '💖',
          badge: 'Romance & Chemistry',
          desc: 'Deep connection, romantic tension, and relationship confessions.',
        };
      case '18+':
        return {
          color: '#A855F7',
          icon: '💜',
          badge: 'Adults Only',
          desc: 'Unfiltered nighttime secrets, bedroom confessions, and uncensored wild topics.',
        };
      case 'spicy':
        return {
          color: '#F43F5E',
          icon: '🌹',
          badge: 'Flirty & Daring',
          desc: 'Provocative charm, magnetic eye contact, and risqué challenges.',
        };
      case 'kids':
        return {
          color: '#F59E0B',
          icon: '🟡',
          badge: 'Family Safe',
          desc: '100% wholesome, silly, creative, and safe for all ages.',
        };
      default:
        return {
          color: metadata.themeColor,
          icon: '✨',
          badge: 'Standard',
          desc: 'Great for any party.',
        };
    }
  };

  const renderGameTitle = () => {
    if (metadata.id === 'red-flag-green-flag') {
      return (
        <span className="text-lg sm:text-2xl font-black uppercase tracking-wide">
          <span className="text-red-500">Red Flag</span> <span className="text-zinc-500">/</span> <span className="text-emerald-400">Green Flag</span>
        </span>
      );
    }
    if (metadata.id === 'chaos-mix') {
      return (
        <span className="text-lg sm:text-2xl font-black uppercase tracking-wide bg-gradient-to-r from-pink-400 via-purple-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
          {metadata.title}
        </span>
      );
    }
    return (
      <span
        className="text-lg sm:text-2xl font-black uppercase tracking-wide"
        style={{ color: metadata.themeColor }}
      >
        {metadata.title}
      </span>
    );
  };

  return (
    <div className="w-full min-h-[calc(100dvh-5rem)] flex flex-col justify-between px-4 sm:px-8 xl:px-12 2xl:px-16 py-6 animate-fade-in select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-zinc-800 transition-all text-xs sm:text-sm font-bold active:scale-95 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Games</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold block">
            Selected Game:
          </span>
          {renderGameTitle()}
        </div>
      </div>

      {/* Main Title Banner without description underneath */}
      <div className="text-center w-full mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border mb-3 shadow-lg"
          style={{
            borderColor: `${metadata.themeColor}50`,
            backgroundColor: `${metadata.themeColor}15`,
            color: metadata.themeColor,
            boxShadow: `0 0 25px ${metadata.themeColor}30`,
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Step 1: Choose Difficulty & Intensity</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
          Select Game <span className="text-brand-gradient">Mode</span>
        </h2>

        {/* Optional Progressive Difficulty Switch */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => setIsProgressive(!isProgressive)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              isProgressive
                ? 'bg-gradient-to-r from-rose-950/70 to-pink-950/70 border-rose-500 text-rose-300 shadow-neon-pink/30 scale-105'
                : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span>Progressive Difficulty: {isProgressive ? 'ENABLED (Ramps every 5 rounds)' : 'OFF (Fixed tier)'}</span>
          </button>
        </div>

        {/* Saved Session Resume Alert (Shown only inside this specific game when session exists) */}
        {activeSession && (
          <div className="w-full max-w-2xl mx-auto mt-4 p-4 rounded-2xl glass-panel border border-brand-violet/50 bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-black/80 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in shadow-neon-violet/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-violet text-white">
                    Saved Session
                  </span>
                  <span className="text-xs text-purple-300 font-bold">
                    Mode: {CATEGORY_LABELS[activeSession.category]?.label || activeSession.category} • Round {activeSession.currentRound}
                  </span>
                </div>
                <span className="text-xs text-zinc-300 font-medium">
                  {activeSession.players && activeSession.players.length > 0 ? `Players: ${activeSession.players.join(', ')}` : 'Game in progress'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectCategory(activeSession.category, isProgressive)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-pink text-white text-xs font-bold flex items-center gap-1.5 shadow-neon-violet hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Resume Round {activeSession.currentRound}</span>
              </button>
              <button
                onClick={() => {
                  sessionService.clearActiveSession();
                  setActiveSession(null);
                }}
                className="px-3 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs font-semibold hover:bg-zinc-800 transition-all active:scale-95"
                title="Start fresh"
              >
                Start Fresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Grid of 8 Category Cards filling full screen naturally (2 columns on mobile) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 xl:gap-8 my-auto">
        {categories.map((cat) => {
          const info = getCategoryDetails(cat);
          const meta = CATEGORY_LABELS[cat] || { label: cat };
          const isSavedSessionCategory = activeSession && activeSession.category === cat;

          return (
            <div
              key={cat}
              onClick={() => onSelectCategory(cat, isProgressive)}
              className={`group relative rounded-2xl sm:rounded-3xl glass-panel p-3.5 sm:p-7 min-h-[170px] sm:min-h-[250px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] ${
                isSavedSessionCategory ? 'border-brand-violet shadow-neon-violet/40 ring-1 ring-brand-violet/50' : 'border border-white/[0.08] hover:border-white/30'
              }`}
              style={{
                boxShadow: `0 12px 35px -15px ${info.color}35`,
              }}
            >
              {/* Subtle Ambient Glow behind card */}
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500 pointer-events-none -z-10"
                style={{ backgroundColor: info.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">{info.icon}</span>
                  {isSavedSessionCategory ? (
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-brand-violet text-white shadow-neon-violet animate-pulse">
                      Round {activeSession.currentRound}
                    </span>
                  ) : (
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border shadow-sm truncate max-w-[100px] sm:max-w-none"
                      style={{
                        color: info.color,
                        backgroundColor: `${info.color}15`,
                        borderColor: `${info.color}40`,
                      }}
                    >
                      {info.badge}
                    </span>
                  )}
                </div>

                <h3
                  className="text-sm sm:text-2xl font-black uppercase tracking-wide mb-1 sm:mb-2 transition-colors truncate"
                  style={{ color: info.color }}
                >
                  {meta.label}
                </h3>

                <p className="text-[10px] sm:text-sm text-zinc-400 font-medium leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {info.desc}
                </p>
              </div>

              {/* Bottom Play Action */}
              <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] sm:text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                <span className="truncate">{isSavedSessionCategory ? 'Resume' : 'Play'}</span>
                <div
                  className="w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                  style={{
                    backgroundColor: `${info.color}25`,
                    color: info.color,
                  }}
                >
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Bottom Note */}
      <div className="text-center pt-8 text-[11px] text-zinc-500 font-medium uppercase tracking-widest">
        100+ Unique Prompts Per Mode • Zero Repeats Guaranteed
      </div>
    </div>
  );
};
