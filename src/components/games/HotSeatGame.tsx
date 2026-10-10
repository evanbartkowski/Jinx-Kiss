import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { ArrowRight, Flame, Clock, Play, Pause, RotateCw, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/audio';

interface HotSeatGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const HotSeatGame: React.FC<HotSeatGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [seenPromptIds, setSeenPromptIds] = useState<Set<string>>(new Set());
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionsAnsweredInSeat, setQuestionsAnsweredInSeat] = useState(0);

  const activePlayer = players.length > 0 ? players[playerIndex % players.length] : null;

  // Next Question in the Hot Seat
  const nextQuestion = () => {
    setIsTimerRunning(false);
    setTimerSeconds(30);

    const unseen = prompts.filter(p => !seenPromptIds.has(p.id));
    let pool = unseen;
    let newSeen = new Set(seenPromptIds);

    if (pool.length === 0) {
      newSeen.clear();
      pool = prompts;
    }

    const nextIdx = Math.floor(Math.random() * pool.length);
    const chosen = pool[nextIdx] || prompts[0];

    newSeen.add(chosen.id);
    setSeenPromptIds(newSeen);
    setCurrentIndex(prompts.findIndex(p => p.id === chosen.id));
    setQuestionsAnsweredInSeat(prev => prev + 1);

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#F43F5E', '#FB7185', '#FDA4AF'],
    });
  };

  // Rotate Hot Seat to Next Player
  const rotatePlayer = () => {
    soundEffects.playClick();
    if (players.length > 0) {
      setPlayerIndex(prev => (prev + 1) % players.length);
    }
    setQuestionsAnsweredInSeat(0);
    nextQuestion();
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (!isTimerRunning) return;

    if (timerSeconds <= 0) {
      soundEffects.playBuzzer();
      setIsTimerRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const currentPrompt = prompts[currentIndex] || prompts[0];

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6 animate-fade-in select-none">
      {/* Hot Seat Header */}
      <div className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-rose-950/80 border border-rose-500/50 text-rose-300 shadow-neon-pink/30">
        <Flame className="w-4 h-4 text-rose-400 fill-rose-400/40" />
        <span>In The Hot Seat</span>
      </div>

      {/* Spotlight Player Banner */}
      {activePlayer ? (
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold block mb-1">
            Now Under Interrogation ({questionsAnsweredInSeat} answered)
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-2">
            <span className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
              {activePlayer}
            </span>
          </h2>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold block mb-1">
            Voluntary Hot Seat
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-rose-400">
            One Player In The Hot Seat
          </h2>
        </div>
      )}

      {/* 30-Second Pressure Timer */}
      <div className="w-full max-w-md flex flex-col items-center gap-2">
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
          <div
            className={`h-full transition-all duration-1000 ${
              timerSeconds <= 5
                ? 'bg-rose-600 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500'
            }`}
            style={{ width: `${(timerSeconds / 30) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs font-bold text-zinc-400 px-1">
          <span className="flex items-center gap-1.5 font-mono text-sm text-white">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            {timerSeconds}s
          </span>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-zinc-300 text-xs font-semibold cursor-pointer transition-all active:scale-95"
          >
            {isTimerRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isTimerRunning ? 'Pause Clock' : 'Start 30s Clock'}</span>
          </button>
        </div>
      </div>

      {/* Main Hot Seat Question Card */}
      <div className="w-full min-h-[340px] p-8 sm:p-14 rounded-3xl glass-panel border border-rose-500/40 shadow-[0_15px_45px_-12px_rgba(244,63,94,0.35)] flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300">
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-3xl opacity-15 blur-2xl pointer-events-none bg-rose-600" />

        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          Answer without hesitation or take a forfeit drink
        </span>

        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-relaxed my-6 max-w-2xl">
          "{currentPrompt?.text}"
        </p>

        <div className="text-xs text-zinc-400 font-medium italic my-2">
          If {activePlayer || 'the player in the seat'} refuses or hesitates, they drink!
        </div>

        {/* Card Rating & Report Bar */}
        <div className="w-full">
          <CardRatingBar prompt={currentPrompt} />
        </div>

        {/* Action Controls */}
        <div className="w-full pt-6 mt-4 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
          {players.length > 1 && (
            <button
              onClick={rotatePlayer}
              className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-purple-400" />
              <span>Rotate Next Player</span>
            </button>
          )}

          <button
            onClick={nextQuestion}
            className="ml-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next Grilling Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

