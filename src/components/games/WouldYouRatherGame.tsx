import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { votingService, VoteStats } from '../../services/votingService';
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

  const currentPrompt = prompts[currentIndex] || prompts[0];

  const handleVote = async (choice: 'A' | 'B') => {
    if (selectedChoice || isSubmitting) return;
    setSelectedChoice(choice);
    setIsSubmitting(true);

    try {
      const stats = await votingService.recordVote(currentPrompt.id, choice);
      setVoteStats(stats);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: choice === 'A' ? ['#06B6D4', '#3B82F6'] : ['#EC4899', '#A855F7'],
      });
    } catch (e) {
      // Local fallback
      setVoteStats(votingService.getStats(currentPrompt.id));
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextCard = () => {
    setSelectedChoice(null);
    setVoteStats(null);
    setCurrentIndex(prev => (prev + 1) % prompts.length);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6">
      
      {/* Question Header */}
      <div className="text-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-neon-cyan/20">
          Would You Rather
        </span>
        <h3 className="text-sm text-zinc-400 font-medium mt-2">
          Make the impossible call & see how humanity voted
        </h3>
      </div>

      {/* Choice Grid: Option A vs Option B */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
        
        {/* OPTION A */}
        <button
          onClick={() => handleVote('A')}
          disabled={!!selectedChoice}
          className={`group relative p-8 sm:p-10 rounded-3xl glass-panel border flex flex-col justify-between items-center text-center transition-all duration-300 active:scale-[0.98] ${
            selectedChoice === 'A'
              ? 'border-cyan-400 bg-cyan-950/40 shadow-neon-cyan ring-2 ring-cyan-400/50 scale-[1.02]'
              : 'border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-neon-cyan/30'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30">
              Option A
            </span>
            {selectedChoice === 'A' && (
              <CheckCircle2 className="w-5 h-5 text-cyan-400 animate-scale-in" />
            )}
          </div>

          <p className="text-lg sm:text-2xl font-black text-white leading-relaxed my-6 flex-1 flex items-center justify-center">
            {currentPrompt?.optionA || currentPrompt?.text}
          </p>

          {/* Voting percentage bar */}
          {voteStats && (
            <div className="w-full mt-4 animate-fade-in">
              <div className="flex justify-between items-center text-sm font-black text-cyan-300 mb-1.5">
                <span>Voted</span>
                <span className="text-2xl font-black">{voteStats.optionAPercentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
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
          className={`group relative p-8 sm:p-10 rounded-3xl glass-panel border flex flex-col justify-between items-center text-center transition-all duration-300 active:scale-[0.98] ${
            selectedChoice === 'B'
              ? 'border-pink-400 bg-pink-950/40 shadow-neon-pink ring-2 ring-pink-400/50 scale-[1.02]'
              : 'border-pink-500/20 hover:border-pink-400/60 hover:shadow-neon-pink/30'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-pink-400 px-3 py-1 rounded-full bg-pink-950 border border-pink-500/30">
              Option B
            </span>
            {selectedChoice === 'B' && (
              <CheckCircle2 className="w-5 h-5 text-pink-400 animate-scale-in" />
            )}
          </div>

          <p className="text-lg sm:text-2xl font-black text-white leading-relaxed my-6 flex-1 flex items-center justify-center">
            {currentPrompt?.optionB || 'Live with the consequences of Option A'}
          </p>

          {/* Voting percentage bar */}
          {voteStats && (
            <div className="w-full mt-4 animate-fade-in">
              <div className="flex justify-between items-center text-sm font-black text-pink-300 mb-1.5">
                <span>Voted</span>
                <span className="text-2xl font-black">{voteStats.optionBPercentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
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
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-black text-base shadow-2xl flex items-center gap-2 transition-all active:scale-95 animate-scale-in"
        >
          <span>Next Dilemma</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};
