import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { votingService, VoteStats } from '../../services/votingService';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { ArrowRight, CheckCircle2, SplitSquareVertical } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WouldYouRatherGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const WouldYouRatherGame: React.FC<WouldYouRatherGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [voteStats, setVoteStats] = useState<VoteStats | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePrompt, setActivePrompt] = useState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init',
      gameId: 'would-you-rather',
      category: 'medium',
      text: 'Would you rather?',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'would-you-rather');
  });

  const isLegendary = isPromptLegendary(activePrompt);

  useEffect(() => {
    if (isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt.id]);

  const handleVote = async (choice: 'A' | 'B') => {
    if (selectedChoice || isSubmitting) return;
    setSelectedChoice(choice);
    setIsSubmitting(true);
    soundEffects.playVoteSubmit();

    try {
      const stats = await votingService.recordVote(activePrompt.id, choice);
      setVoteStats(stats);
      soundEffects.playVoteReveal();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: choice === 'A' ? ['#06B6D4', '#3B82F6'] : ['#EC4899', '#A855F7'],
      });
    } catch (e) {
      // Local fallback
      setVoteStats(votingService.getStats(activePrompt.id));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextCard = () => {
    soundEffects.playCardFlip();
    setSelectedChoice(null);
    setVoteStats(null);
    const nextIdx = (currentIndex + 1) % prompts.length;
    setCurrentIndex(nextIdx);
    const nextP = prompts[nextIdx] || prompts[0];
    const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'would-you-rather');
    setActivePrompt(rolled);
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6">
      
      {/* Question Header & Legendary Badge */}
      <div className="text-center flex flex-col items-center gap-2">
        {isLegendary ? (
          <LegendaryCardBadge title={activePrompt.legendaryTitle || '★ LEGENDARY SHOWDOWN ★'} size="lg" />
        ) : (
          <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-neon-cyan/20">
            Would You Rather
          </span>
        )}
        <h3 className="text-sm sm:text-base text-zinc-300 font-medium mt-1">
          Make the impossible call & see how humanity voted
        </h3>
      </div>

      {/* Choice Grid: Option A vs Option B (Screen-Filling & Massive) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 my-3">
        
        {/* OPTION A */}
        <button
          onClick={() => handleVote('A')}
          disabled={!!selectedChoice}
          className={`group relative p-5 sm:p-12 md:p-16 min-h-[190px] sm:min-h-[360px] md:min-h-[440px] rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center transition-all duration-300 active:scale-[0.98] cursor-pointer ${
            isLegendary
              ? selectedChoice === 'A'
                ? 'border-2 border-yellow-400 bg-yellow-950/60 shadow-[0_0_50px_rgba(250,204,21,0.7)] ring-2 ring-yellow-400 scale-[1.02]'
                : 'border-2 border-yellow-400/80 hover:border-yellow-300 bg-yellow-950/20 hover:bg-yellow-950/40 shadow-[0_0_35px_rgba(250,204,21,0.4)]'
              : selectedChoice === 'A'
              ? 'border-cyan-400 bg-cyan-950/50 shadow-neon-cyan ring-2 ring-cyan-400/60 scale-[1.02]'
              : 'border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-neon-cyan/40 bg-cyan-950/15'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
            <span className={`text-[10px] sm:text-sm font-black uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border ${
              isLegendary
                ? 'text-yellow-300 bg-yellow-950 border-yellow-400/50 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                : 'text-cyan-300 bg-cyan-950 border-cyan-500/40'
            }`}>
              Option A
            </span>
            {selectedChoice === 'A' && (
              <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 animate-scale-in ${isLegendary ? 'text-yellow-400' : 'text-cyan-400'}`} />
            )}
          </div>

          <p className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-snug sm:leading-tight my-4 sm:my-6 flex-1 flex items-center justify-center ${
            isLegendary ? 'text-yellow-100 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'text-white'
          }`}>
            {activePrompt?.optionA || activePrompt?.text}
          </p>

          {/* Voting percentage bar */}
          {voteStats && (
            <div className="w-full mt-3 sm:mt-4 animate-fade-in">
              <div className="flex justify-between items-center text-xs sm:text-base font-black text-cyan-300 mb-1.5 sm:mb-2">
                <span>Voted Option A</span>
                <span className="text-xl sm:text-3xl font-black">{voteStats.optionAPercentage}%</span>
              </div>
              <div className="w-full h-3 sm:h-4 rounded-full bg-black/70 overflow-hidden border border-white/15">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isLegendary ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${voteStats.optionAPercentage}%` }}
                />
              </div>
            </div>
          )}
        </button>

        {/* OPTION B */}
        <button
          onClick={() => handleVote('B')}
          disabled={!!selectedChoice}
          className={`group relative p-5 sm:p-12 md:p-16 min-h-[190px] sm:min-h-[360px] md:min-h-[440px] rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center transition-all duration-300 active:scale-[0.98] cursor-pointer ${
            isLegendary
              ? selectedChoice === 'B'
                ? 'border-2 border-yellow-400 bg-yellow-950/60 shadow-[0_0_50px_rgba(250,204,21,0.7)] ring-2 ring-yellow-400 scale-[1.02]'
                : 'border-2 border-yellow-400/80 hover:border-yellow-300 bg-yellow-950/20 hover:bg-yellow-950/40 shadow-[0_0_35px_rgba(250,204,21,0.4)]'
              : selectedChoice === 'B'
              ? 'border-pink-400 bg-pink-950/50 shadow-neon-pink ring-2 ring-pink-400/60 scale-[1.02]'
              : 'border-pink-500/30 hover:border-pink-400/70 hover:shadow-neon-pink/40 bg-pink-950/15'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
            <span className={`text-[10px] sm:text-sm font-black uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border ${
              isLegendary
                ? 'text-yellow-300 bg-yellow-950 border-yellow-400/50 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                : 'text-pink-300 bg-pink-950 border-pink-500/40'
            }`}>
              Option B
            </span>
            {selectedChoice === 'B' && (
              <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 animate-scale-in ${isLegendary ? 'text-yellow-400' : 'text-pink-400'}`} />
            )}
          </div>

          <p className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-snug sm:leading-tight my-4 sm:my-6 flex-1 flex items-center justify-center ${
            isLegendary ? 'text-yellow-100 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'text-white'
          }`}>
            {activePrompt?.optionB || 'Live with the consequences of Option A'}
          </p>

          {/* Voting percentage bar */}
          {voteStats && (
            <div className="w-full mt-4 animate-fade-in">
              <div className="flex justify-between items-center text-sm sm:text-base font-black text-pink-300 mb-2">
                <span>Voted Option B</span>
                <span className="text-3xl font-black">{voteStats.optionBPercentage}%</span>
              </div>
              <div className="w-full h-4 rounded-full bg-black/70 overflow-hidden border border-white/15">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isLegendary ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'
                  }`}
                  style={{ width: `${voteStats.optionBPercentage}%` }}
                />
              </div>
            </div>
          )}
        </button>

      </div>

      {/* Next Card Button */}
      {selectedChoice && (
        <button
          onClick={nextCard}
          className="px-10 sm:px-14 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-black text-base sm:text-lg shadow-2xl flex items-center gap-3 transition-all active:scale-95 animate-scale-in cursor-pointer"
        >
          <span>Next Dilemma</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Card Rating & Report Bar */}
      <div className="w-full max-w-md mt-2">
        <CardRatingBar prompt={activePrompt} />
      </div>

    </div>
  );
};

