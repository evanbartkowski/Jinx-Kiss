import React, { useEffect } from 'react';
import { GameCategory } from '../../types/game';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Flame, ArrowUpCircle, Sparkles, ArrowRight } from 'lucide-react';

interface ProgressiveLevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newCategory: GameCategory;
  previousCategory?: GameCategory;
}

export const ProgressiveLevelUpModal: React.FC<ProgressiveLevelUpModalProps> = ({
  isOpen,
  onClose,
  newCategory,
  previousCategory,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEffects.playLevelUp();
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF4DA6', '#A855F7', '#10B981', '#F59E0B'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTierDescription = (cat: GameCategory) => {
    switch (cat) {
      case 'medium': return 'The ice is officially broken! Questions are getting juicier and dares are getting bolder.';
      case 'spicy': return 'Tension rising! Flirty, intimate, and mischievous cards enter the mix.';
      case 'extreme': return 'High stakes! Deep secrets, unfiltered confessions, and wild challenges.';
      case '18+': return 'After hours unlocked. Late-night adult truths and uncensored questions.';
      case 'unhinged': return 'MAXIMUM CHAOS! Unpredictable, hilarious, and completely wild prompts.';
      default: return 'The party advances to the next tier of intensity and excitement!';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl glass-panel border border-brand-pink/50 p-8 text-center relative shadow-neon-pink/30 animate-scale-in">
        <div className="w-16 h-16 rounded-3xl bg-brand-pink/20 border border-brand-pink/50 flex items-center justify-center text-brand-pink mx-auto mb-5 shadow-neon-pink animate-bounce-subtle">
          <ArrowUpCircle className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-pink-950/60 border border-pink-500/40 text-pink-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Progressive Difficulty Level Up</span>
        </div>

        <h2 className="text-3xl font-black uppercase text-white mb-2 tracking-wide">
          Tier Upgraded!
        </h2>

        <div className="flex items-center justify-center gap-2 text-sm font-bold my-4">
          {previousCategory && (
            <>
              <span className="text-zinc-400 capitalize">{previousCategory}</span>
              <span className="text-zinc-600">→</span>
            </>
          )}
          <span className="px-3.5 py-1.5 rounded-xl bg-brand-pink text-white uppercase tracking-wider font-black shadow-neon-pink">
            {newCategory} Mode
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
          {getTierDescription(newCategory)}
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-neon-pink flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>Continue The Party</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

