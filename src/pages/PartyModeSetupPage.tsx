import React, { useState } from 'react';
import { GameId, GameCategory, PartyModeConfig } from '../types/game';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../data/gamesConfig';
import { soundEffects } from '../utils/audio';
import { useGameSettings } from '../context/GameSettingsContext';
import {
  Sparkles,
  Users,
  Disc3,
  Clock,
  Trophy,
  ShieldAlert,
  ArrowRight,
  Plus,
  X,
  Flame,
  Shuffle,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface PartyModeSetupPageProps {
  onStartParty: (config: PartyModeConfig) => void;
  onCancel: () => void;
}

export const PartyModeSetupPage: React.FC<PartyModeSetupPageProps> = ({ onStartParty, onCancel }) => {
  const { playMode } = useGameSettings();
  // Players (optional)
  const [playerInput, setPlayerInput] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  // Selected Games (all 14 selectable games)
  const allGameIds = Object.keys(GAMES_CONFIG) as GameId[];
  const [selectedGames, setSelectedGames] = useState<GameId[]>(allGameIds);

  // Categories (default to medium & spicy)
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>([
    'medium',
    'spicy',
    'unhinged',
  ]);

  // Rounds & Settings
  const [roundCount, setRoundCount] = useState<number | 'endless'>(20);
  const [enableChaosWheel, setEnableChaosWheel] = useState(true);
  const [enableMysteryCards, setEnableMysteryCards] = useState(true);
  const [enableSpecialCards, setEnableSpecialCards] = useState(true);
  const [specialCardFrequency, setSpecialCardFrequency] = useState<'off' | 'low' | 'normal' | 'high'>('normal');
  const [enableProgressiveDifficulty, setEnableProgressiveDifficulty] = useState(false);
  const [roundsPerProgressiveLevel, setRoundsPerProgressiveLevel] = useState(5);
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
      playMode,
      playerNames,
      selectedGames,
      categories: selectedCategories,
      roundCount,
      enableChaosWheel,
      enableMysteryCards,
      enableSpecialCards,
      specialCardFrequency,
      enableProgressiveDifficulty,
      roundsPerProgressiveLevel,
      enableScoring: enableScoring && playerNames.length > 0,
      timerSeconds,
      contentBoundary,
    };
    onStartParty(config);
  };

  return (
    <div className="w-full min-h-[100dvh] px-4 sm:px-8 xl:px-12 2xl:px-16 py-8 flex flex-col justify-between animate-fade-in select-none">
      {/* Top Header & Navigation */}
      <div className="w-full flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/10 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-white/20 transition-all text-xs sm:text-sm font-bold active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/15 border border-brand-pink/40 text-pink-300 text-xs font-semibold mb-1 shadow-neon-pink/20">
            <Flame className="w-3.5 h-3.5 text-brand-pink" />
            <span>Continuous Party Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Party Mode <span className="text-brand-gradient">Setup</span>
          </h1>
        </div>

        <button
          onClick={handleLaunch}
          className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-neon-pink transition-all active:scale-95 cursor-pointer"
        >
          <span>Launch Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Full-Screen 2-Column Responsive Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto">
        {/* Left Column (5 Cols on Large screens): Players + Difficulty Modes + Rounds */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. PLAYERS */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-2">
                <Users className="w-4 h-4" /> 1. Enter Player Names (Optional - {playerNames.length})
              </span>
              {playerNames.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPlayerNames([])}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 font-semibold underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
              <input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                placeholder="Add player name (e.g. Jordan)..."
                className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/60"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-brand-pink/20 border border-brand-pink/50 text-pink-300 font-bold text-sm hover:bg-brand-pink/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>

            {playerNames.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">
                No names entered. The party will run seamlessly for everyone in the room without individual turns.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
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
            )}
          </div>

          {/* 3. DIFFICULTY & INTENSITY MODES */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Flame className="w-4 h-4" /> 2. Difficulty & Intensity ({selectedCategories.length} Active)
              </span>
              <button
                onClick={() => setSelectedCategories((Object.keys(CATEGORY_LABELS) as GameCategory[]))}
                className="text-[11px] text-zinc-400 hover:text-white font-semibold underline"
              >
                Select All 8
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(CATEGORY_LABELS) as GameCategory[]).map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                const meta = CATEGORY_LABELS[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`p-3 rounded-2xl border text-center transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? `${meta.badgeColor} shadow-md scale-102`
                        : 'border-white/10 bg-white/[0.02] text-zinc-500 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="text-xs font-bold block">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. ROUND COUNT & BOUNDARIES */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-lg space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> 3. Game Flow & Rounds
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">Round Count</label>
                <div className="flex gap-1.5">
                  {[10, 20, 30, 'endless'].map(count => (
                    <button
                      key={String(count)}
                      type="button"
                      onClick={() => setRoundCount(count as number | 'endless')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        roundCount === count
                          ? 'border-brand-pink bg-brand-pink/20 text-white shadow-neon-pink/20'
                          : 'border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {count === 'endless' ? '∞' : count}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">Content Boundaries</label>
                <select
                  value={contentBoundary}
                  onChange={(e) => setContentBoundary(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="all">Unfiltered (All)</option>
                  <option value="clean">Non-Alcoholic</option>
                  <option value="adults-only">Adults Only (18+)</option>
                  <option value="kids-only">Kids Safe Mode</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols on Large screens): Included Games Grid + Chaos Modifiers */}
        <div className="lg:col-span-7 space-y-6">
          {/* 2. CHOOSE GAMES (14 GAMES) */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 4. Included Party Games ({selectedGames.length}/{allGameIds.length})
              </span>
              <button
                onClick={() => setSelectedGames(selectedGames.length === allGameIds.length ? [allGameIds[0]] : allGameIds)}
                className="text-xs text-zinc-400 hover:text-white font-semibold underline cursor-pointer"
              >
                {selectedGames.length === allGameIds.length ? 'Deselect All' : `Select All (${allGameIds.length})`}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {allGameIds.map((id) => {
                const game = GAMES_CONFIG[id];
                const isSelected = selectedGames.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleGame(id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-brand-pink/60 bg-brand-pink/15 shadow-neon-pink/20 scale-[1.02]'
                        : 'border-white/5 bg-white/[0.02] opacity-40 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black truncate" style={{ color: game.themeColor }}>
                        {game.title}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-pink shrink-0" />}
                    </div>
                    <span className="text-[10px] text-zinc-400 line-clamp-2 block leading-snug">
                      {game.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. CHAOS WHEEL, MYSTERY & TIMERS */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 shadow-lg space-y-5">
            <span className="text-xs font-black uppercase tracking-wider text-fuchsia-400 flex items-center gap-2">
              <Disc3 className="w-4 h-4" /> 5. Chaos Wheel, Timers & Scoring
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Chaos Wheel Toggle */}
              <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-xs font-semibold text-zinc-300 block mb-1">Chaos Wheel</span>
                <span className="text-[10px] text-zinc-500 mb-2">Surprise multiplier & challenge spins</span>
                <button
                  type="button"
                  onClick={() => setEnableChaosWheel(!enableChaosWheel)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    enableChaosWheel
                      ? 'border-purple-500 bg-purple-950/40 text-purple-300 shadow-neon-violet/20'
                      : 'border-white/10 text-zinc-500'
                  }`}
                >
                  <Disc3 className="w-3.5 h-3.5" />
                  <span>{enableChaosWheel ? 'Wheel Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Mystery Cards Toggle */}
              <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-xs font-semibold text-zinc-300 block mb-1">Mystery Cards</span>
                <span className="text-[10px] text-zinc-500 mb-2">Rare secret missions & surprise votes</span>
                <button
                  type="button"
                  onClick={() => setEnableMysteryCards(!enableMysteryCards)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    enableMysteryCards
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300 shadow-neon-amber/20'
                      : 'border-white/10 text-zinc-500'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{enableMysteryCards ? 'Mystery Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Timer Seconds */}
              <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-xs font-semibold text-zinc-300 block mb-1">Turn Timer</span>
                <span className="text-[10px] text-zinc-500 mb-2">Pressure countdown per prompt</span>
                <div className="flex gap-1">
                  {[0, 15, 30, 60].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setTimerSeconds(sec)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        timerSeconds === sec
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-neon-cyan/20'
                          : 'border-white/10 text-zinc-400'
                      }`}
                    >
                      {sec === 0 ? 'Off' : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Cards Event Frequency */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Rare & Special Cards
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Double Trouble, Reverse, Everyone Answers, Spotlight & Legendary Wildcards
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableSpecialCards(!enableSpecialCards)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    enableSpecialCards
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300 shadow-neon-amber/20'
                      : 'border-white/10 text-zinc-500'
                  }`}
                >
                  {enableSpecialCards ? 'SPECIAL CARDS ON' : 'OFF'}
                </button>
              </div>

              {enableSpecialCards && (
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-zinc-400">Frequency:</span>
                  {(['low', 'normal', 'high'] as const).map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setSpecialCardFrequency(freq)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all uppercase ${
                        specialCardFrequency === freq
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-sm'
                          : 'border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {freq === 'low' ? 'Low (8%)' : freq === 'normal' ? 'Normal (15%)' : 'High (25%)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Progressive Difficulty */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-500" /> Progressive Difficulty
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Naturally ramps up intensity tier as the party progresses with level-up animations
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableProgressiveDifficulty(!enableProgressiveDifficulty)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    enableProgressiveDifficulty
                      ? 'border-rose-500 bg-rose-950/40 text-rose-300 shadow-neon-pink/20'
                      : 'border-white/10 text-zinc-500'
                  }`}
                >
                  {enableProgressiveDifficulty ? 'PROGRESSIVE ON' : 'STATIC'}
                </button>
              </div>

              {enableProgressiveDifficulty && (
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-zinc-400">Rounds per tier:</span>
                  {[3, 5, 8, 10].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setRoundsPerProgressiveLevel(cnt)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        roundsPerProgressiveLevel === cnt
                          ? 'border-rose-400 bg-rose-500/20 text-rose-200 shadow-sm'
                          : 'border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Every {cnt} rounds
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group Scoring */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <div>
                <span className="text-xs font-bold text-white block">Group Scoring & Leaderboard</span>
                <span className="text-[11px] text-zinc-400">Award points for daring feats and crown the party MVP</span>
              </div>
              <button
                type="button"
                onClick={() => setEnableScoring(!enableScoring)}
                className={`px-5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  enableScoring
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-neon-green/20'
                    : 'border-white/10 text-zinc-500'
                }`}
              >
                {enableScoring ? 'SCORING ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Bottom Launch Bar */}
      <div className="w-full pt-8 mt-6 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-4 rounded-2xl text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          Cancel & Return Home
        </button>

        <button
          type="button"
          onClick={handleLaunch}
          className="px-12 py-5 rounded-3xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-lg shadow-neon-pink flex items-center gap-3 transition-all active:scale-95 cursor-pointer ml-auto"
        >
          <span>Launch Continuous Party Mode!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
