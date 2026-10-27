import { useLegendaryDraw } from '../../hooks/useLegendaryDraw';
import { RemovedPrompt } from '../common/RemovedPrompt';
import { useLivePromptState } from '../../hooks/useLivePrompt';
import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { useGameSettings } from '../../context/GameSettingsContext';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { ArrowRight, Wine, Coffee, Sparkles, MessageCircleQuestion } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TruthOrSipGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const TruthOrSipGame: React.FC<TruthOrSipGameProps> = ({ prompts, players }) => {
  const { isNonAlcoholic, selectedCategory } = useGameSettings();
  const rollForLegendaryCard = useLegendaryDraw();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [choice, setChoice] = useState<'answer' | 'sip' | null>(null);
  const [activePrompt, setActivePrompt] = useLivePromptState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init-tos',
      gameId: 'truth-or-sip',
      category: 'medium',
      text: 'Truth or Sip...',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'truth-or-sip', 0.02, initial.playMode);
  });

  const isLegendary = isPromptLegendary(activePrompt);

  useEffect(() => {
    if (isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt?.id]);

  const activePlayer = players.length > 0 ? players[playerIndex % players.length] : null;

  const isKids = selectedCategory === 'kids';
  const penaltyLabel = isKids ? 'Do the Forfeit 🍪' : isNonAlcoholic ? 'Take a Sip of Soda/Tea ☕' : 'Take a Sip 🍹';

  const handleChoice = (selected: 'answer' | 'sip') => {
    setChoice(selected);
    soundEffects.playVoteSubmit();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: selected === 'answer' ? ['#F59E0B', '#D97706'] : ['#EC4899', '#A855F7'],
    });
  };

  const nextCard = () => {
    soundEffects.playCardFlip();
    setChoice(null);
    const nextIdx = (currentIndex + 1) % prompts.length;
    setCurrentIndex(nextIdx);
    const nextP = prompts[nextIdx] || prompts[0];
    const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'truth-or-sip', 0.02, nextP?.playMode);
    setActivePrompt(rolled);
    if (players.length > 0) {
      setPlayerIndex(prev => (prev + 1) % players.length);
    }
  };

  if (!activePrompt) return <RemovedPrompt onNext={nextCard} />;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      
      {/* Turn indicator */}
      {activePlayer && (
        <div className="text-center animate-fade-in">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-zinc-400 font-semibold">Active Confessor</span>
          <h3 className="text-xl sm:text-4xl md:text-5xl font-black text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            {activePlayer}
          </h3>
        </div>
      )}

      {/* Main Golden Amber Card (Screen-Filling & Legendary-Aware) */}
      <div className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-5 sm:p-12 md:p-16 lg:p-20 rounded-2xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in transition-all duration-500 ${
        isLegendary
          ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
          : 'border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.3)]'
      }`}>
        
        {/* Glow ambient background */}
        <div
          className={`absolute inset-0 pointer-events-none blur-3xl ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'bg-gradient-to-b from-amber-600 to-transparent opacity-20'
          }`}
        />

        <div className="flex items-center gap-2 z-10">
          {isLegendary ? (
            <LegendaryCardBadge title={activePrompt.legendaryTitle || (isKids ? '★ LEGENDARY FORFEIT ★' : '★ LEGENDARY TRUTH ★')} size="lg" />
          ) : (
            <span className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-amber-950/60 border border-amber-500/50 text-amber-300 shadow-neon-amber/20">
              {isKids ? 'Truth or Snack' : 'Truth or Sip'}
            </span>
          )}
          <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">
            Card #{currentIndex + 1}
          </span>
        </div>

        <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-snug my-5 sm:my-10 max-w-4xl z-10 ${
          isLegendary
            ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
            : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
        }`}>
          "{activePrompt?.text}"
        </p>

        {/* Choice indicator */}
        {choice && (
          <div className="animate-fade-in text-xs sm:text-base font-black z-10">
            {choice === 'answer' ? (
              <span className="text-amber-300 bg-amber-950/80 border border-amber-500/50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-neon-amber">
                🗣️ Chose to Confess the Truth!
              </span>
            ) : (
              <span className="text-pink-300 bg-pink-950/80 border border-pink-500/50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-neon-pink">
                🍹 Took the Penalty & Kept the Secret!
              </span>
            )}
          </div>
        )}

        {currentIndex === 0 && (
          <div className="text-xs sm:text-base text-zinc-300 font-semibold my-2 z-10 animate-fade-in">
            Answer 100% truthfully or take the sip penalty.
          </div>
        )}

        {/* Card Rating & Report Bar */}
        <div className="w-full max-w-md z-10">
          <CardRatingBar prompt={activePrompt} />
        </div>

      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 w-full mt-1 sm:mt-2">
        <button
          onClick={() => handleChoice('answer')}
          disabled={!!choice}
          className={`flex-1 min-w-[130px] sm:min-w-[220px] max-w-[260px] py-3.5 sm:py-5 rounded-xl sm:rounded-3xl border font-black text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-2.5 transition-all active:scale-95 cursor-pointer ${
            choice === 'answer'
              ? 'bg-amber-600 border-amber-400 text-white shadow-neon-amber scale-105'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500 hover:shadow-neon-amber'
          }`}
        >
          <MessageCircleQuestion className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>I'll Answer</span>
        </button>

        <button
          onClick={() => handleChoice('sip')}
          disabled={!!choice}
          className={`flex-1 min-w-[130px] sm:min-w-[220px] max-w-[280px] py-3.5 sm:py-5 rounded-xl sm:rounded-3xl border font-black text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-2.5 transition-all active:scale-95 cursor-pointer ${
            choice === 'sip'
              ? 'bg-pink-600 border-pink-400 text-white shadow-neon-pink scale-105'
              : 'bg-pink-950/40 border-pink-500/40 text-pink-300 hover:bg-pink-900/60 hover:border-pink-500 hover:shadow-neon-pink'
          }`}
        >
          {isNonAlcoholic ? <Coffee className="w-5 h-5 sm:w-6 sm:h-6" /> : <Wine className="w-5 h-5 sm:w-6 sm:h-6" />}
          <span>{penaltyLabel}</span>
        </button>

        {choice && (
          <button
            onClick={nextCard}
            className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-5 rounded-xl sm:rounded-3xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-black text-sm sm:text-lg shadow-neon-amber flex items-center justify-center gap-2.5 sm:gap-3 transition-all active:scale-95 animate-scale-in cursor-pointer"
          >
            <span>Next Round</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
};

