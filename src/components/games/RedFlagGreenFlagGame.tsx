import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { ArrowRight, Flag, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RedFlagGreenFlagGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const RedFlagGreenFlagGame: React.FC<RedFlagGreenFlagGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFlag, setSelectedFlag] = useState<'red' | 'green' | 'depends' | null>(null);

  const currentPrompt = prompts[currentIndex] || prompts[0];

  const handleVote = (choice: 'red' | 'green' | 'depends') => {
    setSelectedFlag(choice);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: choice === 'red' ? ['#EF4444', '#DC2626'] : choice === 'green' ? ['#10B981', '#059669'] : ['#F59E0B', '#D97706'],
    });
  };

  const nextCard = () => {
    setSelectedFlag(null);
    setCurrentIndex(prev => (prev + 1) % prompts.length);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      
      {/* Category header */}
      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 shadow-neon-green/20">
        🚩 Dealbreaker or Keeper? 🟢
      </span>

      {/* Main Situation Card */}
      <div className={`w-full min-h-[300px] p-8 sm:p-12 rounded-3xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 ${
        selectedFlag === 'red'
          ? 'border-red-500/60 shadow-neon-red/40'
          : selectedFlag === 'green'
          ? 'border-emerald-500/60 shadow-neon-green/40'
          : selectedFlag === 'depends'
          ? 'border-amber-500/60 shadow-neon-amber/40'
          : 'border-white/10'
      }`}>
        
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          Scenario #{currentIndex + 1}
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed my-6 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {/* Choice Reveal Indicator */}
        {selectedFlag && (
          <div className="animate-fade-in flex items-center gap-2 text-sm font-bold">
            {selectedFlag === 'red' && (
              <span className="text-red-300 bg-red-950/80 border border-red-500/50 px-4 py-1.5 rounded-full shadow-neon-red">
                🚩 Major Red Flag — Run!
              </span>
            )}
            {selectedFlag === 'green' && (
              <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-4 py-1.5 rounded-full shadow-neon-green">
                🟢 Certified Green Flag — Keeper!
              </span>
            )}
            {selectedFlag === 'depends' && (
              <span className="text-amber-300 bg-amber-950/80 border border-amber-500/50 px-4 py-1.5 rounded-full shadow-neon-amber">
                🟡 It Depends — Needs Context!
              </span>
            )}
          </div>
        )}

        <div className="text-xs text-zinc-500 font-medium">
          Cast your judgment and defend your standard to the group.
        </div>

      </div>

      {/* Voting Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        
        {/* Red Flag */}
        <button
          onClick={() => handleVote('red')}
          disabled={!!selectedFlag}
          className={`flex-1 min-w-[120px] max-w-[170px] py-3.5 rounded-2xl border font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            selectedFlag === 'red'
              ? 'bg-red-600 border-red-400 text-white shadow-neon-red scale-105'
              : 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/60 hover:border-red-500'
          }`}
        >
          <Flag className="w-4 h-4 fill-red-400 text-red-400" />
          <span>Red Flag</span>
        </button>

        {/* Green Flag */}
        <button
          onClick={() => handleVote('green')}
          disabled={!!selectedFlag}
          className={`flex-1 min-w-[120px] max-w-[170px] py-3.5 rounded-2xl border font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            selectedFlag === 'green'
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-neon-green scale-105'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500'
          }`}
        >
          <Flag className="w-4 h-4 fill-emerald-400 text-emerald-400" />
          <span>Green Flag</span>
        </button>

        {/* It Depends */}
        <button
          onClick={() => handleVote('depends')}
          disabled={!!selectedFlag}
          className={`flex-1 min-w-[120px] max-w-[170px] py-3.5 rounded-2xl border font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            selectedFlag === 'depends'
              ? 'bg-amber-600 border-amber-400 text-white shadow-neon-amber scale-105'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>It Depends</span>
        </button>

        {selectedFlag && (
          <button
            onClick={nextCard}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-neon-green flex items-center gap-2 transition-all active:scale-95 animate-scale-in"
          >
            <span>Next Scenario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

      </div>

    </div>
  );
};
