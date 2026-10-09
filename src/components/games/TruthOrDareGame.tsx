import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { ArrowRight, RotateCw, SkipForward, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TruthOrDareGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ prompts, players }) => {
  const [selectedType, setSelectedType] = useState<'truth' | 'dare'>('truth');
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<string>>(new Set());
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const truths = prompts.filter(p => p.type === 'truth' || !p.type);
  const dares = prompts.filter(p => p.type === 'dare');

  const activePlayer = players.length > 0 ? players[playerIndex % players.length] : null;

  const pickNextPrompt = (type: 'truth' | 'dare') => {
    setSelectedType(type);
    setIsRevealed(false);

    const pool = type === 'truth' ? truths : dares;
    const available = pool.filter(p => !usedPromptIds.has(p.id));

    let chosen: PromptItem;
    if (available.length > 0) {
      chosen = available[Math.floor(Math.random() * available.length)];
      setUsedPromptIds(prev => new Set(prev).add(chosen.id));
    } else {
      // Pool exhausted, reset pool
      setUsedPromptIds(new Set());
      chosen = pool[Math.floor(Math.random() * pool.length)] || prompts[0];
    }

    setTimeout(() => {
      setCurrentPrompt(chosen);
      setIsRevealed(true);
    }, 150);
  };

  const advanceTurn = () => {
    if (players.length > 0) {
      setPlayerIndex(prev => (prev + 1) % players.length);
    }
    setCurrentPrompt(null);
    setIsRevealed(false);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: selectedType === 'truth' ? ['#FF4DA6', '#A855F7'] : ['#EF4444', '#F97316'],
    });
    advanceTurn();
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      
      {/* Player Turn banner if players are set */}
      {activePlayer && (
        <div className="text-center animate-fade-in">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Active Turn</span>
          <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,77,166,0.3)]">
            {activePlayer}'s Choice
          </h3>
        </div>
      )}

      {/* Choice Buttons: Truth or Dare */}
      {!currentPrompt ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 animate-scale-in">
          
          {/* Truth Option */}
          <button
            onClick={() => pickNextPrompt('truth')}
            className="group relative p-8 sm:p-10 rounded-3xl glass-panel border border-brand-pink/30 hover:border-brand-pink hover:shadow-neon-pink flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-pink/20 border border-brand-pink/40 flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform shadow-neon-pink/40">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-wider">Truth</h3>
              <p className="text-xs text-zinc-400 mt-1">Confess deepest secrets & unspoken stories</p>
            </div>
            <span className="text-xs font-semibold text-pink-300 bg-pink-950/60 border border-pink-500/30 px-3 py-1 rounded-full">
              {truths.length} Prompts
            </span>
          </button>

          {/* Dare Option */}
          <button
            onClick={() => pickNextPrompt('dare')}
            className="group relative p-8 sm:p-10 rounded-3xl glass-panel border border-brand-violet/30 hover:border-brand-violet hover:shadow-neon-violet flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet group-hover:scale-110 transition-transform shadow-neon-violet/40">
              <Flame className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-wider">Dare</h3>
              <p className="text-xs text-zinc-400 mt-1">Take on hilarious, bold challenges with friends</p>
            </div>
            <span className="text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
              {dares.length} Prompts
            </span>
          </button>

        </div>
      ) : (
        /* Prompt Reveal Card */
        <div className="w-full flex flex-col items-center gap-6 animate-scale-in">
          
          <div
            className={`w-full min-h-[280px] sm:min-h-[320px] p-8 sm:p-12 rounded-3xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-500 ${
              selectedType === 'truth'
                ? 'border-brand-pink/50 shadow-neon-pink/40'
                : 'border-brand-violet/50 shadow-neon-violet/40'
            }`}
          >
            {/* Type pill */}
            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                  selectedType === 'truth'
                    ? 'bg-brand-pink/20 border-brand-pink text-pink-300 shadow-neon-pink/30'
                    : 'bg-brand-violet/20 border-brand-violet text-violet-300 shadow-neon-violet/30'
                }`}
              >
                {selectedType}
              </span>
              {currentPrompt.authorUsername && (
                <span className="text-[11px] text-zinc-400 font-medium">
                  by @{currentPrompt.authorUsername}
                </span>
              )}
            </div>

            {/* Prompt Text */}
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed my-6 max-w-xl">
              "{currentPrompt.text}"
            </p>

            {/* Turn status */}
            <div className="text-xs text-zinc-400 font-medium">
              {activePlayer ? `Target: ${activePlayer}` : 'Share your answer or complete the challenge!'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={triggerCelebration}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Done! Next Turn</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => pickNextPrompt(selectedType)}
              className="px-4 py-3 rounded-2xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm flex items-center gap-1.5 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              <span>Another {selectedType}</span>
            </button>

            <button
              onClick={advanceTurn}
              className="px-4 py-3 rounded-2xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold text-sm flex items-center gap-1.5 transition-all"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
