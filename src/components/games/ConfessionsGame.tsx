import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
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
  const activePlayers = players && players.length >= 2 ? players : [];
  const hasPlayers = activePlayers.length >= 2;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePrompt, setActivePrompt] = useState<PromptItem>(() => {
    const first = prompts[0] || { id: 'cf-default', gameId: 'confessions', category: 'medium', text: 'Share a secret nobody in this room knows about you.' };
    return rollForLegendaryCard(first, first.category, 'confessions');
  });
  const [anonymousSubmissions, setAnonymousSubmissions] = useState<SubmittedConfession[]>([]);
  const [inputConfession, setInputConfession] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [activeRevealedIdx, setActiveRevealedIdx] = useState(0);
  const [isAuthorRevealed, setIsAuthorRevealed] = useState(false);
  const [mode, setMode] = useState<'submit' | 'play'>('submit');

  const isLegendary = isPromptLegendary(activePrompt);

  useEffect(() => {
    if (prompts.length > 0) {
      const p = prompts[currentIndex] || prompts[0];
      setActivePrompt(rollForLegendaryCard(p, p.category, 'confessions'));
    }
  }, [currentIndex, prompts]);

  useEffect(() => {
    if (activePrompt && isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt?.id, isLegendary]);

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
      const nextIdx = (currentIndex + 1) % prompts.length;
      const nextP = prompts[nextIdx] || prompts[0];
      setActivePrompt(rollForLegendaryCard(nextP, nextP.category, 'confessions'));
      setCurrentIndex(nextIdx);
      setMode('submit');
      setAnonymousSubmissions([]);
    }
  };

  const activeConfession = anonymousSubmissions[activeRevealedIdx];

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      {/* Category Pill */}
      <span className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-purple-950/60 border border-purple-500/50 text-purple-300 shadow-neon-violet/20 flex items-center gap-2">
        <EyeOff className="w-4 h-4" />
        <span>Confessions — Topic #{currentIndex + 1}</span>
      </span>

      {/* Main Topic Card */}
      <div
        className={`w-full min-h-[340px] sm:min-h-[480px] md:min-h-[560px] p-5 sm:p-12 md:p-16 lg:p-20 rounded-2xl sm:rounded-3xl flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 animate-scale-in ${
          isLegendary
            ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
            : 'glass-panel border border-purple-500/40 shadow-neon-violet/30'
        }`}
      >
        {/* Ambient Halo */}
        <div
          className={`absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'bg-purple-600/15 blur-2xl'
          }`}
        />

        {/* Legendary Badge */}
        {isLegendary && (
          <div className="mb-3 sm:mb-4">
            <LegendaryCardBadge title={activePrompt?.legendaryTitle} />
          </div>
        )}

        <span className="text-[11px] sm:text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-1.5 sm:mb-2">
          Group Confession Prompt
        </span>

        <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 sm:mb-8 max-w-4xl tracking-tight">
          "{activePrompt?.text}"
        </p>

        {mode === 'submit' ? (
          <div className="w-full flex flex-col items-center">
            {currentIndex === 0 && (
              <p className="text-xs sm:text-sm text-zinc-300 mb-4 sm:mb-6 max-w-lg">
                Pass the phone to submit anonymous answers or drop your secrets below!
              </p>
            )}

            <form onSubmit={handleAddSubmission} className="w-full max-w-xl flex flex-col gap-3 sm:gap-4">
              <textarea
                value={inputConfession}
                onChange={(e) => setInputConfession(e.target.value)}
                placeholder={activePrompt?.confessionStarter || "Type your honest confession here..."}
                rows={3}
                className="w-full rounded-xl sm:rounded-2xl bg-black/60 border border-white/10 p-3 sm:p-4 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400/60 resize-none"
              />

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                {hasPlayers && (
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full sm:flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-300 focus:outline-none focus:border-purple-400/60"
                  >
                    <option value="">(Select your name)</option>
                    {activePlayers.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                )}

                <button
                  type="submit"
                  disabled={!inputConfession.trim()}
                  className={`w-full sm:flex-1 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
                    inputConfession.trim()
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-neon-violet active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Deposit Secret</span>
                </button>
              </div>
            </form>

            <div className="mt-5 sm:mt-8 flex items-center justify-between w-full max-w-xl pt-3 sm:pt-4 border-t border-white/[0.08]">
              <span className="text-xs sm:text-sm font-semibold text-purple-300">
                🔒 {anonymousSubmissions.length} secrets in vault
              </span>

              {anonymousSubmissions.length > 0 && (
                <button
                  onClick={handleStartReview}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-neon-violet active:scale-95 cursor-pointer"
                >
                  Read Anonymous Secrets!
                </button>
              )}
            </div>
          </div>
        ) : (
          /* PLAY / GUESSING PHASE */
          <div className="w-full flex flex-col items-center animate-fade-in">
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-purple-400 font-bold mb-1.5 sm:mb-2">
              Secret #{activeRevealedIdx + 1} of {anonymousSubmissions.length}
            </span>

            <div className="w-full max-w-2xl p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-black/70 border border-purple-500/40 my-3 sm:my-4 text-center">
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-zinc-100 italic">
                "{activeConfession?.text}"
              </p>
            </div>

            {/* Guessing Who Said It */}
            {hasPlayers ? (
              <div className="w-full max-w-xl my-3 sm:my-4">
                <span className="text-[11px] sm:text-xs font-bold uppercase text-zinc-400 block mb-2">
                  Who in the room confessed this?
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activePlayers.map(player => (
                    <button
                      key={player}
                      onClick={() => handleVoteGuessedAuthor(player)}
                      className="p-2.5 sm:p-3 rounded-xl glass-panel border border-white/10 hover:border-purple-400/50 flex flex-col items-center text-xs sm:text-sm active:scale-95"
                    >
                      <span className="font-semibold text-white truncate max-w-full">{player}</span>
                      <span className="text-[11px] sm:text-xs text-purple-400 font-bold">
                        {activeConfession?.votes[player] || 0} votes
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-zinc-400 my-2">
                Discuss as a group and guess who in the room wrote this confession!
              </div>
            )}

            {/* Reveal Author */}
            {hasPlayers && (
              isAuthorRevealed ? (
                <div className="animate-scale-in p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-purple-950/80 border border-purple-500/60 my-2 text-center w-full max-w-md">
                  <span className="text-[11px] sm:text-xs uppercase tracking-widest text-purple-300 font-bold block mb-1">
                    Confessed By:
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {activeConfession?.authorName}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleRevealAuthor}
                  className="mt-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl border border-purple-500/50 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 text-xs font-bold shadow-neon-violet transition-all active:scale-95 cursor-pointer"
                >
                  Unmask The Author!
                </button>
              )
            )}

            <button
              onClick={handleNextConfession}
              className="mt-4 sm:mt-6 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-neon-violet flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>{activeRevealedIdx + 1 < anonymousSubmissions.length ? 'Next Secret' : 'Next Category Prompt'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Card Rating Bar */}
        {activePrompt && (
          <div className="w-full mt-6">
            <CardRatingBar prompt={activePrompt} />
          </div>
        )}
      </div>
    </div>
  );
};

