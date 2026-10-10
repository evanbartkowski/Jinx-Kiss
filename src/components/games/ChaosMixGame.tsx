import React, { useState, useEffect } from 'react';
import { PromptItem, GameId } from '../../types/game';
import { GAMES_CONFIG } from '../../data/gamesConfig';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import {
  Shuffle,
  ArrowRight,
  Flame,
  Sparkles,
  SplitSquareVertical,
  Zap,
  Disc3,
  Flag,
  Wine,
  Crosshair,
  Users,
  UserX,
  HelpCircle,
  EyeOff,
  RotateCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChaosMixGameProps {
  prompts: PromptItem[];
  players: string[];
}

export const ChaosMixGame: React.FC<ChaosMixGameProps> = ({ prompts, players }) => {
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem | null>(null);
  const [seenPromptIds, setSeenPromptIds] = useState<Set<string>>(new Set());
  const [playerIndex, setPlayerIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);

  const activePlayer = players.length > 0 ? players[playerIndex % players.length] : null;

  // Pick next random prompt without repeats until pool is exhausted
  const nextCard = () => {
    setSelectedChoice(null);

    const unseen = prompts.filter(p => !seenPromptIds.has(p.id));
    let pool = unseen;
    let newSeen = new Set(seenPromptIds);

    if (pool.length === 0) {
      // Library exhausted, reset pool
      newSeen.clear();
      pool = prompts;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex] || prompts[0];

    newSeen.add(chosen.id);
    setSeenPromptIds(newSeen);
    const rolled = rollForLegendaryCard(chosen, chosen.category, 'chaos-mix');
    setCurrentPrompt(rolled);
    setRoundNumber(prev => prev + 1);
    soundEffects.playCardFlip();

    if (players.length > 0) {
      setPlayerIndex(prev => (prev + 1) % players.length);
    }
  };

  useEffect(() => {
    if (prompts.length > 0 && !currentPrompt) {
      nextCard();
    }
  }, [prompts]);

  useEffect(() => {
    if (currentPrompt && isPromptLegendary(currentPrompt)) {
      triggerLegendaryCardEffects(currentPrompt);
    }
  }, [currentPrompt?.id, currentPrompt?.isLegendary]);

  const handleVote = (choice: string) => {
    setSelectedChoice(choice);
    soundEffects.playVoteSubmit();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D946EF', '#EC4899', '#06B6D4', '#A855F7'],
    });
  };

  if (!currentPrompt) {
    return <div className="text-zinc-400">Loading Chaos Mix...</div>;
  }

  const isLegendary = isPromptLegendary(currentPrompt);
  const originId = currentPrompt.originGameId || currentPrompt.gameId;
  const originMeta = GAMES_CONFIG[originId] || GAMES_CONFIG['truth-or-dare'];

  const getOriginIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4' };
    switch (iconName) {
      case 'Flame': return <Flame {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'SplitSquareVertical': return <SplitSquareVertical {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Disc3': return <Disc3 {...props} />;
      case 'Flag': return <Flag {...props} />;
      case 'Wine': return <Wine {...props} />;
      case 'Crosshair': return <Crosshair {...props} />;
      case 'Users': return <Users {...props} />;
      case 'UserX': return <UserX {...props} />;
      case 'HelpCircle': return <HelpCircle {...props} />;
      case 'EyeOff': return <EyeOff {...props} />;
      default: return <Shuffle {...props} />;
    }
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6 animate-fade-in select-none">
      {/* Top Origin Game Badge & Round Pill */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Origin Game Pill */}
        <div
          className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border shadow-lg transition-all"
          style={{
            color: originMeta.themeColor,
            backgroundColor: `${originMeta.themeColor}18`,
            borderColor: `${originMeta.themeColor}50`,
            boxShadow: `0 0 20px ${originMeta.themeColor}30`,
          }}
        >
          {getOriginIcon(originMeta.iconName)}
          <span>Game: {originMeta.title}</span>
        </div>

        {/* Chaos Mix Multicolored Badge */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-500/40 text-pink-300">
          <Shuffle className="w-4 h-4" />
          <span>Chaos Mix #{roundNumber}</span>
        </div>

        {/* Remaining Unseen Count */}
        <span className="text-xs font-bold text-zinc-500">
          ({prompts.length - seenPromptIds.size} unseen remaining)
        </span>
      </div>

      {/* Active Turn Banner (if players entered) */}
      {activePlayer && (
        <div className="text-center animate-fade-in">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold block mb-1">
            Spotlight Player
          </span>
          <h3
            className="text-2xl sm:text-4xl font-black uppercase tracking-wide"
            style={{ color: originMeta.themeColor }}
          >
            {activePlayer}'s Turn
          </h3>
        </div>
      )}

      {/* Main Multicolored Chaos Prompt Card */}
      <div
        className={`w-full min-h-[440px] sm:min-h-[560px] p-8 sm:p-14 lg:p-16 rounded-3xl flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 ${
          isLegendary
            ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
            : 'glass-panel border'
        }`}
        style={
          isLegendary
            ? undefined
            : {
                borderColor: `${originMeta.themeColor}50`,
                boxShadow: `0 15px 45px -12px ${originMeta.themeColor}35, 0 0 35px -10px rgba(217, 70, 239, 0.3)`,
              }
        }
      >
        {/* Ambient Halo */}
        <div
          className={`absolute inset-0 rounded-3xl pointer-events-none ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'opacity-15 blur-2xl'
          }`}
          style={isLegendary ? undefined : { backgroundColor: originMeta.themeColor }}
        />

        {/* Legendary Badge */}
        {isLegendary && (
          <div className="mb-4">
            <LegendaryCardBadge title={currentPrompt.legendaryTitle} />
          </div>
        )}

        {/* Prompt Header */}
        <div className="flex items-center gap-2">
          {currentPrompt.type && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                currentPrompt.type === 'truth'
                  ? 'bg-pink-950/60 border-pink-500/50 text-pink-300'
                  : 'bg-red-950/60 border-red-500/50 text-red-300'
              }`}
            >
              {currentPrompt.type}
            </span>
          )}
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            {originMeta.tagline}
          </span>
        </div>

        {/* Prompt Text */}
        <p className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight my-8 sm:my-10 max-w-4xl tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          "{currentPrompt.text}"
        </p>

        {/* Interactive Elements depending on originating game type */}
        <div className="w-full max-w-2xl">
          {/* Would You Rather Choices */}
          {currentPrompt.optionA && currentPrompt.optionB && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <button
                onClick={() => handleVote('A')}
                className={`p-5 sm:p-6 rounded-2xl border text-sm sm:text-base font-bold transition-all ${
                  selectedChoice === 'A'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-neon-cyan/40 scale-105'
                    : 'border-white/10 bg-black/40 text-zinc-200 hover:border-cyan-400/50'
                }`}
              >
                Option A: {currentPrompt.optionA}
              </button>
              <button
                onClick={() => handleVote('B')}
                className={`p-5 sm:p-6 rounded-2xl border text-sm sm:text-base font-bold transition-all ${
                  selectedChoice === 'B'
                    ? 'border-purple-400 bg-purple-950/60 text-purple-200 shadow-neon-violet/40 scale-105'
                    : 'border-white/10 bg-black/40 text-zinc-200 hover:border-purple-400/50'
                }`}
              >
                Option B: {currentPrompt.optionB}
              </button>
            </div>
          )}

          {/* Red Flag Green Flag Choices */}
          {originId === 'red-flag-green-flag' && (
            <div className="flex items-center justify-center gap-4 my-4 flex-wrap">
              <button
                onClick={() => handleVote('red')}
                className={`px-8 py-4 rounded-2xl border text-sm sm:text-base font-black uppercase tracking-wider transition-all ${
                  selectedChoice === 'red'
                    ? 'border-red-500 bg-red-950/60 text-red-300 shadow-neon-red/40 scale-105'
                    : 'border-white/10 bg-black/40 text-red-400 hover:border-red-500/50'
                }`}
              >
                🚩 Red Flag
              </button>
              <button
                onClick={() => handleVote('green')}
                className={`px-8 py-4 rounded-2xl border text-sm sm:text-base font-black uppercase tracking-wider transition-all ${
                  selectedChoice === 'green'
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-neon-green/40 scale-105'
                    : 'border-white/10 bg-black/40 text-emerald-400 hover:border-emerald-500/50'
                }`}
              >
                Green Flag 🟢
              </button>
            </div>
          )}

          {/* Forfeits / Drink Penalty */}
          {currentPrompt.forfeit && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs sm:text-sm text-amber-200 font-semibold my-2">
              🍺 Forfeit: {currentPrompt.forfeit}
            </div>
          )}

          {/* Discussion prompt */}
          {currentPrompt.discussionPrompt && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-zinc-300 font-medium my-2">
              💬 Discuss: {currentPrompt.discussionPrompt}
            </div>
          )}

          {/* Rating, Favorite & Report */}
          <div className="w-full mt-4">
            <CardRatingBar prompt={currentPrompt} />
          </div>
        </div>

        {/* Action Bar */}
        <div className="w-full pt-6 mt-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-xs sm:text-sm text-zinc-400 font-semibold">
            {activePlayer ? `Passed to ${activePlayer}` : 'Party Challenge'}
          </span>

          <button
            onClick={nextCard}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-black text-sm sm:text-base shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next Chaos Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
