import { RemovedPrompt } from '../common/RemovedPrompt';
import { useLivePromptState } from '../../hooks/useLivePrompt';
import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { useGameSettings } from '../../context/GameSettingsContext';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
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
  const [activePrompt, setActivePrompt] = useLivePromptState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init-mlt',
      gameId: 'most-likely-to',
      category: 'medium',
      text: 'Most likely to...',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'most-likely-to', 0.02, initial.playMode);
  });

  const isLegendary = isPromptLegendary(activePrompt);

  useEffect(() => {
    if (isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt?.id]);

  const hasPlayers = players.length >= 2;
  const activePlayers = players;

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
    soundEffects.playCardFlip();
    setIsRevealed(false);
    setVotes({});
    const nextIdx = (currentIndex + 1) % prompts.length;
    setCurrentIndex(nextIdx);
    const nextP = prompts[nextIdx] || prompts[0];
    const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'most-likely-to', 0.02, nextP?.playMode);
    setActivePrompt(rolled);
  };

  const handleResetVotes = () => {
    soundEffects.playClick();
    setVotes({});
    setIsRevealed(false);
  };

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);
  const sortedLeaderboard = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const leader = sortedLeaderboard[0];

  if (!activePrompt) return <RemovedPrompt onNext={handleNext} />;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      {/* Category Pill / Legendary Badge */}
      <div className="flex flex-col items-center gap-2">
        {isLegendary ? (
          <LegendaryCardBadge title={activePrompt.legendaryTitle || '★ LEGENDARY CONSENSUS ★'} size="lg" />
        ) : (
          <span className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-rose-950/60 border border-rose-500/50 text-rose-300 shadow-neon-pink/20 flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Most Likely To — Card #{currentIndex + 1}</span>
          </span>
        )}
      </div>

      {/* Main Prompt Card (Screen-Filling & Legendary-Aware) */}
      <div className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-5 sm:p-12 md:p-16 lg:p-20 rounded-2xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in transition-all duration-500 ${
        isLegendary
          ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
          : 'border-rose-500/40 shadow-neon-pink/30'
      }`}>
        {/* Glow ambient background */}
        <div
          className={`absolute inset-0 pointer-events-none blur-3xl ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'bg-gradient-to-b from-rose-600 to-transparent opacity-20'
          }`}
        />

        <span className="text-[11px] sm:text-sm uppercase tracking-widest text-zinc-400 font-semibold z-10">
          {activePrompt?.playMode === 'online' ? 'Who In This Call Is...' : 'Who In The Room Is...'}
        </span>

        <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-snug my-5 sm:my-10 max-w-4xl z-10 ${
          isLegendary
            ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
            : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]'
        }`}>
          "{activePrompt?.text}"
        </p>

        {/* Winner Reveal Card */}
        {isRevealed && leader && leader[1] > 0 && (
          <div className="animate-scale-in p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center gap-3 sm:gap-4 my-2 w-full max-w-md z-10 shadow-lg">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-rose-300 uppercase tracking-wider block">Consensus Winner:</span>
              <span className="text-lg sm:text-2xl font-black text-white truncate block">{leader[0]}</span>
              <span className="text-xs sm:text-sm text-rose-400 font-bold">{leader[1]} votes ({Math.round((leader[1] / totalVotes) * 100)}%)</span>
            </div>
          </div>
        )}

        {((currentIndex === 0 && (!hasPlayers || totalVotes === 0)) || (hasPlayers && totalVotes > 0)) && (
          <div className="text-xs sm:text-base text-zinc-300 font-semibold my-2 z-10">
            {hasPlayers && totalVotes > 0
              ? `${totalVotes} votes cast so far`
              : hasPlayers
                ? 'Tap any player below to cast fingers or votes!'
                : activePrompt?.playMode === 'online'
                  ? 'Vote on screen or call out who in the call fits this prompt!'
                  : 'Point or call out who in the room fits this prompt!'}
          </div>
        )}

        {/* Card Rating Bar */}
        <div className="w-full max-w-md z-10">
          <CardRatingBar prompt={activePrompt} />
        </div>
      </div>

      {/* Controls and Player Voting Chips */}
      <div className="w-full flex flex-col items-center gap-4 sm:gap-5 animate-fade-in">
        {hasPlayers && (
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl">
            {activePlayers.map((player) => {
              const count = votes[player] || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              return (
                <button
                  key={player}
                  onClick={() => handleCastVote(player)}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-3xl glass-panel border border-white/10 hover:border-rose-500/60 hover:shadow-neon-pink/30 flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer bg-white/[0.03]"
                >
                  <span className="text-sm sm:text-base font-bold text-white truncate max-w-full">{player}</span>
                  <span className="text-xs sm:text-sm font-black text-rose-400">
                    {count} {count === 1 ? 'vote' : 'votes'} {totalVotes > 0 && `(${pct}%)`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full mt-1 sm:mt-2">
          {hasPlayers && totalVotes > 0 && !isRevealed && (
            <button
              onClick={handleReveal}
              className="flex-1 sm:flex-initial px-6 sm:px-12 py-3.5 sm:py-5 rounded-xl sm:rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-lg shadow-neon-pink transition-all active:scale-95 cursor-pointer"
            >
              Reveal Winner!
            </button>
          )}

          {hasPlayers && totalVotes > 0 && (
            <button
              onClick={handleResetVotes}
              className="px-5 sm:px-6 py-3.5 sm:py-5 rounded-xl sm:rounded-3xl border border-white/15 text-zinc-300 hover:text-white font-bold text-xs sm:text-base transition-colors flex items-center gap-2 cursor-pointer bg-zinc-900/60"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Votes</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 sm:px-14 py-3.5 sm:py-5 rounded-xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-sm sm:text-lg shadow-neon-pink flex items-center justify-center gap-2.5 sm:gap-3 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next Card</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

