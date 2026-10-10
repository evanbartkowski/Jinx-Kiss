import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { ArrowRight, RotateCcw, Heart, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NeverHaveIEverGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const NeverHaveIEverGame: React.FC<NeverHaveIEverGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [lastChoice, setLastChoice] = useState<'have' | 'havent' | null>(null);
  const [playerLives, setPlayerLives] = useState<Record<string, number>>({});
  const [activePrompt, setActivePrompt] = useState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init-nhie',
      gameId: 'never-have-i-ever',
      category: 'medium',
      text: 'Never have I ever...',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'never-have-i-ever');
  });

  const isLegendary = isPromptLegendary(activePrompt);

  // Initialize 5 lives for each player
  useEffect(() => {
    const lives: Record<string, number> = {};
    players.forEach(p => lives[p] = 5);
    setPlayerLives(lives);
  }, [players]);

  useEffect(() => {
    if (isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt.id]);

  const nextCard = () => {
    soundEffects.playCardFlip();
    setLastChoice(null);
    let nextIdx = Math.floor(Math.random() * prompts.length);
    if (usedIndices.length < prompts.length) {
      while (usedIndices.includes(nextIdx) && usedIndices.length < prompts.length) {
        nextIdx = (nextIdx + 1) % prompts.length;
      }
      setUsedIndices(prev => [...prev, nextIdx]);
    }
    setCurrentIndex(nextIdx);
    const nextP = prompts[nextIdx] || prompts[0];
    const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'never-have-i-ever');
    setActivePrompt(rolled);
  };

  const handleChoice = (choice: 'have' | 'havent') => {
    setLastChoice(choice);
    if (choice === 'have') {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#A855F7', '#FF4DA6'],
      });
    }
  };

  const deductLife = (playerName: string) => {
    setPlayerLives(prev => ({
      ...prev,
      [playerName]: Math.max(0, (prev[playerName] || 5) - 1),
    }));
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      
      {/* Group Scoring Bar if players exist */}
      {players.length > 0 && (
        <div className="w-full flex items-center justify-center gap-3 flex-wrap py-2.5 px-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08]">
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Lives:</span>
          {players.map((p) => {
            const lives = playerLives[p] ?? 5;
            return (
              <div
                key={p}
                onClick={() => deductLife(p)}
                title="Tap to lose a life if you have done it!"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all select-none"
              >
                <span className="text-xs font-semibold text-zinc-300">{p}:</span>
                <div className="flex text-pink-400">
                  {Array.from({ length: lives }).map((_, i) => (
                    <Heart key={i} className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  ))}
                  {Array.from({ length: Math.max(0, 5 - lives) }).map((_, i) => (
                    <Heart key={i} className="w-3.5 h-3.5 text-zinc-600" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Statement Card (Significantly Bigger, Screen-Filling & Legendary) */}
      <div className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-6 sm:p-14 md:p-18 rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in transition-all duration-500 ${
        isLegendary
          ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
          : 'border-brand-violet/50 shadow-[0_0_40px_rgba(168,85,247,0.3)]'
      }`}>
        
        {/* Glow ambient background */}
        <div
          className={`absolute inset-0 pointer-events-none blur-3xl ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'bg-gradient-to-b from-purple-600 to-transparent opacity-20'
          }`}
        />

        <div className="flex items-center gap-2 z-10">
          {isLegendary ? (
            <LegendaryCardBadge title={activePrompt.legendaryTitle || '★ LEGENDARY CONFESSION ★'} size="lg" />
          ) : (
            <span className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-brand-violet/20 border border-brand-violet text-violet-300 shadow-neon-violet/30">
              Never Have I Ever
            </span>
          )}
          <span className="text-xs text-zinc-400 font-semibold">
            Card #{currentIndex + 1} of {prompts.length}
          </span>
        </div>

        <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-snug sm:leading-tight my-6 sm:my-10 max-w-4xl z-10 ${
          isLegendary
            ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
            : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]'
        }`}>
          "{activePrompt?.text}"
        </p>

        {/* Choice Reveal Indicator */}
        {lastChoice && (
          <div className="animate-fade-in flex items-center gap-2 text-sm sm:text-base font-black z-10">
            {lastChoice === 'have' ? (
              <span className="text-pink-300 bg-pink-950/80 border border-pink-500/50 px-5 py-2 rounded-full shadow-neon-pink">
                💥 You Confessed: I Have!
              </span>
            ) : (
              <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-5 py-2 rounded-full shadow-neon-green">
                🛡️ Pure & Innocent: I Haven't!
              </span>
            )}
          </div>
        )}

        <div className="text-sm sm:text-base text-zinc-300 font-semibold my-2 z-10">
          Drink, drop a finger, or confess with your crew!
        </div>

        {/* Rating & Reporting */}
        <div className="w-full max-w-md z-10">
          <CardRatingBar prompt={activePrompt} />
        </div>

      </div>

      {/* Choice Buttons (Massive & Tactile) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 w-full mt-2">
        <button
          onClick={() => handleChoice('have')}
          className={`flex-1 min-w-[130px] sm:min-w-[220px] max-w-[260px] py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl border font-black text-sm sm:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
            lastChoice === 'have'
              ? 'bg-pink-600 border-pink-400 text-white shadow-neon-pink'
              : 'bg-pink-950/40 border-pink-500/40 text-pink-300 hover:bg-pink-900/60 hover:border-pink-500 hover:shadow-neon-pink'
          }`}
        >
          <Check className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>I Have</span>
        </button>

        <button
          onClick={() => handleChoice('havent')}
          className={`flex-1 min-w-[130px] sm:min-w-[220px] max-w-[260px] py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl border font-black text-sm sm:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
            lastChoice === 'havent'
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-neon-green'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500 hover:shadow-neon-green'
          }`}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>I Haven't</span>
        </button>

        <button
          onClick={nextCard}
          className="w-full sm:w-auto px-6 sm:px-12 py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-violet to-purple-600 hover:from-purple-500 hover:to-violet-500 text-white font-black text-sm sm:text-lg shadow-neon-violet flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
        >
          <span>Next Card</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

    </div>
  );
};

