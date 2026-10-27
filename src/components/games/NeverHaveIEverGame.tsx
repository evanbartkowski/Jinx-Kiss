import { RemovedPrompt } from '../common/RemovedPrompt';
import { useLivePromptState } from '../../hooks/useLivePrompt';
import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { Heart, CheckCircle2 } from 'lucide-react';

interface NeverHaveIEverGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const NeverHaveIEverGame: React.FC<NeverHaveIEverGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [playerLives, setPlayerLives] = useState<Record<string, number>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [activePrompt, setActivePrompt] = useLivePromptState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init-nhie',
      gameId: 'never-have-i-ever',
      category: 'medium',
      text: 'Never have I ever...',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'never-have-i-ever', 0.02, initial.playMode);
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
  }, [activePrompt?.id]);

  const handleComplete = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    soundEffects.playVoteSubmit();

    // Pulse card glow, then flip to next card
    setTimeout(() => {
      soundEffects.playCardFlip();
      let nextIdx = Math.floor(Math.random() * prompts.length);
      if (usedIndices.length < prompts.length) {
        while (usedIndices.includes(nextIdx) && usedIndices.length < prompts.length) {
          nextIdx = (nextIdx + 1) % prompts.length;
        }
        setUsedIndices(prev => [...prev, nextIdx]);
      } else {
        setUsedIndices([nextIdx]);
      }
      setCurrentIndex(nextIdx);
      const nextP = prompts[nextIdx] || prompts[0];
      const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'never-have-i-ever', 0.02, nextP?.playMode);
      setActivePrompt(rolled);
      setIsCompleting(false);
    }, 550);
  };

  const deductLife = (playerName: string) => {
    setPlayerLives(prev => ({
      ...prev,
      [playerName]: Math.max(0, (prev[playerName] || 5) - 1),
    }));
  };

  if (!activePrompt) return <RemovedPrompt onNext={handleComplete} />;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      
      {/* Group Scoring Bar if players exist */}
      {players.length > 0 && (
        <div className="w-full flex flex-col items-center gap-1.5 animate-fade-in">
          <div className="w-full flex items-center justify-center gap-3 sm:gap-4 flex-wrap py-3 px-5 sm:px-8 rounded-2xl bg-zinc-900/80 border border-white/[0.08] shadow-md">
            <span className="text-xs sm:text-sm uppercase tracking-wider text-purple-300 font-black">Lives:</span>
            {players.map((p) => {
              const lives = playerLives[p] ?? 5;
              return (
                <div
                  key={p}
                  onClick={() => deductLife(p)}
                  title="Tap to remove a life!"
                  className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-black/50 border border-white/10 hover:border-pink-500/60 hover:shadow-neon-pink/20 cursor-pointer transition-all select-none active:scale-95"
                >
                  <span className="text-xs sm:text-sm font-bold text-zinc-200">{p}:</span>
                  <div className="flex gap-1 text-pink-400">
                    {Array.from({ length: lives }).map((_, i) => (
                      <Heart key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-pink-500 text-pink-500 filter drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
                    ))}
                    {Array.from({ length: Math.max(0, 5 - lives) }).map((_, i) => (
                      <Heart key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600/70" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indicator that you can click to remove lives - ONLY on first card */}
          {usedIndices.length === 0 && (
            <span className="text-[11px] sm:text-xs text-purple-300/80 font-medium tracking-wide animate-fade-in">
              💡 Tap any player's badge to remove a life when they have done it
            </span>
          )}
        </div>
      )}

      {/* Main Statement Card (Significantly Bigger, Screen-Filling & Legendary) */}
      <div className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-6 sm:p-14 md:p-18 rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in transition-all duration-500 ${
        isCompleting
          ? 'border-2 border-emerald-400 shadow-[0_0_70px_rgba(52,211,153,0.85),inset_0_0_35px_rgba(52,211,153,0.3)] ring-4 ring-emerald-400/90 bg-gradient-to-b from-emerald-950/70 via-black/75 to-black/95 scale-[1.01]'
          : isLegendary
          ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
          : 'border-brand-violet/50 shadow-[0_0_40px_rgba(168,85,247,0.3)]'
      }`}>
        
        {/* Glow ambient background */}
        <div
          className={`absolute inset-0 pointer-events-none blur-3xl transition-opacity duration-300 ${
            isCompleting
              ? 'bg-gradient-to-b from-emerald-400/40 via-teal-500/25 to-transparent opacity-70'
              : isLegendary
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
          isCompleting
            ? 'text-emerald-100 drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]'
            : isLegendary
            ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
            : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]'
        }`}>
          "{activePrompt?.text}"
        </p>

        {/* Helper description - ONLY on first card */}
        {usedIndices.length === 0 && (
          <div className="text-sm sm:text-base text-zinc-300 font-semibold my-2 z-10 animate-fade-in">
            {activePrompt?.playMode === 'online'
              ? 'Drink on cam, drop a finger, or confess in call!'
              : 'Drink, drop a finger, or confess with your crew!'}
          </div>
        )}

        {/* Rating & Reporting */}
        <div className="w-full max-w-md z-10">
          <CardRatingBar prompt={activePrompt} />
        </div>

      </div>

      {/* Action Button: Complete Button */}
      <div className="flex items-center justify-center w-full mt-2">
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`w-full sm:w-auto min-w-[200px] sm:min-w-[280px] px-8 sm:px-14 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-base sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer shadow-lg ${
            isCompleting
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-[0_0_35px_rgba(52,211,153,0.7)] scale-105'
              : 'bg-gradient-to-r from-brand-violet to-purple-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-neon-violet'
          }`}
        >
          {isCompleting ? (
            <>
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce" />
              <span>Completed!</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-violet-200" />
              <span>Complete</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

