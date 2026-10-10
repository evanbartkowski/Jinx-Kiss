import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { votingService, VoteStats } from '../../services/votingService';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { ArrowRight, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HotTakesGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const HotTakesGame: React.FC<HotTakesGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vote, setVote] = useState<'agree' | 'disagree' | null>(null);
  const [stats, setStats] = useState<VoteStats | null>(null);

  const currentPrompt = prompts[currentIndex] || prompts[0];

  const handleVote = async (choice: 'agree' | 'disagree') => {
    if (vote) return;
    setVote(choice);
    soundEffects.playVoteSubmit();

    try {
      const result = await votingService.recordVote(currentPrompt.id, choice === 'agree' ? 'A' : 'B');
      setStats(result);
      soundEffects.playVoteReveal();
    } catch {
      setStats(votingService.getStats(currentPrompt.id));
    }

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: choice === 'agree' ? ['#F97316', '#EF4444'] : ['#3B82F6', '#A855F7'],
    });
  };

  const nextCard = () => {
    soundEffects.playCardFlip();
    setVote(null);
    setStats(null);
    setCurrentIndex(prev => (prev + 1) % prompts.length);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      
      {/* Category header */}
      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-orange-950/60 border border-orange-500/50 text-orange-300 shadow-neon-amber/20">
        🔥 Hot Take #{currentIndex + 1}
      </span>

      {/* Main Hot Take Card */}
      <div className="w-full min-h-[300px] p-8 sm:p-12 rounded-3xl glass-panel border border-orange-500/40 shadow-neon-amber/30 flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in">
        
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
          Unpopular Opinion
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed my-6 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {/* Discussion prompt box if voted */}
        {vote && currentPrompt?.discussionPrompt && (
          <div className="w-full p-4 rounded-2xl bg-orange-950/40 border border-orange-500/30 flex items-start gap-3 text-left animate-fade-in my-2">
            <MessageSquare className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-orange-300 uppercase tracking-wider block">Group Discussion Prompt:</span>
              <p className="text-sm text-zinc-200 mt-0.5">{currentPrompt.discussionPrompt}</p>
            </div>
          </div>
        )}

        {/* Vote Results */}
        {stats && (
          <div className="w-full mt-4 flex items-center justify-around gap-4 animate-fade-in">
            <div className="text-center">
              <span className="text-xs font-semibold text-zinc-400">Agree</span>
              <div className="text-2xl font-black text-emerald-400">{stats.optionAPercentage}%</div>
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-zinc-400">Disagree</span>
              <div className="text-2xl font-black text-red-400">{stats.optionBPercentage}%</div>
            </div>
          </div>
        )}

        <div className="text-xs text-zinc-500 font-medium my-2">
          Argue with conviction. No fence-sitting allowed.
        </div>

        {/* Card Rating & Report Bar */}
        <div className="w-full">
          <CardRatingBar prompt={currentPrompt} />
        </div>

      </div>

      {/* Voting Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <button
          onClick={() => handleVote('agree')}
          disabled={!!vote}
          className={`flex-1 min-w-[140px] max-w-[200px] py-4 rounded-2xl border font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            vote === 'agree'
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-neon-green scale-105'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500 hover:shadow-neon-green'
          }`}
        >
          <ThumbsUp className="w-5 h-5" />
          <span>Agree</span>
        </button>

        <button
          onClick={() => handleVote('disagree')}
          disabled={!!vote}
          className={`flex-1 min-w-[140px] max-w-[200px] py-4 rounded-2xl border font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            vote === 'disagree'
              ? 'bg-red-600 border-red-400 text-white shadow-neon-red scale-105'
              : 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/60 hover:border-red-500 hover:shadow-neon-red'
          }`}
        >
          <ThumbsDown className="w-5 h-5" />
          <span>Disagree</span>
        </button>

        {vote && (
          <button
            onClick={nextCard}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold text-sm shadow-neon-amber flex items-center gap-2 transition-all active:scale-95 animate-scale-in"
          >
            <span>Next Take</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};

