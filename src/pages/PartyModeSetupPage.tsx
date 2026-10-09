import React, { useState } from 'react';
import { GameId, GameCategory, PartyModeConfig } from '../types/game';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../data/gamesConfig';
import { soundEffects } from '../utils/audio';
import { Sparkles, Users, Disc3, Clock, Trophy, ShieldAlert, ArrowRight, Plus, X, Flame } from 'lucide-react';

interface PartyModeSetupPageProps {
  onStartParty: (config: PartyModeConfig) => void;
  onCancel: () => void;
}

export const PartyModeSetupPage: React.FC<PartyModeSetupPageProps> = ({ onStartParty, onCancel }) => {
  // Players
  const [playerInput, setPlayerInput] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Sam', 'Alex', 'Jordan', 'Taylor'
  ]);

  // Selected Games (all 12 selected by default)
  const allGameIds = Object.keys(GAMES_CONFIG) as GameId[];
  const [selectedGames, setSelectedGames] = useState<GameId[]>(allGameIds);

  // Categories
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>([
    'medium', 'spicy'
  ]);

  // Rounds & Settings
  const [roundCount, setRoundCount] = useState<number | 'endless'>(20);
  const [enableChaosWheel, setEnableChaosWheel] = useState(true);
  const [enableMysteryCards, setEnableMysteryCards] = useState(true);
  const [enableScoring, setEnableScoring] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [contentBoundary, setContentBoundary] = useState<'all' | 'clean' | 'adults-only' | 'kids-only'>('all');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim()) return;
    const clean = playerInput.trim();
    if (!playerNames.includes(clean)) {
      setPlayerNames([...playerNames, clean]);
      soundEffects.playClick();
    }
    setPlayerInput('');
  };

  const handleRemovePlayer = (name: string) => {
    soundEffects.playClick();
    setPlayerNames(playerNames.filter(p => p !== name));
  };

  const toggleGame = (gameId: GameId) => {
    soundEffects.playClick();
    if (selectedGames.includes(gameId)) {
      if (selectedGames.length > 1) {
        setSelectedGames(selectedGames.filter(id => id !== gameId));
      }
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };

  const toggleCategory = (cat: GameCategory) => {
    soundEffects.playClick();
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleLaunch = () => {
    soundEffects.playSuccess();
    const config: PartyModeConfig = {
      playerNames: playerNames.length >= 2 ? playerNames : ['Player 1', 'Player 2'],
      selectedGames,
      categories: selectedCategories.length > 0 ? selectedCategories : ['easy', 'medium'],
      roundCount,
      enableChaosWheel,
      enableMysteryCards,
      enableScoring,
      timerSeconds,
      contentBoundary,
    };
    onStartParty(config);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/15 border border-brand-pink/40 text-pink-300 text-xs font-semibold mb-3 shadow-neon-pink/20">
          <Flame className="w-4 h-4 text-brand-pink" />
          <span>Continuous Party Game Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-2">
          Party Mode <span className="text-brand-gradient">Setup</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Combine all games into one non-stop experience with smooth turns, Chaos Wheel spins, and live group scoring.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. PLAYERS */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> 1. Enter Player Names ({playerNames.length})
            </span>
          </div>

          <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              placeholder="Add player name..."
              className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/60"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-brand-pink/20 border border-brand-pink/50 text-pink-300 font-bold text-sm hover:bg-brand-pink/30 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {playerNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-200"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(name)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 2. CHOOSE GAMES */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 2. Included Games ({selectedGames.length}/{allGameIds.length})
            </span>
            <button
              onClick={() => setSelectedGames(selectedGames.length === allGameIds.length ? [allGameIds[0]] : allGameIds)}
              className="text-xs text-zinc-400 hover:text-white font-semibold underline"
            >
              {selectedGames.length === allGameIds.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allGameIds.map((id) => {
              const game = GAMES_CONFIG[id];
              const isSelected = selectedGames.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleGame(id)}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                    isSelected
                      ? 'border-brand-pink/60 bg-brand-pink/15 shadow-neon-pink/20'
                      : 'border-white/5 bg-white/[0.02] opacity-50 hover:opacity-80'
                  }`}
                >
                  <span className="text-xs font-bold block truncate" style={{ color: game.themeColor }}>
                    {game.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate block mt-0.5">
                    {game.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CATEGORIES */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4" /> 3. Difficulty & Vibes ({selectedCategories.length} selected)
          </span>

          <div className="flex flex-wrap gap-2.5">
            {(Object.keys(CATEGORY_LABELS) as GameCategory[]).map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              const meta = CATEGORY_LABELS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${
                    isSelected
                      ? `${meta.badgeColor} shadow-md`
                      : 'border-white/10 bg-white/[0.02] text-zinc-500'
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. GAMEPLAY SETTINGS */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> 4. Rounds, Timers & Chaos Modifiers
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Rounds */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-2">Round Count</label>
              <div className="flex gap-1.5">
                {[10, 20, 30, 'endless'].map(count => (
                  <button
                    key={String(count)}
                    type="button"
                    onClick={() => setRoundCount(count as number | 'endless')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                      roundCount === count
                        ? 'border-brand-pink bg-brand-pink/20 text-white'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    {count === 'endless' ? '∞' : count}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-2">Round Timer</label>
              <div className="flex gap-1.5">
                {[0, 15, 30, 60].map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setTimerSeconds(sec)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                      timerSeconds === sec
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    {sec === 0 ? 'Off' : `${sec}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Chaos Wheel Toggle */}
            <div className="flex flex-col justify-between">
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Chaos Wheel</label>
              <button
                type="button"
                onClick={() => setEnableChaosWheel(!enableChaosWheel)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 ${
                  enableChaosWheel
                    ? 'border-purple-500 bg-purple-950/40 text-purple-300'
                    : 'border-white/10 text-zinc-500'
                }`}
              >
                <Disc3 className="w-3.5 h-3.5" />
                <span>{enableChaosWheel ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>

            {/* Mystery Cards Toggle */}
            <div className="flex flex-col justify-between">
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Mystery Cards</label>
              <button
                type="button"
                onClick={() => setEnableMysteryCards(!enableMysteryCards)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 ${
                  enableMysteryCards
                    ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                    : 'border-white/10 text-zinc-500'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{enableMysteryCards ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
          </div>

          {/* Scoring Toggle & Content Boundaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Group Scoring & Points</span>
                <span className="text-[11px] text-zinc-400">Track round scores and crown a party MVP</span>
              </div>
              <button
                type="button"
                onClick={() => setEnableScoring(!enableScoring)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black border ${
                  enableScoring
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-white/10 text-zinc-500'
                }`}
              >
                {enableScoring ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Content Boundaries</span>
                <span className="text-[11px] text-zinc-400">Strictly exclude alcohol or 18+ themes</span>
              </div>
              <select
                value={contentBoundary}
                onChange={(e) => setContentBoundary(e.target.value as any)}
                className="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="all">Unfiltered (All)</option>
                <option value="clean">Non-Alcoholic</option>
                <option value="adults-only">Adults Only (18+)</option>
                <option value="kids-only">Kids Safe Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 rounded-2xl text-xs font-bold text-zinc-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleLaunch}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95"
          >
            <span>Launch Party Mode!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
