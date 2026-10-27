import { RemovedPrompt } from '../common/RemovedPrompt';
import { useLivePromptState } from '../../hooks/useLivePrompt';
import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { ArrowRight, Flag, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RedFlagGreenFlagGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const RedFlagGreenFlagGame: React.FC<RedFlagGreenFlagGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFlag, setSelectedFlag] = useState<'red' | 'green' | 'depends' | null>(null);
  const [activePrompt, setActivePrompt] = useLivePromptState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init-rf',
      gameId: 'red-flag-green-flag',
      category: 'medium',
      text: 'Scenario...',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'red-flag-green-flag', 0.02, initial.playMode);
  });

  const isLegendary = isPromptLegendary(activePrompt);

  useEffect(() => {
    if (isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt?.id]);

  const handleVote = (choice: 'red' | 'green' | 'depends') => {
    setSelectedFlag(choice);
    soundEffects.playVoteSubmit();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: choice === 'red' ? ['#EF4444', '#DC2626'] : choice === 'green' ? ['#10B981', '#059669'] : ['#F59E0B', '#D97706'],
    });
  };

  const nextCard = () => {
    soundEffects.playCardFlip();
    setSelectedFlag(null);
    const nextIdx = (currentIndex + 1) % prompts.length;
    setCurrentIndex(nextIdx);
    const nextP = prompts[nextIdx] || prompts[0];
    const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'red-flag-green-flag', 0.02, nextP?.playMode);
    setActivePrompt(rolled);
  };

  if (!activePrompt) return <RemovedPrompt onNext={nextCard} />;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      
      {/* Category header / Legendary Badge */}
      <div className="flex flex-col items-center gap-2">
        {isLegendary ? (
          <LegendaryCardBadge title={activePrompt.legendaryTitle || '★ LEGENDARY JUDGMENT ★'} size="lg" />
        ) : (
          <span className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-zinc-950/80 border border-white/10 shadow-lg flex items-center gap-2">
            <span className="text-red-500 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              <Flag className="w-4 h-4 fill-red-500/50" /> Red Flag
            </span>
            <span className="text-zinc-500">/</span>
            <span className="text-emerald-400 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
              Green Flag <Flag className="w-4 h-4 fill-emerald-400/50" />
            </span>
          </span>
        )}
      </div>

      {/* Main Situation Card (Screen-Filling & Legendary-Aware) */}
      <div className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-5 sm:p-12 md:p-16 lg:p-20 rounded-2xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-500 ${
        isLegendary
          ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
          : selectedFlag === 'red'
          ? 'border-red-500/60 shadow-neon-red/40'
          : selectedFlag === 'green'
          ? 'border-emerald-500/60 shadow-neon-green/40'
          : selectedFlag === 'depends'
          ? 'border-amber-500/60 shadow-neon-amber/40'
          : 'border-white/10'
      }`}>
        
        {/* Glow ambient background */}
        <div
          className={`absolute inset-0 pointer-events-none blur-3xl ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : selectedFlag === 'red'
              ? 'bg-gradient-to-b from-red-600 to-transparent opacity-20'
              : selectedFlag === 'green'
              ? 'bg-gradient-to-b from-emerald-600 to-transparent opacity-20'
              : 'bg-gradient-to-b from-amber-600 to-transparent opacity-15'
          }`}
        />

        <span className="text-[11px] sm:text-sm uppercase tracking-widest text-zinc-400 font-semibold z-10">
          Scenario #{currentIndex + 1}
        </span>

        <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-snug my-5 sm:my-10 max-w-4xl z-10 ${
          isLegendary
            ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
            : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
        }`}>
          "{activePrompt?.text}"
        </p>

        {/* Choice Reveal Indicator */}
        {selectedFlag && (
          <div className="animate-fade-in flex items-center gap-2 text-xs sm:text-base font-black z-10">
            {selectedFlag === 'red' && (
              <span className="text-red-300 bg-red-950/80 border border-red-500/50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-neon-red">
                🚩 Major Red Flag — Run!
              </span>
            )}
            {selectedFlag === 'green' && (
              <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-neon-green">
                🟢 Certified Green Flag — Keeper!
              </span>
            )}
            {selectedFlag === 'depends' && (
              <span className="text-amber-300 bg-amber-950/80 border border-amber-500/50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-neon-amber">
                🟡 It Depends — Needs Context!
              </span>
            )}
          </div>
        )}

        {currentIndex === 0 && (
          <div className="text-xs sm:text-base text-zinc-300 font-semibold my-2 z-10">
            Cast your judgment and defend your standard to the group.
          </div>
        )}

        {/* Card Rating & Report Bar */}
        <div className="w-full max-w-md z-10">
          <CardRatingBar prompt={activePrompt} />
        </div>

      </div>

      {/* Voting Buttons (Massive & Tactile) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 w-full mt-1 sm:mt-2">
        
        {/* Red Flag */}
        <button
          onClick={() => handleVote('red')}
          disabled={!!selectedFlag}
          className={`flex-1 min-w-[100px] sm:min-w-[190px] max-w-[240px] py-3.5 sm:py-5 rounded-xl sm:rounded-3xl border font-black text-xs sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all active:scale-95 cursor-pointer ${
            selectedFlag === 'red'
              ? 'bg-red-600 border-red-400 text-white shadow-neon-red scale-105'
              : 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/60 hover:border-red-500'
          }`}
        >
          <Flag className="w-4 h-4 sm:w-5 sm:h-5 fill-red-400 text-red-400" />
          <span>Red Flag</span>
        </button>

        {/* Green Flag */}
        <button
          onClick={() => handleVote('green')}
          disabled={!!selectedFlag}
          className={`flex-1 min-w-[100px] sm:min-w-[190px] max-w-[240px] py-3.5 sm:py-5 rounded-xl sm:rounded-3xl border font-black text-xs sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all active:scale-95 cursor-pointer ${
            selectedFlag === 'green'
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-neon-green scale-105'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500'
          }`}
        >
          <Flag className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-400 text-emerald-400" />
          <span>Green Flag</span>
        </button>

        {/* It Depends */}
        <button
          onClick={() => handleVote('depends')}
          disabled={!!selectedFlag}
          className={`flex-1 min-w-[100px] sm:min-w-[190px] max-w-[240px] py-3.5 sm:py-5 rounded-xl sm:rounded-3xl border font-black text-xs sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all active:scale-95 cursor-pointer ${
            selectedFlag === 'depends'
              ? 'bg-amber-600 border-amber-400 text-white shadow-neon-amber scale-105'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500'
          }`}
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>It Depends</span>
        </button>

        {selectedFlag && (
          <button
            onClick={nextCard}
            className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-5 rounded-xl sm:rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm sm:text-lg shadow-neon-green flex items-center justify-center gap-2.5 sm:gap-3 transition-all active:scale-95 animate-scale-in cursor-pointer"
          >
            <span>Next Scenario</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

      </div>

    </div>
  );
};

