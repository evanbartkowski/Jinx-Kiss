import React, { useState } from 'react';
import { GameMetadata, GameCategory } from '../../types/game';
import { CATEGORY_LABELS } from '../../data/gamesConfig';
import { sessionService, GameSession } from '../../services/sessionService';
import { useGameSettings } from '../../context/GameSettingsContext';
import { AgeConfirmationModal } from '../common/AgeConfirmationModal';
import { soundEffects } from '../../utils/audio';
import { ArrowLeft, Sparkles, ArrowRight, TrendingUp, History, Play, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const { isAgeConfirmed, confirmAge } = useGameSettings();
  const [pendingCategory, setPendingCategory] = useState<GameCategory | null>(null);

  const [activeSession, setActiveSession] = useState<GameSession | null>(() => {
    const current = sessionService.getActiveSession();
    if (current && current.gameId === metadata.id) {
      return current;
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState<GameCategory>(() => {
    if (activeSession) return activeSession.category;
    return 'medium';
  });
  const [isProgressive, setIsProgressive] = useState(false);

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

  const handleCategoryClick = (cat: GameCategory) => {
    soundEffects.playCardFlip();
    if (cat === '18+' && !isAgeConfirmed) {
      setPendingCategory('18+');
      return;
    }
    setSelectedCategory(cat);
  };

  const handleAgeConfirm = () => {
    confirmAge();
    if (pendingCategory) {
      setSelectedCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  const handleStartGame = () => {
    if (selectedCategory === '18+' && !isAgeConfirmed) {
      setPendingCategory('18+');
      return;
    }
    soundEffects.playGameStart();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF4DA6', '#A855F7', '#06B6D4', '#10B981'],
    });
    onSelectCategory(selectedCategory, isProgressive);
  };

  const handleResumeSession = () => {
    if (!activeSession) return;
    soundEffects.playGameStart();
    onSelectCategory(activeSession.category, isProgressive);
  };

  const renderGameTitle = () => {
    if (metadata.id === 'red-flag-green-flag') {
      return (
        <span className="text-base sm:text-2xl font-black uppercase tracking-wide">
          <span className="text-red-500">Red Flag</span> <span className="text-zinc-500">/</span> <span className="text-emerald-400">Green Flag</span>
        </span>
      );
    }
    if (metadata.id === 'chaos-mix') {
      return (
        <span className="text-base sm:text-2xl font-black uppercase tracking-wide bg-gradient-to-r from-pink-400 via-purple-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
          {metadata.title}
        </span>
      );
    }
    return (
      <span
        className="text-base sm:text-2xl font-black uppercase tracking-wide"
        style={{ color: metadata.themeColor }}
      >
        {metadata.title}
      </span>
    );
  };

  const selectedDetails = getCategoryDetails(selectedCategory);

  return (
    <div className="w-full min-h-[calc(100dvh-5rem)] flex flex-col justify-between px-3 sm:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 animate-fade-in select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/[0.06]">
        <button
          onClick={() => {
            soundEffects.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-3 rounded-2xl border border-white/10 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-zinc-800 transition-all text-xs sm:text-sm font-bold active:scale-95 shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>All Games</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-400 font-semibold block">
            Selected Game:
          </span>
          {renderGameTitle()}
        </div>
      </div>

      {/* Main Title & Controls Banner */}
      <div className="text-center w-full mb-4 sm:mb-8">
        <div
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border mb-2 sm:mb-3 shadow-lg"
          style={{
            borderColor: `${metadata.themeColor}50`,
            backgroundColor: `${metadata.themeColor}15`,
            color: metadata.themeColor,
            boxShadow: `0 0 25px ${metadata.themeColor}30`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: Choose Intensity</span>
        </div>

        {/* Bigger, Punchier "Select Game Mode" Title */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] leading-tight">
          Select Game <span className="text-brand-gradient">Mode</span>
        </h2>

        {/* Clean, Balanced Control Toolbar for Progressive Difficulty & Saved Session */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-3 sm:mt-5 max-w-3xl mx-auto px-1">
          {/* Progressive Difficulty Switch */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setIsProgressive(!isProgressive);
            }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              isProgressive
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-neon-pink/40 scale-105'
                : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            <span>Progressive Difficulty:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${
                isProgressive ? 'bg-rose-500 text-white' : 'bg-white/10 text-zinc-400'
              }`}
            >
              {isProgressive ? 'ON (Ramps every 5 rounds)' : 'OFF (Fixed Tier)'}
            </span>
          </button>

          {/* Saved Session Inline Pill */}
          {activeSession && (
            <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-gradient-to-r from-purple-950/60 to-black/80 border border-brand-violet/50 shadow-neon-violet/20 animate-fade-in text-xs">
              <div className="flex items-center gap-1.5 pl-2 text-purple-300 font-bold">
                <History className="w-3.5 h-3.5 text-brand-violet shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-none">
                  Saved: {CATEGORY_LABELS[activeSession.category]?.label || activeSession.category} (R{activeSession.currentRound})
                </span>
              </div>
              <button
                onClick={handleResumeSession}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-brand-violet to-brand-pink text-white font-bold text-[11px] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Resume</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  sessionService.clearActiveSession();
                  setActiveSession(null);
                }}
                className="px-2 py-1 rounded-xl text-zinc-400 hover:text-white text-[10px] hover:bg-zinc-800 transition-all cursor-pointer"
                title="Discard saved session"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Grid of 8 Category Cards (2 columns on mobile, 4 columns on desktop) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 xl:gap-8 my-auto">
        {categories.map((cat) => {
          const info = getCategoryDetails(cat);
          const meta = CATEGORY_LABELS[cat] || { label: cat };
          const isSelected = selectedCategory === cat;
          const isSavedSessionCategory = activeSession && activeSession.category === cat;

          return (
            <div
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`group relative rounded-2xl sm:rounded-3xl glass-panel p-3 sm:p-6 lg:p-7 min-h-[145px] sm:min-h-[220px] lg:min-h-[250px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.98] ${
                isSelected
                  ? 'ring-2 ring-white/90 scale-[1.02] sm:scale-105 shadow-2xl bg-white/[0.08]'
                  : isSavedSessionCategory
                  ? 'border-brand-violet/70 shadow-neon-violet/30 ring-1 ring-brand-violet/40'
                  : 'border border-white/[0.08] hover:border-white/30'
              }`}
              style={{
                borderColor: isSelected ? info.color : undefined,
                boxShadow: isSelected
                  ? `0 15px 40px -10px ${info.color}60, 0 0 25px ${info.color}40`
                  : `0 10px 30px -15px ${info.color}30`,
              }}
            >
              {/* Subtle Ambient Glow behind card */}
              <div
                className={`absolute inset-0 rounded-2xl sm:rounded-3xl blur-xl transition-opacity duration-500 pointer-events-none -z-10 ${
                  isSelected ? 'opacity-30' : 'opacity-0 group-hover:opacity-15'
                }`}
                style={{ backgroundColor: info.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-4">
                  <span className="text-xl sm:text-3xl">{info.icon}</span>
                  {isSelected ? (
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-white flex items-center gap-1 shadow-md"
                      style={{ backgroundColor: info.color }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Selected</span>
                    </span>
                  ) : isSavedSessionCategory ? (
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-brand-violet text-white shadow-neon-violet">
                      R{activeSession.currentRound} Saved
                    </span>
                  ) : (
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full border shadow-sm truncate max-w-[95px] sm:max-w-none"
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
                  className="text-xs sm:text-xl lg:text-2xl font-black uppercase tracking-wide mb-1 sm:mb-2 transition-colors truncate"
                  style={{ color: info.color }}
                >
                  {meta.label}
                </h3>

                <p className="text-[10px] sm:text-xs lg:text-sm text-zinc-400 font-medium leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {info.desc}
                </p>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] sm:text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                <span className="truncate">{isSelected ? 'Active Mode' : 'Select'}</span>
                <div
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                  style={{
                    backgroundColor: `${info.color}25`,
                    color: info.color,
                  }}
                >
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Start Game Action Bar */}
      <div className="w-full flex flex-col items-center gap-2 pt-5 sm:pt-8 pb-2">
        <button
          onClick={handleStartGame}
          className="group relative px-10 sm:px-16 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-base sm:text-xl shadow-[0_0_35px_rgba(255,77,166,0.6)] hover:shadow-[0_0_55px_rgba(168,85,247,0.85)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          <span>START GAME</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1.5 transition-transform" />
        </button>

        <span className="text-[11px] sm:text-xs text-zinc-400 font-semibold tracking-wide text-center">
          Starting with <span className="font-bold text-white uppercase">{CATEGORY_LABELS[selectedCategory]?.label || selectedCategory}</span> Mode
          {isProgressive && <span className="text-rose-400 ml-1.5 font-bold">• Progressive Ramping Active</span>}
        </span>
      </div>

      <AgeConfirmationModal
        isOpen={!!pendingCategory}
        onConfirm={handleAgeConfirm}
        onCancel={() => setPendingCategory(null)}
      />
    </div>
  );
};
