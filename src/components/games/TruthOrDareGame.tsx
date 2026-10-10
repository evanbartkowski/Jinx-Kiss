import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
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
  const [, setIsRevealed] = useState(false);

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

    soundEffects.playCardFlip();
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
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 },
      colors: selectedType === 'truth' ? ['#FF4DA6', '#A855F7'] : ['#EF4444', '#F97316'],
    });
    advanceTurn();
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6 animate-fade-in select-none">
      
      {/* Player Turn banner if players are set */}
      {activePlayer && (
        <div className="text-center animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Active Turn</span>
          <h3 className="text-2xl sm:text-4xl font-black text-white mt-1 drop-shadow-[0_0_15px_rgba(255,77,166,0.35)]">
            {activePlayer}'s Choice
          </h3>
        </div>
      )}

      {/* Choice Buttons: Truth or Dare (Significantly Bigger & Bolder) */}
      {!currentPrompt ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 my-4 sm:my-8 animate-scale-in">
          
          {/* Truth Option Card */}
          <button
            onClick={() => pickNextPrompt('truth')}
            className="group relative p-8 sm:p-14 min-h-[260px] sm:min-h-[360px] rounded-3xl sm:rounded-4xl glass-panel border border-brand-pink/40 hover:border-brand-pink hover:shadow-neon-pink flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer bg-gradient-to-b from-pink-950/20 via-black/40 to-black/80"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-brand-pink/20 border border-brand-pink/50 flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform shadow-neon-pink/40">
              <Sparkles className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>

            <div>
              <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,77,166,0.5)]">
                Truth
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-2 max-w-xs leading-relaxed">
                Confess unfiltered secrets, embarrassing memories, and unspoken truths
              </p>
            </div>

            <span className="text-xs sm:text-sm font-black text-pink-300 bg-pink-950/70 border border-pink-500/40 px-4 py-1.5 rounded-full shadow-neon-pink/20">
              {truths.length} Curated Truths
            </span>
          </button>

          {/* Dare Option Card */}
          <button
            onClick={() => pickNextPrompt('dare')}
            className="group relative p-8 sm:p-14 min-h-[260px] sm:min-h-[360px] rounded-3xl sm:rounded-4xl glass-panel border border-brand-violet/40 hover:border-brand-violet hover:shadow-neon-violet flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer bg-gradient-to-b from-purple-950/20 via-black/40 to-black/80"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-brand-violet/20 border border-brand-violet/50 flex items-center justify-center text-brand-violet group-hover:scale-110 transition-transform shadow-neon-violet/40">
              <Flame className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>

            <div>
              <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-widest drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                Dare
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-2 max-w-xs leading-relaxed">
                Take on wild, bold challenges and unpredictable group dares
              </p>
            </div>

            <span className="text-xs sm:text-sm font-black text-purple-300 bg-purple-950/70 border border-purple-500/40 px-4 py-1.5 rounded-full shadow-neon-violet/20">
              {dares.length} Curated Dares
            </span>
          </button>

        </div>
      ) : (
        /* Prompt Reveal Card (Substantially Bigger, Bolder & Ultra-Readable) */
        <div className="w-full flex flex-col items-center gap-6 animate-scale-in">
          
          <div
            className={`w-full min-h-[380px] sm:min-h-[460px] p-8 sm:p-14 md:p-16 rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-500 ${
              selectedType === 'truth'
                ? 'border-brand-pink/60 shadow-[0_0_45px_rgba(255,77,166,0.35)]'
                : 'border-brand-violet/60 shadow-[0_0_45px_rgba(168,85,247,0.35)]'
            }`}
          >
            {/* Ambient Background Gradient Glow */}
            <div
              className={`absolute inset-0 pointer-events-none opacity-20 blur-3xl ${
                selectedType === 'truth'
                  ? 'bg-gradient-to-b from-pink-600 to-transparent'
                  : 'bg-gradient-to-b from-purple-600 to-transparent'
              }`}
            />

            {/* Type badge */}
            <div className="flex items-center gap-2 z-10">
              <span
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest border ${
                  selectedType === 'truth'
                    ? 'bg-brand-pink/20 border-brand-pink text-pink-300 shadow-neon-pink/40'
                    : 'bg-brand-violet/20 border-brand-violet text-violet-300 shadow-neon-violet/40'
                }`}
              >
                {selectedType}
              </span>
              {currentPrompt.authorUsername && (
                <span className="text-xs text-zinc-400 font-medium">
                  by @{currentPrompt.authorUsername}
                </span>
              )}
            </div>

            {/* Prompt Text (Big, Crisp, High-Impact) */}
            <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-snug sm:leading-tight my-6 sm:my-10 max-w-3xl drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] z-10">
              "{currentPrompt.text}"
            </p>

            {/* Turn status */}
            <div className="text-xs sm:text-sm text-zinc-300 font-semibold mb-4 z-10">
              {activePlayer ? `Target Player: ${activePlayer}` : 'Share your answer or complete the challenge with the group!'}
            </div>

            {/* Rating, Favorite, Report Bar */}
            <div className="w-full max-w-md z-10">
              <CardRatingBar prompt={currentPrompt} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
            <button
              onClick={triggerCelebration}
              className="px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Done! Next Turn</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => pickNextPrompt(selectedType)}
              className="px-6 py-4 rounded-2xl border border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Another {selectedType}</span>
            </button>

            <button
              onClick={advanceTurn}
              className="px-6 py-4 rounded-2xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
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
