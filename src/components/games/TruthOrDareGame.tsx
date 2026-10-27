import { useLegendaryDraw } from '../../hooks/useLegendaryDraw';
import { useLivePromptState } from '../../hooks/useLivePrompt';
import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { ArrowRight, RotateCw, SkipForward, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TruthOrDareGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ prompts, players }) => {
  const rollForLegendaryCard = useLegendaryDraw();
  const [selectedType, setSelectedType] = useState<'truth' | 'dare'>('truth');
  const [currentPrompt, setCurrentPrompt] = useLivePromptState<PromptItem | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<string>>(new Set());
  const [playerIndex, setPlayerIndex] = useState(0);
  const [, setIsRevealed] = useState(false);

  const truths = prompts.filter(p => p.type === 'truth');
  const dares = prompts.filter(p => p.type === 'dare');

  const activePlayer = players.length > 0 ? players[playerIndex % players.length] : null;

  const pickNextPrompt = (type: 'truth' | 'dare') => {
    setSelectedType(type);
    setIsRevealed(false);

    const pool = type === 'truth' ? truths : dares;
    if (pool.length === 0) return;
    const available = pool.filter(p => !usedPromptIds.has(p.id));

    let chosen: PromptItem;
    if (available.length > 0) {
      chosen = available[Math.floor(Math.random() * available.length)];
      setUsedPromptIds(prev => new Set(prev).add(chosen.id));
    } else {
      // Pool exhausted, reset pool
      setUsedPromptIds(new Set());
      chosen = pool[Math.floor(Math.random() * pool.length)];
    }

    // Rare roll to summon a legendary card for the category
    chosen = rollForLegendaryCard(chosen, chosen.category || 'medium', 'truth-or-dare', 0.02, chosen.playMode);

    setTimeout(() => {
      setCurrentPrompt(chosen);
      setIsRevealed(true);
      if (isPromptLegendary(chosen)) {
        triggerLegendaryCardEffects(chosen);
      } else {
        soundEffects.playCardFlip();
      }
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

  const isLegendary = isPromptLegendary(currentPrompt);

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      
      {/* Player Turn banner if players are set */}
      {activePlayer && (
        <div className="text-center animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Active Turn</span>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mt-1 drop-shadow-[0_0_15px_rgba(255,77,166,0.35)]">
            {activePlayer}'s Choice
          </h3>
        </div>
      )}

      {/* Choice Buttons: Truth or Dare (Significantly Bigger & Screen-Filling) */}
      {!currentPrompt ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 my-4 sm:my-8 animate-scale-in">
          
          {/* Truth Option Card */}
          <button
            onClick={() => pickNextPrompt('truth')}
            disabled={truths.length === 0}
            className="group relative p-6 sm:p-14 md:p-16 min-h-[220px] sm:min-h-[420px] rounded-3xl sm:rounded-4xl glass-panel border border-brand-pink/40 hover:border-brand-pink hover:shadow-neon-pink flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer bg-gradient-to-b from-pink-950/25 via-black/50 to-black/90"
          >
            <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-2xl sm:rounded-4xl bg-brand-pink/20 border border-brand-pink/50 flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform shadow-neon-pink/40">
              <Sparkles className="w-8 h-8 sm:w-14 sm:h-14" />
            </div>

            <div className="my-2 sm:my-0">
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,77,166,0.6)]">
                Truth
              </h3>
              <p className="text-xs sm:text-base text-zinc-300 font-medium mt-1.5 sm:mt-3 max-w-sm leading-relaxed">
                Confess unfiltered secrets, embarrassing memories, and unspoken truths
              </p>
            </div>

            <span className="text-[10px] sm:text-sm font-black text-pink-300 bg-pink-950/80 border border-pink-500/50 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-neon-pink/30">
              {truths.length} Curated Truths
            </span>
          </button>

          {/* Dare Option Card */}
          <button
            onClick={() => pickNextPrompt('dare')}
            disabled={dares.length === 0}
            className="group relative p-6 sm:p-14 md:p-16 min-h-[220px] sm:min-h-[420px] rounded-3xl sm:rounded-4xl glass-panel border border-brand-violet/40 hover:border-brand-violet hover:shadow-neon-violet flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer bg-gradient-to-b from-purple-950/25 via-black/50 to-black/90"
          >
            <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-2xl sm:rounded-4xl bg-brand-violet/20 border border-brand-violet/50 flex items-center justify-center text-brand-violet group-hover:scale-110 transition-transform shadow-neon-violet/40">
              <Flame className="w-8 h-8 sm:w-14 sm:h-14" />
            </div>

            <div className="my-2 sm:my-0">
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-widest drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                Dare
              </h3>
              <p className="text-xs sm:text-base text-zinc-300 font-medium mt-1.5 sm:mt-3 max-w-sm leading-relaxed">
                Take on wild, bold challenges and unpredictable group dares
              </p>
            </div>

            <span className="text-[10px] sm:text-sm font-black text-purple-300 bg-purple-950/80 border border-purple-500/50 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-neon-violet/30">
              {dares.length} Curated Dares
            </span>
          </button>

        </div>
      ) : (
        /* Prompt Reveal Card (Substantially Bigger, Screen-Filling & Legendary-Aware) */
        <div className="w-full flex flex-col items-center gap-4 sm:gap-6 animate-scale-in">
          
          <div
            className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-6 sm:p-12 md:p-16 rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-500 ${
              isLegendary
                ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
                : selectedType === 'truth'
                ? 'border-brand-pink/60 shadow-[0_0_45px_rgba(255,77,166,0.35)]'
                : 'border-brand-violet/60 shadow-[0_0_45px_rgba(168,85,247,0.35)]'
            }`}
          >
            {/* Ambient Background Gradient Glow */}
            <div
              className={`absolute inset-0 pointer-events-none blur-3xl ${
                isLegendary
                  ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
                  : selectedType === 'truth'
                  ? 'bg-gradient-to-b from-pink-600 to-transparent opacity-20'
                  : 'bg-gradient-to-b from-purple-600 to-transparent opacity-20'
              }`}
            />

            {/* Top Badge: Legendary Badge or Normal Type badge */}
            <div className="flex items-center gap-2 z-10">
              {isLegendary ? (
                <LegendaryCardBadge title={currentPrompt.legendaryTitle || `★ LEGENDARY ${selectedType.toUpperCase()} ★`} size="lg" />
              ) : (
                <span
                  className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest border ${
                    selectedType === 'truth'
                      ? 'bg-brand-pink/20 border-brand-pink text-pink-300 shadow-neon-pink/40'
                      : 'bg-brand-violet/20 border-brand-violet text-violet-300 shadow-neon-violet/40'
                  }`}
                >
                  {selectedType}
                </span>
              )}
              {currentPrompt.authorUsername && (
                <span className="text-xs text-zinc-400 font-medium">
                  by @{currentPrompt.authorUsername}
                </span>
              )}
            </div>

            {/* Prompt Text (Big, Crisp, High-Impact, Screen-Fitting) */}
            <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-snug sm:leading-tight my-6 sm:my-10 max-w-4xl z-10 ${
              isLegendary
                ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
                : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]'
            }`}>
              "{currentPrompt.text}"
            </p>

            {/* Turn status */}
            {(activePlayer || usedPromptIds.size <= 1) && (
              <div className="text-xs sm:text-base text-zinc-300 font-semibold mb-3 sm:mb-4 z-10 animate-fade-in">
                {activePlayer ? `Target Player: ${activePlayer}` : 'Share your answer or complete the challenge with the group!'}
              </div>
            )}

            {/* Rating, Favorite, Report Bar */}
            <div className="w-full max-w-md z-10">
              <CardRatingBar prompt={currentPrompt} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-2 sm:mt-3">
            <button
              onClick={triggerCelebration}
              className="px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Done! Next Turn</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => pickNextPrompt(selectedType)}
              className="px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Another {selectedType}</span>
            </button>

            <button
              onClick={advanceTurn}
              className="px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Skip</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
