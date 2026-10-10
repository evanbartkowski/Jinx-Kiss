import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { ArrowRight, Flame, Clock, Play, Pause, RotateCw, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';

interface HotSeatGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const HotSeatGame: React.FC<HotSeatGameProps> = ({ prompts, players }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePrompt, setActivePrompt] = useState<PromptItem>(() => {
    const first = prompts[0] || { id: 'hs-default', gameId: 'hot-seat', category: 'medium', text: 'Confess the most questionable thing currently in your search history.' };
    return rollForLegendaryCard(first, first.category, 'hot-seat');
  });
  const [playerIndex, setPlayerIndex] = useState(0);
  const [seenPromptIds, setSeenPromptIds] = useState<Set<string>>(new Set());
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionsAnsweredInSeat, setQuestionsAnsweredInSeat] = useState(0);

  const activePlayer = players.length > 0 ? players[playerIndex % players.length] : null;
  const isLegendary = isPromptLegendary(activePrompt);

  useEffect(() => {
    if (activePrompt && isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt?.id, isLegendary]);

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
    const rolled = rollForLegendaryCard(chosen, chosen.category, 'hot-seat');
    setActivePrompt(rolled);
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

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
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
      <div
        className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-5 sm:p-12 md:p-16 lg:p-20 rounded-2xl sm:rounded-3xl flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 ${
          isLegendary
            ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
            : 'glass-panel border border-rose-500/40 shadow-[0_15px_45px_-12px_rgba(244,63,94,0.35)]'
        }`}
      >
        {/* Ambient Glow */}
        <div
          className={`absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'opacity-15 blur-2xl bg-rose-600'
          }`}
        />

        {/* Legendary Badge */}
        {isLegendary && (
          <div className="mb-3 sm:mb-4">
            <LegendaryCardBadge title={activePrompt?.legendaryTitle} />
          </div>
        )}

        <span className="text-[11px] sm:text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          Answer without hesitation or take a forfeit drink
        </span>

        <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight my-5 sm:my-8 max-w-4xl tracking-tight">
          "{activePrompt?.text}"
        </p>

        <div className="text-xs sm:text-sm text-zinc-400 font-medium italic my-2">
          If {activePlayer || 'the player in the seat'} refuses or hesitates, they drink!
        </div>

        {/* Card Rating & Report Bar */}
        <div className="w-full">
          <CardRatingBar prompt={activePrompt} />
        </div>

        {/* Action Controls */}
        <div className="w-full pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          {players.length > 1 && (
            <button
              onClick={rotatePlayer}
              className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span>Rotate Next Player</span>
            </button>
          )}

          <button
            onClick={nextQuestion}
            className="w-full sm:w-auto sm:ml-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs sm:text-base shadow-neon-pink flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next Grilling Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

