import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { useGameSettings } from '../../context/GameSettingsContext';
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

  const activePlayers = players.length >= 2 ? players : ['Sam', 'Alex', 'Jordan', 'Taylor'];
  const currentPrompt = prompts[currentIndex] || prompts[0];
  const isKids = selectedCategory === 'kids';

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(3);
    setIsRevealed(false);
    setTallies({});

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
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
    setTallies(prev => ({
      ...prev,
      [player]: (prev[player] || 0) + 1,
    }));
  };

  const nextCard = () => {
    setIsRevealed(false);
    setCountdown(null);
    setTallies({});
    setCurrentIndex(prev => (prev + 1) % prompts.length);
  };

  // Find player with max votes
  const sortedWinners = Object.entries(tallies).sort((a, b) => b[1] - a[1]);
  const leader = sortedWinners[0];

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      
      {/* Category header */}
      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-pink-950/60 border border-pink-500/50 text-pink-300 shadow-neon-pink/20">
        🎯 {isKids ? 'Point & Vote' : 'Point & Drink'} #{currentIndex + 1}
      </span>

      {/* Main Prompt Card */}
      <div className="w-full min-h-[280px] p-8 sm:p-12 rounded-3xl glass-panel border border-pink-500/40 shadow-neon-pink/30 flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in">
        
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          Who Is Most Likely To...
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed my-6 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {/* Countdown Overlay or Winner Announcement */}
        {countdown !== null && countdown > 0 && (
          <div className="text-6xl font-black text-pink-400 animate-ping">
            {countdown}
          </div>
        )}

        {countdown === 0 && leader && (
          <div className="animate-scale-in p-4 rounded-2xl bg-pink-950/60 border border-pink-500/40 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-pink-400" />
            <div className="text-left">
              <span className="text-xs font-bold text-pink-300 uppercase tracking-wider block">Most Fingers Pointed At:</span>
              <span className="text-lg font-black text-white">{leader[0]} ({leader[1]} points)</span>
            </div>
          </div>
        )}

        <div className="text-xs text-zinc-400 font-medium">
          {countdown === null ? 'Tap Start, then on "POINT!" point your finger at someone!' : 'Tap player below to record finger points!'}
        </div>

      </div>

      {/* Countdown Trigger Button */}
      {countdown === null && (
        <button
          onClick={startCountdown}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95"
        >
          <Crosshair className="w-5 h-5" />
          <span>Start 3-Second Countdown!</span>
        </button>
      )}

      {/* Voting Tally Buttons for Players */}
      {isRevealed && (
        <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activePlayers.map((player) => (
              <button
                key={player}
                onClick={() => addVote(player)}
                className="p-3 rounded-2xl glass-panel border border-white/10 hover:border-pink-500/60 hover:shadow-neon-pink/30 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <span className="text-sm font-bold text-white truncate max-w-full">{player}</span>
                <span className="text-xs font-black text-pink-400">
                  {tallies[player] || 0} votes
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={nextCard}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95 mt-2"
          >
            <span>Next Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

