import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { useGameSettings } from '../../context/GameSettingsContext';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { ArrowRight, Users, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MostLikelyToGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const MostLikelyToGame: React.FC<MostLikelyToGameProps> = ({ prompts, players }) => {
  const { selectedCategory } = useGameSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isRevealed, setIsRevealed] = useState(false);

  const activePlayers = players.length >= 2 ? players : ['Sam', 'Alex', 'Jordan', 'Taylor'];
  const currentPrompt = prompts[currentIndex] || prompts[0];

  const handleCastVote = (player: string) => {
    soundEffects.playClick();
    setVotes(prev => ({
      ...prev,
      [player]: (prev[player] || 0) + 1,
    }));
  };

  const handleReveal = () => {
    setIsRevealed(true);
    soundEffects.playSuccess();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#A855F7', '#EC4899'],
    });
  };

  const handleNext = () => {
    soundEffects.playClick();
    setIsRevealed(false);
    setVotes({});
    setCurrentIndex(prev => (prev + 1) % prompts.length);
  };

  const handleResetVotes = () => {
    soundEffects.playClick();
    setVotes({});
    setIsRevealed(false);
  };

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);
  const sortedLeaderboard = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const leader = sortedLeaderboard[0];

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {/* Category Pill */}
      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-rose-950/60 border border-rose-500/50 text-rose-300 shadow-neon-pink/20 flex items-center gap-2">
        <Users className="w-3.5 h-3.5" />
        <span>Most Likely To — Card #{currentIndex + 1}</span>
      </span>

      {/* Main Prompt Card */}
      <div className="w-full min-h-[300px] p-8 sm:p-12 rounded-3xl glass-panel border border-rose-500/40 shadow-neon-pink/30 flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          Who In The Room Is...
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-relaxed my-6 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {/* Winner Reveal Card */}
        {isRevealed && leader && leader[1] > 0 && (
          <div className="animate-scale-in p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-3 my-2 w-full max-w-md">
            <Trophy className="w-8 h-8 text-rose-400 shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">Consensus Winner:</span>
              <span className="text-lg font-black text-white truncate block">{leader[0]}</span>
              <span className="text-xs text-rose-400 font-bold">{leader[1]} votes ({Math.round((leader[1] / totalVotes) * 100)}%)</span>
            </div>
          </div>
        )}

        <div className="text-xs text-zinc-400 font-medium">
          {totalVotes === 0
            ? 'Tap any player below to cast fingers or votes!'
            : `${totalVotes} votes cast so far`}
        </div>

        {/* Card Rating Bar */}
        {currentPrompt && (
          <div className="w-full mt-4">
            <CardRatingBar prompt={currentPrompt} />
          </div>
        )}
      </div>

      {/* Player Voting Chips */}
      <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activePlayers.map((player) => {
            const count = votes[player] || 0;
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <button
                key={player}
                onClick={() => handleCastVote(player)}
                className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-rose-500/60 hover:shadow-neon-pink/30 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span className="text-sm font-bold text-white truncate max-w-full">{player}</span>
                <span className="text-xs font-black text-rose-400">
                  {count} {count === 1 ? 'vote' : 'votes'} {totalVotes > 0 && `(${pct}%)`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {totalVotes > 0 && !isRevealed && (
            <button
              onClick={handleReveal}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-neon-pink transition-all active:scale-95"
            >
              Reveal Winner!
            </button>
          )}

          {totalVotes > 0 && (
            <button
              onClick={handleResetVotes}
              className="px-4 py-3 rounded-2xl border border-white/10 text-zinc-400 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Votes
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Next Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
