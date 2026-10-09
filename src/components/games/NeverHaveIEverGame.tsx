import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
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

  // Initialize 5 lives for each player
  useEffect(() => {
    const lives: Record<string, number> = {};
    players.forEach(p => lives[p] = 5);
    setPlayerLives(lives);
  }, [players]);

  const currentPrompt = prompts[currentIndex] || prompts[0];

  const nextCard = () => {
    setLastChoice(null);
    let nextIdx = Math.floor(Math.random() * prompts.length);
    if (usedIndices.length < prompts.length) {
      while (usedIndices.includes(nextIdx) && usedIndices.length < prompts.length) {
        nextIdx = (nextIdx + 1) % prompts.length;
      }
      setUsedIndices(prev => [...prev, nextIdx]);
    }
    setCurrentIndex(nextIdx);
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
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      
      {/* Group Scoring Bar if players exist */}
      {players.length > 0 && (
        <div className="w-full flex items-center justify-center gap-3 flex-wrap py-2 px-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08]">
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Lives:</span>
          {players.map((p) => {
            const lives = playerLives[p] ?? 5;
            return (
              <div
                key={p}
                onClick={() => deductLife(p)}
                title="Tap to lose a life if you have done it!"
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all select-none"
              >
                <span className="text-xs font-semibold text-zinc-300">{p}:</span>
                <div className="flex text-pink-400">
                  {Array.from({ length: lives }).map((_, i) => (
                    <Heart key={i} className="w-3 h-3 fill-pink-500 text-pink-500" />
                  ))}
                  {Array.from({ length: Math.max(0, 5 - lives) }).map((_, i) => (
                    <Heart key={i} className="w-3 h-3 text-zinc-600" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Statement Card */}
      <div className="w-full min-h-[300px] p-8 sm:p-12 rounded-3xl glass-panel border border-brand-violet/40 shadow-neon-violet/30 flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in">
        
        <div className="flex items-center gap-2">
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-brand-violet/20 border border-brand-violet text-violet-300 shadow-neon-violet/20">
            Never Have I Ever
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            Card #{currentIndex + 1} of {prompts.length}
          </span>
        </div>

        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed my-8 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {/* Choice Reveal Indicator */}
        {lastChoice && (
          <div className="animate-fade-in flex items-center gap-2 text-sm font-bold">
            {lastChoice === 'have' ? (
              <span className="text-pink-400 bg-pink-950/60 border border-pink-500/40 px-4 py-1.5 rounded-full shadow-neon-pink">
                💥 You Confessed: I Have!
              </span>
            ) : (
              <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-4 py-1.5 rounded-full shadow-neon-green">
                🛡️ Pure & Innocent: I Haven't!
              </span>
            )}
          </div>
        )}

        <div className="text-xs text-zinc-400 font-medium mt-2">
          Drink, drop a finger, or confess with your crew!
        </div>

      </div>

      {/* Choice Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <button
          onClick={() => handleChoice('have')}
          className={`flex-1 min-w-[140px] max-w-[200px] py-4 rounded-2xl border font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            lastChoice === 'have'
              ? 'bg-pink-600 border-pink-400 text-white shadow-neon-pink'
              : 'bg-pink-950/40 border-pink-500/40 text-pink-300 hover:bg-pink-900/60 hover:border-pink-500 hover:shadow-neon-pink'
          }`}
        >
          <Check className="w-5 h-5" />
          <span>I Have</span>
        </button>

        <button
          onClick={() => handleChoice('havent')}
          className={`flex-1 min-w-[140px] max-w-[200px] py-4 rounded-2xl border font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            lastChoice === 'havent'
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-neon-green'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500 hover:shadow-neon-green'
          }`}
        >
          <X className="w-5 h-5" />
          <span>I Haven't</span>
        </button>

        <button
          onClick={nextCard}
          className="px-6 py-4 rounded-2xl bg-gradient-to-r from-brand-violet to-purple-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm shadow-neon-violet flex items-center gap-2 transition-all active:scale-95"
        >
          <span>Next Card</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
