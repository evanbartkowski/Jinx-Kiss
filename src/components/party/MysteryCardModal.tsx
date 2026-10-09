import React, { useState } from 'react';
import { MysteryCard } from '../../types/game';
import { soundEffects } from '../../utils/audio';
import { Sparkles, X, ShieldAlert, Award, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MysteryCardModalProps {
  card: MysteryCard;
  onClose: () => void;
}

export const MysteryCardModal: React.FC<MysteryCardModalProps> = ({ card, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      soundEffects.playMystery();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#A855F7', '#EC4899', '#8B5CF6'],
      });
    }
  };

  const handleAcknowledge = () => {
    soundEffects.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* The Card */}
        <div
          onClick={handleFlip}
          className={`w-full min-h-[380px] rounded-3xl p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-500 relative select-none border ${
            isFlipped
              ? 'bg-gradient-to-b from-[#180b2a] to-[#0a0515] border-purple-500/60 shadow-[0_0_60px_rgba(168,85,247,0.35)] scale-100'
              : 'bg-gradient-to-b from-[#0f0c1b] to-[#050505] border-purple-500/30 hover:border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:scale-105'
          }`}
        >
          {/* Subtle Ambient Shift */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-pink-500/10 via-purple-500/15 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white border border-white/10 z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {!isFlipped ? (
            /* Card Front (Mystery Backing) */
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="w-20 h-20 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-6 shadow-neon-violet/30 animate-pulse-slow">
                <Sparkles className="w-10 h-10" />
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2">
                A Rare Event Has Occurred
              </span>

              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">
                Mystery Card
              </h3>

              <span className="px-5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-neon-violet">
                Tap To Reveal Secrets
              </span>
            </div>
          ) : (
            /* Card Revealed Content */
            <div className="flex flex-col items-center justify-between h-full w-full animate-scale-in">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 mb-3 shadow-neon-violet/30">
                  {card.type === 'bonus' ? <Award className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-1">
                  Active Party Event
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide mb-3">
                  {card.title}
                </h3>

                <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>

              {/* Badges */}
              <div className="w-full flex items-center justify-center gap-3 my-4">
                {card.durationRounds && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Lasts {card.durationRounds} round{card.durationRounds > 1 ? 's' : ''}
                  </span>
                )}
                {card.points && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-xs text-purple-300 font-bold">
                    +{card.points} pts
                  </span>
                )}
              </div>

              <button
                onClick={handleAcknowledge}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-neon-violet active:scale-95 transition-all"
              >
                Acknowledge Event
              </button>
            </div>
          )}

          <div className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase mt-4">
            Jinx Kiss Chaos Vault
          </div>
        </div>
      </div>
    </div>
  );
};
