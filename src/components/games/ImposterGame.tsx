import React, { useState, useMemo } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { Eye, EyeOff, UserX, CheckCircle, ShieldAlert, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ImposterGameProps {
  prompts: PromptItem[];
  players: string[];
}

type Phase = 'setup' | 'pass-and-play' | 'discussion' | 'voting' | 'reveal';

export const ImposterGame: React.FC<ImposterGameProps> = ({ prompts, players }) => {
  const [playerCount, setPlayerCount] = useState(4);

  const activePlayers = useMemo(() => {
    if (players.length >= 3) return players;
    return Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`);
  }, [players, playerCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('setup');
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [imposterIdx, setImposterIdx] = useState(0);
  const [selectedAccused, setSelectedAccused] = useState<string | null>(null);

  const currentPrompt = prompts[currentIndex] || prompts[0];

  const startRound = () => {
    soundEffects.playClick();
    // Pick random imposter
    const chosen = Math.floor(Math.random() * activePlayers.length);
    setImposterIdx(chosen);
    setCurrentPlayerIdx(0);
    setIsSecretVisible(false);
    setSelectedAccused(null);
    setPhase('pass-and-play');
  };

  const handleNextPlayer = () => {
    soundEffects.playClick();
    setIsSecretVisible(false);
    if (currentPlayerIdx + 1 < activePlayers.length) {
      setCurrentPlayerIdx(prev => prev + 1);
    } else {
      // All players have seen their role
      setPhase('discussion');
      soundEffects.playMystery();
    }
  };

  const handleToggleReveal = () => {
    soundEffects.playClick();
    setIsSecretVisible(!isSecretVisible);
  };

  const handleStartVoting = () => {
    soundEffects.playClick();
    setPhase('voting');
  };

  const handleConfirmVote = (accusedPlayer: string) => {
    soundEffects.playClick();
    setSelectedAccused(accusedPlayer);
    setPhase('reveal');

    const realImposterName = activePlayers[imposterIdx];
    if (accusedPlayer === realImposterName) {
      soundEffects.playSuccess();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#059669'],
      });
    } else {
      soundEffects.playBuzzer();
    }
  };

  const handleNextRound = () => {
    soundEffects.playClick();
    setCurrentIndex(prev => (prev + 1) % prompts.length);
    setPhase('setup');
  };

  const realImposterName = activePlayers[imposterIdx];
  const isImposterCurrent = currentPlayerIdx === imposterIdx;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {/* Category Pill */}
      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 shadow-neon-green/20 flex items-center gap-2">
        <UserX className="w-3.5 h-3.5" />
        <span>Imposter — {currentPrompt?.text || 'Secret Word'}</span>
      </span>

      {/* SETUP PHASE */}
      {phase === 'setup' && (
        <div className="w-full p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-500/40 shadow-neon-green/30 flex flex-col items-center text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-neon-green/30">
            <UserX className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-3">
            Find the Imposter
          </h3>

          <p className="text-sm text-zinc-300 max-w-md mb-6 leading-relaxed">
            One of the <span className="font-bold text-emerald-400">{activePlayers.length} players</span> will be secretly assigned as the Imposter. Pass the phone around so everyone can privately peek at their role!
          </p>

          {players.length < 3 && (
            <div className="flex flex-col items-center gap-2 mb-6">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Select Number of Players in the Room:
              </span>
              <div className="flex items-center gap-1.5">
                {[3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPlayerCount(num)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                      playerCount === num
                        ? 'bg-emerald-500 text-black shadow-neon-green font-black scale-105'
                        : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-md">
            {activePlayers.map((p) => (
              <span key={p} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
                {p}
              </span>
            ))}
          </div>

          <button
            onClick={startRound}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-neon-green transition-all active:scale-95"
          >
            Start Pass-and-Play Round
          </button>
        </div>
      )}

      {/* PASS-AND-PLAY PEEK PHASE */}
      {phase === 'pass-and-play' && (
        <div className="w-full min-h-[340px] p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-500/40 shadow-neon-green/30 flex flex-col justify-between items-center text-center relative overflow-hidden animate-scale-in">
          <div className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            Player {currentPlayerIdx + 1} of {activePlayers.length}
          </div>

          <div className="my-4">
            <h4 className="text-xl sm:text-2xl font-black text-white mb-1">
              Pass to: <span className="text-emerald-400">{activePlayers[currentPlayerIdx]}</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Only {activePlayers[currentPlayerIdx]} should be looking at the screen!
            </p>
          </div>

          {/* Reveal Card Area */}
          <div className="w-full max-w-md p-6 rounded-2xl bg-black/60 border border-white/10 my-4 flex flex-col items-center">
            {isSecretVisible ? (
              <div className="animate-scale-in">
                {isImposterCurrent ? (
                  <div className="text-center">
                    <span className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center justify-center gap-1.5 mb-2">
                      <ShieldAlert className="w-4 h-4" />
                      YOU ARE THE IMPOSTER!
                    </span>
                    <p className="text-2xl font-black text-red-400 mb-2">IMPOSTER</p>
                    <p className="text-xs text-zinc-300 italic">
                      Category hint: {currentPrompt.imposterClue || 'Try to blend in with vague clues!'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider block mb-1">
                      Secret Word:
                    </span>
                    <p className="text-3xl font-black text-white mb-2">
                      {currentPrompt.secretWord || currentPrompt.text}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Give a subtle 1-word clue without revealing it!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm font-semibold text-zinc-400 mb-2">Tap below to reveal your secret role</p>
                <p className="text-xs text-zinc-500">Keep it shielded from other eyes!</p>
              </div>
            )}

            <button
              onClick={handleToggleReveal}
              className={`mt-4 px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSecretVisible
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
              }`}
            >
              {isSecretVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isSecretVisible ? 'Hide Secret' : 'Tap to Reveal Secret'}</span>
            </button>
          </div>

          <button
            onClick={handleNextPlayer}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-neon-green flex items-center gap-2 active:scale-95"
          >
            <span>{currentPlayerIdx + 1 < activePlayers.length ? 'Next Player' : 'Everyone Saw Role → Start Discussion'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DISCUSSION PHASE */}
      {phase === 'discussion' && (
        <div className="w-full p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-500/40 shadow-neon-green/30 flex flex-col items-center text-center animate-scale-in">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">
            Discussion Round
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Give Your Clues!
          </h3>

          <p className="text-sm text-zinc-300 max-w-lg mb-6 leading-relaxed">
            Go around the room clockwise. Each player gives <span className="font-bold text-white">one single word or short clue</span> about the secret word. Then argue and debate who seemed suspicious or hesitated!
          </p>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-medium mb-8">
            💡 Imposter tip: Pay close attention to what other people say and mimic their tone!
          </div>

          <button
            onClick={handleStartVoting}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-neon-green transition-all active:scale-95"
          >
            Done Debating → Vote Out The Imposter!
          </button>
        </div>
      )}

      {/* VOTING PHASE */}
      {phase === 'voting' && (
        <div className="w-full p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-500/40 shadow-neon-green/30 flex flex-col items-center text-center animate-scale-in">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">
            The Accusation
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Who Is The Imposter?
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Count to three and point fingers, or tap the player the group agreed on!
          </p>

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {activePlayers.map((player) => (
              <button
                key={player}
                onClick={() => handleConfirmVote(player)}
                className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/60 hover:shadow-neon-green/30 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <UserX className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-sm font-bold text-white truncate max-w-full">{player}</span>
                <span className="text-xs text-zinc-400">Accuse</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* REVEAL PHASE */}
      {phase === 'reveal' && (
        <div className="w-full p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-500/40 shadow-neon-green/30 flex flex-col items-center text-center animate-scale-in">
          {selectedAccused === realImposterName ? (
            <div className="animate-scale-in flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-neon-green">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">
                IMPOSTER CAUGHT!
              </h3>
              <p className="text-sm text-zinc-300 mb-2">
                The crew correctly identified <span className="font-bold text-emerald-400">{realImposterName}</span>!
              </p>
            </div>
          ) : (
            <div className="animate-scale-in flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 shadow-neon-red">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">
                IMPOSTER ESCAPED!
              </h3>
              <p className="text-sm text-zinc-300 mb-2">
                You accused <span className="font-bold text-zinc-200">{selectedAccused}</span>, but the real Imposter was <span className="font-bold text-red-400">{realImposterName}</span>!
              </p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 w-full max-w-md my-4 text-center">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">The Secret Word Was:</span>
            <span className="text-2xl font-black text-emerald-300">
              {currentPrompt.secretWord || currentPrompt.text}
            </span>
          </div>

          <button
            onClick={handleNextRound}
            className="mt-4 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-neon-green flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Play Another Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rating Bar */}
      {currentPrompt && (
        <div className="w-full">
          <CardRatingBar prompt={currentPrompt} />
        </div>
      )}
    </div>
  );
};

