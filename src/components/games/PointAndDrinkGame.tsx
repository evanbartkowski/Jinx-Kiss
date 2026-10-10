import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { useGameSettings } from '../../context/GameSettingsContext';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { ArrowRight, Crosshair, Users, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PointAndDrinkGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const PointAndDrinkGame: React.FC<PointAndDrinkGameProps> = ({ prompts, players }) => {
  const { selectedCategory, isNonAlcoholic } = useGameSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [tallies, setTallies] = useState<Record<string, number>>({});
  const [isRevealed, setIsRevealed] = useState(false);
  const [activePrompt, setActivePrompt] = useState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init-pad',
      gameId: 'point-and-drink',
      category: 'medium',
      text: 'Point and Drink...',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'point-and-drink', 0.02, initial.playMode);
  });

  const isLegendary = isPromptLegendary(activePrompt);

  useEffect(() => {
    if (isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt.id]);

  const activePlayers = players;
  const hasPlayers = activePlayers.length >= 2;
  const isKids = selectedCategory === 'kids';

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(3);
    setIsRevealed(false);
    setTallies({});

    let count = 3;
    soundEffects.playTick();
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        soundEffects.playTick();
        setCountdown(count);
      } else {
        clearInterval(interval);
        soundEffects.playSuccess();
        setCountdown(0);
        setIsCountingDown(false);
        setIsRevealed(true);
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#EC4899', '#A855F7'],
        });
      }
    }, 800);
  };

  const addVote = (player: string) => {
    soundEffects.playClick();
    setTallies(prev => ({
      ...prev,
      [player]: (prev[player] || 0) + 1,
    }));
  };

  const nextCard = () => {
    soundEffects.playCardFlip();
    setIsRevealed(false);
    setCountdown(null);
    setTallies({});
    const nextIdx = (currentIndex + 1) % prompts.length;
    setCurrentIndex(nextIdx);
    const nextP = prompts[nextIdx] || prompts[0];
    const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'point-and-drink', 0.02, nextP?.playMode);
    setActivePrompt(rolled);
  };

  // Find player with max votes
  const sortedWinners = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
  const leader = sortedWinners[0];

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      
      {/* Category header / Legendary Badge */}
      <div className="flex flex-col items-center gap-2">
        {isLegendary ? (
          <LegendaryCardBadge title={activePrompt.legendaryTitle || '★ LEGENDARY POINT ★'} size="lg" />
        ) : (
          <span className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-pink-950/60 border border-pink-500/50 text-pink-300 shadow-neon-pink/20">
            🎯 {isKids ? 'Point & Vote' : 'Point & Drink'} #{currentIndex + 1}
          </span>
        )}
      </div>

      {/* Main Prompt Card (Screen-Filling & Legendary-Aware) */}
      <div className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-5 sm:p-12 md:p-16 lg:p-20 rounded-2xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in transition-all duration-500 ${
        isLegendary
          ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
          : 'border-pink-500/40 shadow-neon-pink/30'
      }`}>
        
        {/* Glow ambient background */}
        <div
          className={`absolute inset-0 pointer-events-none blur-3xl ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'bg-gradient-to-b from-pink-600 to-transparent opacity-20'
          }`}
        />

        <span className="text-[11px] sm:text-sm uppercase tracking-widest text-zinc-400 font-semibold z-10">
          Who Is Most Likely To...
        </span>

        <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-snug my-5 sm:my-10 max-w-4xl z-10 ${
          isLegendary
            ? 'text-yellow-100 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]'
            : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
        }`}>
          "{activePrompt?.text}"
        </p>

        {/* Countdown Overlay or Winner Announcement */}
        {countdown !== null && countdown > 0 && (
          <div className="text-5xl sm:text-8xl font-black text-pink-400 animate-ping z-10 my-3 sm:my-4">
            {countdown}
          </div>
        )}

        {countdown === 0 && (
          hasPlayers && leader ? (
            <div className="animate-scale-in p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-pink-950/80 border border-pink-500/50 flex items-center gap-3 sm:gap-4 z-10 shadow-lg">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
              <div className="text-left">
                <span className="text-[11px] sm:text-xs font-bold text-pink-300 uppercase tracking-wider block">Most Fingers Pointed At:</span>
                <span className="text-lg sm:text-2xl font-black text-white">{leader[0]} ({leader[1]} votes)</span>
              </div>
            </div>
          ) : (
            <div className="animate-scale-in p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-pink-950/80 border border-pink-500/50 text-center z-10 shadow-lg">
              <span className="text-xl sm:text-2xl font-black text-white block mb-1">👉 POINT AT SOMEONE!</span>
              <span className="text-xs sm:text-sm text-pink-300 font-semibold">Whoever has the most fingers pointed at them takes a penalty!</span>
            </div>
          )
        )}

        {currentIndex === 0 && (
          <div className="text-xs sm:text-base text-zinc-300 font-semibold my-2 z-10">
            {countdown === null
              ? activePrompt?.playMode === 'online'
                ? 'Tap Start, then on "POINT!" aim at their webcam tile or type their name!'
                : 'Tap Start, then on "POINT!" point your finger at someone!'
              : hasPlayers
                ? 'Tap player below to record finger points!'
                : activePrompt?.playMode === 'online'
                  ? 'Count the webcam points or chat votes!'
                  : 'Look around the room and count the fingers!'}
          </div>
        )}

        {/* Card Rating & Report Bar */}
        <div className="w-full max-w-md z-10">
          <CardRatingBar prompt={activePrompt} />
        </div>

      </div>

      {/* Countdown Trigger Button */}
      {countdown === null && (
        <button
          onClick={startCountdown}
          className="w-full sm:w-auto px-8 sm:px-14 py-3.5 sm:py-5 rounded-xl sm:rounded-3xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-lg shadow-neon-pink flex items-center justify-center gap-2.5 sm:gap-3 transition-all active:scale-95 cursor-pointer"
        >
          <Crosshair className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Start 3-Second Countdown!</span>
        </button>
      )}

      {/* Voting Tally Buttons for Players (if players exist) or Next Prompt */}
      {isRevealed && (
        <div className="w-full flex flex-col items-center gap-4 sm:gap-5 animate-fade-in">
          {hasPlayers && (
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl">
              {activePlayers.map((player) => (
                <button
                  key={player}
                  onClick={() => addVote(player)}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-3xl glass-panel border border-white/10 hover:border-pink-500/60 hover:shadow-neon-pink/30 flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer bg-white/[0.03]"
                >
                  <span className="text-sm sm:text-base font-bold text-white truncate max-w-full">{player}</span>
                  <span className="text-xs sm:text-sm font-black text-pink-400">
                    {tallies[player] || 0} votes
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={nextCard}
            className="w-full sm:w-auto px-8 sm:px-14 py-3.5 sm:py-5 rounded-xl sm:rounded-3xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-lg shadow-neon-pink flex items-center justify-center gap-2.5 sm:gap-3 transition-all active:scale-95 mt-1 sm:mt-2 cursor-pointer"
          >
            <span>Next Prompt</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
};

