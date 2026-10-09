import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { HelpCircle, Check, X, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhosLyingGameProps {
  prompts: PromptItem[];
  players?: string[];
}

export const WhosLyingGame: React.FC<WhosLyingGameProps> = ({ prompts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPrompt = prompts[currentIndex] || prompts[0];
  const lieIndex = currentPrompt?.lieIndex ?? 2;

  const claims = [
    { label: 'Claim A', text: currentPrompt?.claimA || 'Claim A' },
    { label: 'Claim B', text: currentPrompt?.claimB || 'Claim B' },
    { label: 'Claim C', text: currentPrompt?.claimC || 'Claim C' },
  ];

  const handleSelectClaim = (index: number) => {
    if (isRevealed) return;
    soundEffects.playClick();
    setSelectedGuess(index);
  };

  const handleReveal = () => {
    if (selectedGuess === null) return;
    setIsRevealed(true);

    if (selectedGuess === lieIndex) {
      soundEffects.playSuccess();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#06B6D4', '#60A5FA'],
      });
    } else {
      soundEffects.playBuzzer();
    }
  };

  const handleNext = () => {
    soundEffects.playClick();
    setIsRevealed(false);
    setSelectedGuess(null);
    setCurrentIndex(prev => (prev + 1) % prompts.length);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {/* Category Pill */}
      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-950/60 border border-blue-500/50 text-blue-300 shadow-neon-cyan/20 flex items-center gap-2">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Who's Lying? — Round #{currentIndex + 1}</span>
      </span>

      {/* Main Prompt Card */}
      <div className="w-full p-8 sm:p-10 rounded-3xl glass-panel border border-blue-500/40 shadow-neon-cyan/30 flex flex-col items-center text-center animate-scale-in">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
          Two Truths & One Lie
        </span>

        <p className="text-lg sm:text-xl font-black text-white leading-relaxed mb-6 max-w-lg">
          "{currentPrompt?.text}"
        </p>

        {/* 3 Interactive Claim Options */}
        <div className="w-full flex flex-col gap-3 my-2 text-left">
          {claims.map((claim, idx) => {
            const isChosen = selectedGuess === idx;
            const isThisTheLie = idx === lieIndex;

            let borderStyle = 'border-white/10 hover:border-blue-400/40';
            let bgStyle = 'bg-white/[0.03]';
            let badgeStyle = 'bg-zinc-800 text-zinc-300';

            if (isRevealed) {
              if (isThisTheLie) {
                borderStyle = 'border-rose-500/80 shadow-neon-red/40';
                bgStyle = 'bg-rose-950/40';
                badgeStyle = 'bg-rose-500 text-white font-black';
              } else {
                borderStyle = 'border-emerald-500/60';
                bgStyle = 'bg-emerald-950/20';
                badgeStyle = 'bg-emerald-600 text-white font-black';
              }
            } else if (isChosen) {
              borderStyle = 'border-blue-400 shadow-neon-cyan/30';
              bgStyle = 'bg-blue-950/50';
              badgeStyle = 'bg-blue-500 text-white';
            }

            return (
              <button
                key={claim.label}
                onClick={() => handleSelectClaim(idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 active:scale-[0.99] ${borderStyle} ${bgStyle}`}
              >
                <div className={`px-2.5 py-1 rounded-xl text-xs shrink-0 font-bold ${badgeStyle}`}>
                  {claim.label}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 leading-snug">
                    {claim.text}
                  </p>
                  {isRevealed && isThisTheLie && (
                    <span className="inline-flex items-center gap-1 text-xs font-black text-rose-400 uppercase tracking-wider mt-2">
                      <X className="w-3.5 h-3.5" /> BUSTED! THIS IS THE LIE
                    </span>
                  )}
                  {isRevealed && !isThisTheLie && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-wider mt-2">
                      <Check className="w-3.5 h-3.5" /> 100% TRUE FACT
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation Reveal */}
        {isRevealed && currentPrompt.explanation && (
          <div className="w-full p-4 rounded-2xl bg-black/60 border border-blue-500/30 text-left my-4 animate-scale-in">
            <span className="text-xs font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> The Real Story:
            </span>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {currentPrompt.explanation}
            </p>
          </div>
        )}

        {/* Card Rating Bar */}
        {currentPrompt && (
          <div className="w-full mt-4">
            <CardRatingBar prompt={currentPrompt} />
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {!isRevealed ? (
          <button
            onClick={handleReveal}
            disabled={selectedGuess === null}
            className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
              selectedGuess !== null
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-neon-cyan active:scale-95'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {selectedGuess !== null ? 'Lock In & Reveal Lie!' : 'Tap A Claim To Guess The Lie'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-neon-cyan flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Next Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
