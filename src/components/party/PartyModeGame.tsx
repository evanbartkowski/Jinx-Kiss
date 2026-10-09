import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameId, PartyModeConfig, PromptItem, MysteryCard, SecretMission, Achievement } from '../../types/game';
import { GAMES_CONFIG } from '../../data/gamesConfig';
import { ALL_DEFAULT_PROMPTS, getDefaultPromptsForGame } from '../../data/prompts';
import { MYSTERY_CARDS } from '../../data/mysteryCards';
import { SECRET_MISSIONS } from '../../data/secretMissions';
import { ChaosWheel } from './ChaosWheel';
import { MysteryCardModal } from './MysteryCardModal';
import { PartyRecap } from './PartyRecap';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { achievementsService } from '../../services/achievementsService';
import {
  Sparkles,
  Disc3,
  Clock,
  Trophy,
  ArrowRight,
  RotateCcw,
  Pause,
  Play,
  SkipForward,
  Eye,
  EyeOff,
  Flame,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PartyModeGameProps {
  config: PartyModeConfig;
  onExit: () => void;
}

export const PartyModeGame: React.FC<PartyModeGameProps> = ({ config, onExit }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [activeGameId, setActiveGameId] = useState<GameId>(config.selectedGames[0] || 'truth-or-dare');
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem | null>(null);

  // Scoring
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    config.playerNames.forEach(p => { initial[p] = 0; });
    return initial;
  });

  // Timer
  const [timerLeft, setTimerLeft] = useState<number>(config.timerSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Modifiers and Overlays
  const [multiplier, setMultiplier] = useState(1);
  const [showChaosWheel, setShowChaosWheel] = useState(false);
  const [activeMysteryCard, setActiveMysteryCard] = useState<MysteryCard | null>(null);
  const [assignedMissions, setAssignedMissions] = useState<Record<string, SecretMission>>({});
  const [isSecretMissionPeeking, setIsSecretMissionPeeking] = useState(false);
  const [showPartyRecap, setShowPartyRecap] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  const players = config.playerNames;
  const activePlayer = players[activePlayerIndex] || players[0];

  // Helper to pick next prompt with balanced variety
  const pickPromptForGame = (gameId: GameId): PromptItem => {
    const availableCategories = config.categories;
    const cat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const pool = getDefaultPromptsForGame(gameId, cat);
    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    const allForGame = ALL_DEFAULT_PROMPTS[gameId] || [];
    return allForGame[Math.floor(Math.random() * allForGame.length)] || {
      id: 'fallback-prompt',
      gameId,
      category: 'medium',
      text: 'Share something nobody in the room knows about you!',
    };
  };

  // Initialize first prompt
  useEffect(() => {
    const initialPrompt = pickPromptForGame(activeGameId);
    setCurrentPrompt(initialPrompt);

    // Assign secret missions to players
    const missionsMap: Record<string, SecretMission> = {};
    players.forEach((p, idx) => {
      missionsMap[p] = SECRET_MISSIONS[idx % SECRET_MISSIONS.length];
    });
    setAssignedMissions(missionsMap);
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (config.timerSeconds === 0 || isTimerPaused || showChaosWheel || activeMysteryCard || showPartyRecap) return;

    if (timerLeft <= 0) {
      soundEffects.playBuzzer();
      return;
    }

    const interval = setInterval(() => {
      setTimerLeft(prev => {
        if (prev <= 1) {
          soundEffects.playBuzzer();
          return 0;
        }
        if (prev <= 5) {
          soundEffects.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerLeft, isTimerPaused, showChaosWheel, activeMysteryCard, showPartyRecap, config.timerSeconds]);

  // Turn rotation & game advancement
  const handleNextRound = (awardCurrentPlayerPoints = false) => {
    soundEffects.playClick();

    if (awardCurrentPlayerPoints) {
      const addedPoints = 10 * multiplier;
      setScores(prev => ({
        ...prev,
        [activePlayer]: (prev[activePlayer] || 0) + addedPoints,
      }));
      soundEffects.playSuccess();
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FF4DA6', '#10B981'],
      });
    }

    // Check achievement for rounds
    if (currentRound >= 20) {
      const ach = achievementsService.unlock('party-animal');
      if (ach) setUnlockedAchievements(prev => [...prev, ach]);
    }

    // Check end condition
    if (config.roundCount !== 'endless' && currentRound >= config.roundCount) {
      setShowPartyRecap(true);
      return;
    }

    const nextRoundNumber = currentRound + 1;
    setCurrentRound(nextRoundNumber);

    // Rotate player
    const nextPlayerIdx = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextPlayerIdx);

    // Pick next game (weighted to ensure variety)
    const otherGames = config.selectedGames.filter(g => g !== activeGameId);
    const nextGame = otherGames.length > 0
      ? otherGames[Math.floor(Math.random() * otherGames.length)]
      : config.selectedGames[0];
    setActiveGameId(nextGame);

    const nextPrompt = pickPromptForGame(nextGame);
    setCurrentPrompt(nextPrompt);

    // Reset multiplier & timer
    setMultiplier(1);
    setTimerLeft(config.timerSeconds);
    setIsSecretMissionPeeking(false);

    // Rare chance of Mystery Card trigger (approx 15% chance if enabled)
    if (config.enableMysteryCards && Math.random() < 0.15) {
      const randomCard = MYSTERY_CARDS[Math.floor(Math.random() * MYSTERY_CARDS.length)];
      setActiveMysteryCard(randomCard);
    }
  };

  const handleSkipPrompt = () => {
    soundEffects.playClick();
    const nextPrompt = pickPromptForGame(activeGameId);
    setCurrentPrompt(nextPrompt);
    setTimerLeft(config.timerSeconds);
  };

  const handleChaosWheelTrigger = () => {
    soundEffects.playClick();
    setShowChaosWheel(true);
    const ach = achievementsService.unlock('chaos-magnet');
    if (ach) setUnlockedAchievements(prev => [...prev, ach]);
  };

  const activeMetadata = GAMES_CONFIG[activeGameId] || GAMES_CONFIG['truth-or-dare'];
  const activeMission = assignedMissions[activePlayer];

  if (showPartyRecap) {
    return (
      <PartyRecap
        totalRounds={currentRound}
        scores={scores}
        unlockedAchievements={unlockedAchievements}
        onPlayAgain={() => {
          setCurrentRound(1);
          setScores(() => {
            const fresh: Record<string, number> = {};
            players.forEach(p => { fresh[p] = 0; });
            return fresh;
          });
          setShowPartyRecap(false);
        }}
        onHome={onExit}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center gap-6 animate-fade-in select-none">
      {/* Top Banner: Round Info & Game Mode */}
      <div className="w-full flex items-center justify-between gap-3">
        {/* Round Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white shadow-sm">
            Round {currentRound} {config.roundCount !== 'endless' && `/ ${config.roundCount}`}
          </span>
          {multiplier > 1 && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse">
              ⚡ {multiplier}x Points
            </span>
          )}
        </div>

        {/* Live Score Leader Snippet */}
        {config.enableScoring && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 border border-white/10 text-xs text-zinc-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold truncate max-w-[150px]">
              {Object.entries(scores).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Nobody'}:
            </span>
            <span className="font-black text-white">
              {Object.entries(scores).sort((a,b) => b[1] - a[1])[0]?.[1] || 0} pts
            </span>
          </div>
        )}

        {/* End Party Button */}
        <button
          onClick={() => setShowPartyRecap(true)}
          className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
        >
          End Party
        </button>
      </div>

      {/* Active Game & Player Header */}
      <div className="w-full flex flex-col items-center text-center">
        {/* Game Title with Accent Color */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border mb-3 transition-all"
          style={{
            borderColor: `${activeMetadata.themeColor}50`,
            backgroundColor: `${activeMetadata.themeColor}15`,
            color: activeMetadata.themeColor,
            boxShadow: `0 0 20px ${activeMetadata.themeColor}30`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{activeMetadata.title}</span>
        </div>

        {/* Active Player Spotlight */}
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
          It's <span style={{ color: activeMetadata.themeColor }}>{activePlayer}'s</span> Turn
        </h2>
      </div>

      {/* Timer Bar (if enabled) */}
      {config.timerSeconds > 0 && (
        <div className="w-full max-w-md flex flex-col items-center gap-1.5">
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-1000 ${
                timerLeft <= 5 ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-brand-pink to-brand-violet'
              }`}
              style={{ width: `${(timerLeft / config.timerSeconds) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-full text-[11px] text-zinc-400 font-semibold px-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timerLeft}s remaining
            </span>
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="text-zinc-400 hover:text-white flex items-center gap-1"
            >
              {isTimerPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
              <span>{isTimerPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Party Prompt Card */}
      <div
        className="w-full min-h-[320px] p-8 sm:p-12 rounded-3xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300"
        style={{
          borderColor: `${activeMetadata.themeColor}40`,
          boxShadow: `0 10px 40px -10px ${activeMetadata.themeColor}35`,
        }}
      >
        {/* Glow ambient background */}
        <div
          className="absolute inset-0 rounded-3xl opacity-10 blur-2xl pointer-events-none"
          style={{ backgroundColor: activeMetadata.themeColor }}
        />

        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          {activeMetadata.tagline}
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-relaxed my-6 max-w-xl">
          "{currentPrompt?.text}"
        </p>

        {/* Secret Mission Peek for Active Player */}
        {activeMission && (
          <div className="my-2">
            {isSecretMissionPeeking ? (
              <div className="p-3.5 rounded-2xl bg-teal-950/60 border border-teal-500/40 text-left animate-scale-in max-w-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block mb-1">
                  🕵️ Your Private Secret Mission (+{activeMission.rewardPoints} pts):
                </span>
                <p className="text-xs text-zinc-200 font-medium">
                  {activeMission.mission}
                </p>
                <button
                  onClick={() => setIsSecretMissionPeeking(false)}
                  className="mt-2 text-[10px] font-bold text-teal-300 underline"
                >
                  Hide Secret Mission
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSecretMissionPeeking(true)}
                className="px-4 py-1.5 rounded-full border border-white/10 hover:border-teal-500/40 text-xs font-semibold text-zinc-400 hover:text-teal-300 flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Peek My Secret Mission</span>
              </button>
            )}
          </div>
        )}

        {/* Card Rating Bar */}
        {currentPrompt && (
          <div className="w-full mt-4">
            <CardRatingBar prompt={currentPrompt} />
          </div>
        )}
      </div>

      {/* Main Party Gameplay Controls */}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Skip / Reshuffle */}
          <button
            onClick={handleSkipPrompt}
            className="px-5 py-3.5 rounded-2xl border border-white/10 text-zinc-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-2 active:scale-95"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip / Reshuffle</span>
          </button>

          {/* Chaos Wheel Trigger */}
          {config.enableChaosWheel && (
            <button
              onClick={handleChaosWheelTrigger}
              className="px-6 py-3.5 rounded-2xl bg-purple-900/40 border border-purple-500/50 hover:bg-purple-900/60 text-purple-200 font-bold text-xs shadow-neon-violet flex items-center gap-2 transition-all active:scale-95"
            >
              <Disc3 className="w-4 h-4 text-purple-400" />
              <span>Spin Chaos Wheel</span>
            </button>
          )}

          {/* Award Points & Next Round */}
          {config.enableScoring ? (
            <button
              onClick={() => handleNextRound(true)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Complete (+{10 * multiplier} pts)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={() => handleNextRound(false)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Next Round</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Scoreboard Drawer (Horizontal Chips) */}
        {config.enableScoring && (
          <div className="w-full flex items-center justify-center gap-2 overflow-x-auto py-2 px-1">
            {players.map((p, idx) => {
              const isCurrent = idx === activePlayerIndex;
              return (
                <div
                  key={p}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs flex items-center gap-2 shrink-0 transition-all ${
                    isCurrent
                      ? 'border-brand-pink/60 bg-brand-pink/20 text-white shadow-neon-pink/20'
                      : 'border-white/5 bg-white/[0.02] text-zinc-400'
                  }`}
                >
                  <span className="font-bold truncate">{p}</span>
                  <span className="font-black text-pink-400">{scores[p] || 0}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chaos Wheel Modal */}
      {showChaosWheel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <ChaosWheel
            isModal
            onClose={() => setShowChaosWheel(false)}
            onResultSelected={(result) => {
              if (result.id === 'double-points') {
                setMultiplier(2);
              }
            }}
          />
        </div>
      )}

      {/* Mystery Card Modal */}
      {activeMysteryCard && (
        <MysteryCardModal
          card={activeMysteryCard}
          onClose={() => setActiveMysteryCard(null)}
        />
      )}
    </div>
  );
};
