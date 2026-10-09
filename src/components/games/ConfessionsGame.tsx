import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { EyeOff, Send, HelpCircle, Users, ArrowRight, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfessionsGameProps {
  prompts: PromptItem[];
  players?: string[];
}

interface SubmittedConfession {
  id: string;
  text: string;
  authorName?: string;
  votes: Record<string, number>;
}

export const ConfessionsGame: React.FC<ConfessionsGameProps> = ({ prompts, players }) => {
  const activePlayers = players && players.length >= 2 ? players : ['Sam', 'Alex', 'Jordan', 'Taylor'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [anonymousSubmissions, setAnonymousSubmissions] = useState<SubmittedConfession[]>([]);
  const [inputConfession, setInputConfession] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [activeRevealedIdx, setActiveRevealedIdx] = useState(0);
  const [isAuthorRevealed, setIsAuthorRevealed] = useState(false);
  const [mode, setMode] = useState<'submit' | 'play'>('submit');

  const currentPrompt = prompts[currentIndex] || prompts[0];

  const handleAddSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputConfession.trim()) return;

    soundEffects.playClick();
    const newConfession: SubmittedConfession = {
      id: `conf-${Date.now()}-${Math.random()}`,
      text: inputConfession.trim(),
      authorName: selectedAuthor || 'Anonymous Secret',
      votes: {},
    };

    setAnonymousSubmissions(prev => [...prev, newConfession]);
    setInputConfession('');
    setSelectedAuthor('');
  };

  const handleStartReview = () => {
    soundEffects.playMystery();
    setMode('play');
    setActiveRevealedIdx(0);
    setIsAuthorRevealed(false);
  };

  const handleVoteGuessedAuthor = (guessedPlayer: string) => {
    soundEffects.playClick();
    setAnonymousSubmissions(prev => {
      const copy = [...prev];
      const active = copy[activeRevealedIdx];
      if (active) {
        active.votes[guessedPlayer] = (active.votes[guessedPlayer] || 0) + 1;
      }
      return copy;
    });
  };

  const handleRevealAuthor = () => {
    soundEffects.playSuccess();
    setIsAuthorRevealed(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#C084FC', '#A855F7'],
    });
  };

  const handleNextConfession = () => {
    soundEffects.playClick();
    setIsAuthorRevealed(false);
    if (activeRevealedIdx + 1 < anonymousSubmissions.length) {
      setActiveRevealedIdx(prev => prev + 1);
    } else {
      // Loop or advance prompt
      setCurrentIndex(prev => (prev + 1) % prompts.length);
      setMode('submit');
      setAnonymousSubmissions([]);
    }
  };

  const activeConfession = anonymousSubmissions[activeRevealedIdx];

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {/* Category Pill */}
      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-purple-950/60 border border-purple-500/50 text-purple-300 shadow-neon-violet/20 flex items-center gap-2">
        <EyeOff className="w-3.5 h-3.5" />
        <span>Confessions — Topic #{currentIndex + 1}</span>
      </span>

      {/* Main Topic Card */}
      <div className="w-full p-8 sm:p-10 rounded-3xl glass-panel border border-purple-500/40 shadow-neon-violet/30 flex flex-col items-center text-center animate-scale-in">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
          Group Confession Prompt
        </span>

        <p className="text-xl sm:text-2xl font-black text-white leading-relaxed mb-6 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {mode === 'submit' ? (
          <div className="w-full flex flex-col items-center">
            <p className="text-xs text-zinc-400 mb-4">
              Pass the phone to submit anonymous answers or drop your secrets below!
            </p>

            <form onSubmit={handleAddSubmission} className="w-full max-w-md flex flex-col gap-3">
              <textarea
                value={inputConfession}
                onChange={(e) => setInputConfession(e.target.value)}
                placeholder={currentPrompt?.confessionStarter || "Type your honest confession here..."}
                rows={3}
                className="w-full rounded-2xl bg-black/60 border border-white/10 p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400/60 resize-none"
              />

              <div className="flex gap-2">
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-400/60"
                >
                  <option value="">(Select your name secretly)</option>
                  {activePlayers.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={!inputConfession.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    inputConfession.trim()
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-neon-violet active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-between w-full max-w-md pt-4 border-t border-white/[0.08]">
              <span className="text-xs font-semibold text-purple-300">
                🔒 {anonymousSubmissions.length} secrets in vault
              </span>

              {anonymousSubmissions.length > 0 && (
                <button
                  onClick={handleStartReview}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-neon-violet active:scale-95"
                >
                  Read Anonymous Secrets!
                </button>
              )}
            </div>
          </div>
        ) : (
          /* PLAY / GUESSING PHASE */
          <div className="w-full flex flex-col items-center animate-fade-in">
            <span className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2">
              Secret #{activeRevealedIdx + 1} of {anonymousSubmissions.length}
            </span>

            <div className="w-full max-w-lg p-6 rounded-2xl bg-black/70 border border-purple-500/40 my-4 text-center">
              <p className="text-lg sm:text-xl font-bold text-zinc-100 italic">
                "{activeConfession?.text}"
              </p>
            </div>

            {/* Guessing Who Said It */}
            <div className="w-full max-w-md my-4">
              <span className="text-xs font-bold uppercase text-zinc-400 block mb-2">
                Who in the room confessed this?
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activePlayers.map(player => (
                  <button
                    key={player}
                    onClick={() => handleVoteGuessedAuthor(player)}
                    className="p-2.5 rounded-xl glass-panel border border-white/10 hover:border-purple-400/50 flex flex-col items-center text-xs active:scale-95"
                  >
                    <span className="font-semibold text-white truncate max-w-full">{player}</span>
                    <span className="text-[10px] text-purple-400 font-bold">
                      {activeConfession?.votes[player] || 0} votes
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reveal Author */}
            {isAuthorRevealed ? (
              <div className="animate-scale-in p-4 rounded-2xl bg-purple-950/80 border border-purple-500/60 my-2 text-center w-full max-w-md">
                <span className="text-xs uppercase tracking-widest text-purple-300 font-bold block mb-1">
                  Confessed By:
                </span>
                <span className="text-2xl font-black text-white">
                  {activeConfession?.authorName}
                </span>
              </div>
            ) : (
              <button
                onClick={handleRevealAuthor}
                className="mt-2 px-6 py-2.5 rounded-xl border border-purple-500/50 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 text-xs font-bold shadow-neon-violet transition-all active:scale-95"
              >
                Unmask The Author!
              </button>
            )}

            <button
              onClick={handleNextConfession}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-neon-violet flex items-center gap-2 transition-all active:scale-95"
            >
              <span>{activeRevealedIdx + 1 < anonymousSubmissions.length ? 'Next Secret' : 'Next Category Prompt'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Card Rating Bar */}
        {currentPrompt && (
          <div className="w-full mt-6">
            <CardRatingBar prompt={currentPrompt} />
          </div>
        )}
      </div>
    </div>
  );
};
