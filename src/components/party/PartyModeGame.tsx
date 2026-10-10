import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameId, GameCategory, PartyModeConfig, PromptItem, MysteryCard, SecretMission, Achievement } from '../../types/game';
import { GAMES_CONFIG } from '../../data/gamesConfig';
import { ALL_DEFAULT_PROMPTS, getDefaultPromptsForGame } from '../../data/prompts';
import { MYSTERY_CARDS } from '../../data/mysteryCards';
import { SECRET_MISSIONS } from '../../data/secretMissions';
import { SpecialCard } from '../../types/specialCard';
import { drawRandomSpecialCard, getSpecialCardChance } from '../../data/specialCards';
import { SpecialCardOverlay } from '../common/SpecialCardOverlay';
import {
  ProgressiveDifficultyState,
  advanceProgressiveRound,
} from '../../utils/progressiveDifficulty';
import { ProgressiveLevelUpModal } from '../common/ProgressiveLevelUpModal';
import { sessionService } from '../../services/sessionService';
import { ChaosWheel } from './ChaosWheel';
import { MysteryCardModal } from './MysteryCardModal';
import { PartyRecap } from './PartyRecap';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { achievementsService } from '../../services/achievementsService';
import { isPromptLegendary, rollForLegendaryCard, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
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
  TrendingUp,
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

  // Progressive Difficulty State
  const [progressiveState, setProgressiveState] = useState<ProgressiveDifficultyState>(() => ({
    enabled: !!config.enableProgressiveDifficulty,
    currentCategory: config.categories[0] || 'medium',
    initialCategory: config.categories[0] || 'medium',
    roundsPerLevel: config.roundsPerProgressiveLevel || 5,
    roundsCompletedAtTier: 0,
    totalProgressiveRounds: 0,
    isPaused: false,
    hasJustLeveledUp: false,
  }));
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ newCat: GameCategory; prevCat: GameCategory } | null>(null);

  // Special Card State
  const [activeSpecialCard, setActiveSpecialCard] = useState<SpecialCard | null>(null);

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

  // Helper to pick next prompt with balanced variety & guaranteed deduplication
  const pickPromptForGame = (gameId: GameId, categoryOverride?: GameCategory): PromptItem => {
    const cat = categoryOverride || (progressiveState.enabled ? progressiveState.currentCategory : config.categories[Math.floor(Math.random() * config.categories.length)]);
    const pool = getDefaultPromptsForGame(gameId, cat);
    
    // Deduplication filter: exclude previously seen cards for this deck
    const unseenPool = sessionService.filterUnseenCards(gameId, pool);

    if (unseenPool.length > 0) {
      const chosen = unseenPool[Math.floor(Math.random() * unseenPool.length)];
      const rolled = rollForLegendaryCard(chosen, cat, gameId);
      sessionService.markCardSeen(gameId, rolled.id);
      return rolled;
    }

    const allForGame = ALL_DEFAULT_PROMPTS[gameId] || [];
    const chosen = allForGame[Math.floor(Math.random() * allForGame.length)] || {
      id: 'fallback-prompt',
      gameId,
      category: 'medium',
      text: 'Share something nobody in the room knows about you!',
    };
    const rolled = rollForLegendaryCard(chosen, cat, gameId);
    sessionService.markCardSeen(gameId, rolled.id);
    return rolled;
  };

  // Trigger legendary effects when active party prompt is legendary
  useEffect(() => {
    if (currentPrompt && isPromptLegendary(currentPrompt)) {
      triggerLegendaryCardEffects(currentPrompt);
    }
  }, [currentPrompt?.id, currentPrompt?.isLegendary]);

  // Initialize first prompt & auto-save session
  useEffect(() => {
    const initialPrompt = pickPromptForGame(activeGameId);
    setCurrentPrompt(initialPrompt);

    // Save initial session
    sessionService.saveActiveSession({
      mode: 'party',
      gameId: activeGameId,
      category: progressiveState.currentCategory,
      players,
      currentRound: 1,
      scores,
      partyConfig: config,
    });

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
    soundEffects.playCardFlip();

    let updatedScores = { ...scores };
    if (awardCurrentPlayerPoints) {
      const addedPoints = 10 * multiplier;
      updatedScores = {
        ...scores,
        [activePlayer]: (scores[activePlayer] || 0) + addedPoints,
      };
      setScores(updatedScores);
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
      sessionService.clearActiveSession();
      return;
    }

    const nextRoundNumber = currentRound + 1;
    setCurrentRound(nextRoundNumber);

    // Rotate player
    const nextPlayerIdx = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextPlayerIdx);

    // Advance progressive difficulty
    let activeCat = progressiveState.currentCategory;
    if (progressiveState.enabled) {
      const { newState, didLevelUp, newCategory } = advanceProgressiveRound(progressiveState);
      setProgressiveState(newState);
      if (didLevelUp) {
        setLevelUpInfo({ newCat: newCategory, prevCat: activeCat });
        setShowLevelUpModal(true);
        activeCat = newCategory;
      }
    }

    // Pick next game (weighted to ensure variety)
    const otherGames = config.selectedGames.filter(g => g !== activeGameId);
    const nextGame = otherGames.length > 0
      ? otherGames[Math.floor(Math.random() * otherGames.length)]
      : config.selectedGames[0];
    setActiveGameId(nextGame);

    const nextPrompt = pickPromptForGame(nextGame, activeCat);
    setCurrentPrompt(nextPrompt);

    // Save game session automatically after every completed card
    sessionService.saveActiveSession({
      mode: 'party',
      gameId: nextGame,
      category: activeCat,
      players,
      currentRound: nextRoundNumber,
      scores: updatedScores,
      partyConfig: config,
    });

    // Reset multiplier & timer
    setMultiplier(1);
    setTimerLeft(config.timerSeconds);
    setIsSecretMissionPeeking(false);

    // Rare chance of Special Card trigger
    if (config.enableSpecialCards !== false) {
      const specialChance = getSpecialCardChance(config.specialCardFrequency || 'normal');
      if (Math.random() < specialChance) {
        const special = drawRandomSpecialCard();
        setActiveSpecialCard(special);
      }
    } else if (config.enableMysteryCards && Math.random() < 0.15) {
      const randomCard = MYSTERY_CARDS[Math.floor(Math.random() * MYSTERY_CARDS.length)];
      setActiveMysteryCard(randomCard);
    }
  };

  const handleSkipPrompt = () => {
    soundEffects.playCardFlip();
    const nextPrompt = pickPromptForGame(activeGameId, progressiveState.currentCategory);
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
  const isLegendary = isPromptLegendary(currentPrompt);

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
    <div className="w-full min-h-[calc(100dvh-5rem)] px-4 sm:px-8 xl:px-12 2xl:px-16 py-6 flex flex-col justify-between items-center gap-6 animate-fade-in select-none">
      {/* Top Banner: Round Info & Game Mode */}
      <div className="w-full flex items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        {/* Round Badge */}
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white shadow-sm">
            Round {currentRound} {config.roundCount !== 'endless' && `/ ${config.roundCount}`}
          </span>
          {multiplier > 1 && (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse">
              ⚡ {multiplier}x Points Active
            </span>
          )}

          {/* Progressive Tier Indicator */}
          {progressiveState.enabled && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase bg-gradient-to-r from-rose-950/50 to-pink-950/50 border border-rose-500/40 text-rose-300 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span>Tier: {progressiveState.currentCategory}</span>
              <span className="text-[10px] text-zinc-400 font-semibold font-mono">
                ({progressiveState.roundsCompletedAtTier}/{progressiveState.roundsPerLevel})
              </span>
            </div>
          )}
        </div>

        {/* Live Score Leader Snippet */}
        {config.enableScoring && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 text-xs sm:text-sm text-zinc-300 shadow-md">
            <Trophy className="w-4 h-4 text-amber-400" />
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
          className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white px-4 py-2 rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
        >
          End Party
        </button>
      </div>

      {/* Active Game & Player Header */}
      <div className="w-full flex flex-col items-center text-center">
        {/* Game Title with Accent Color */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border mb-3 transition-all"
          style={{
            borderColor: `${activeMetadata.themeColor}50`,
            backgroundColor: `${activeMetadata.themeColor}15`,
            color: activeMetadata.themeColor,
            boxShadow: `0 0 20px ${activeMetadata.themeColor}30`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {activeGameId === 'red-flag-green-flag' ? (
              <>
                <span className="text-red-500">Red Flag</span> / <span className="text-emerald-400">Green Flag</span>
              </>
            ) : (
              activeMetadata.title
            )}
          </span>
        </div>

        {/* Active Player Spotlight or Group Challenge */}
        {players.length > 0 && activePlayer ? (
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            It's <span style={{ color: activeMetadata.themeColor }}>{activePlayer}'s</span> Turn
          </h2>
        ) : (
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            <span style={{ color: activeMetadata.themeColor }}>Party</span> Challenge
          </h2>
        )}
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
        className={`w-full max-w-5xl xl:max-w-6xl min-h-[440px] sm:min-h-[560px] p-8 sm:p-14 lg:p-16 rounded-3xl flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 my-auto ${
          isLegendary
            ? 'border-2 border-yellow-400 sm:border-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.65),inset_0_0_30px_rgba(250,204,21,0.2)] ring-2 ring-yellow-400/80 bg-gradient-to-b from-yellow-950/40 via-black/60 to-black/90'
            : 'glass-panel border'
        }`}
        style={
          isLegendary
            ? undefined
            : {
                borderColor: `${activeMetadata.themeColor}50`,
                boxShadow: `0 15px 50px -15px ${activeMetadata.themeColor}40`,
              }
        }
      >
        {/* Glow ambient background */}
        <div
          className={`absolute inset-0 rounded-3xl pointer-events-none ${
            isLegendary
              ? 'bg-gradient-to-b from-yellow-500/25 via-amber-500/15 to-transparent opacity-40'
              : 'opacity-15 blur-3xl'
          }`}
          style={isLegendary ? undefined : { backgroundColor: activeMetadata.themeColor }}
        />

        {/* Legendary Card Badge */}
        {isLegendary && (
          <div className="mb-4">
            <LegendaryCardBadge title={currentPrompt?.legendaryTitle} />
          </div>
        )}

        <span className="text-xs sm:text-sm uppercase tracking-widest text-zinc-400 font-semibold">
          {activeMetadata.tagline}
        </span>

        <p className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight my-8 max-w-4xl tracking-tight">
          "{currentPrompt?.text}"
        </p>

        {/* Secret Mission Peek for Active Player */}
        {activeMission && (
          <div className="my-2">
            {isSecretMissionPeeking ? (
              <div className="p-4 rounded-2xl bg-teal-950/70 border border-teal-500/50 text-left animate-scale-in max-w-lg shadow-lg">
                <span className="text-xs font-black uppercase tracking-wider text-teal-400 block mb-1">
                  🕵️ Your Private Secret Mission (+{activeMission.rewardPoints} pts):
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 font-medium">
                  {activeMission.mission}
                </p>
                <button
                  onClick={() => setIsSecretMissionPeeking(false)}
                  className="mt-2 text-xs font-bold text-teal-300 underline cursor-pointer"
                >
                  Hide Secret Mission
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSecretMissionPeeking(true)}
                className="px-5 py-2 rounded-full border border-white/10 hover:border-teal-500/50 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-teal-300 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Eye className="w-4 h-4" />
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
      <div className="w-full max-w-5xl flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {/* Skip / Reshuffle */}
          <button
            onClick={handleSkipPrompt}
            className="px-6 py-4 rounded-2xl border border-white/15 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer bg-white/[0.02] hover:bg-white/[0.08]"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip / Reshuffle</span>
          </button>

          {/* Chaos Wheel Trigger */}
          {config.enableChaosWheel && (
            <button
              onClick={handleChaosWheelTrigger}
              className="px-7 py-4 rounded-2xl bg-purple-900/40 border border-purple-500/50 hover:bg-purple-900/60 text-purple-200 font-black text-xs sm:text-sm shadow-neon-violet flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <Disc3 className="w-4 h-4 text-purple-400" />
              <span>Spin Chaos Wheel</span>
            </button>
          )}

          {/* Award Points & Next Round */}
          {config.enableScoring ? (
            <button
              onClick={() => handleNextRound(true)}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              <span>Complete (+{10 * multiplier} pts)</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={() => handleNextRound(false)}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Next Round</span>
              <ArrowRight className="w-5 h-5" />
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

      {/* Special Card Overlay */}
      {activeSpecialCard && (
        <SpecialCardOverlay
          card={activeSpecialCard}
          activePlayerName={activePlayer}
          onAccept={() => {
            soundEffects.playSuccess();
            setScores(prev => ({
              ...prev,
              [activePlayer]: (prev[activePlayer] || 0) + activeSpecialCard.pointsAwarded,
            }));
            setActiveSpecialCard(null);
          }}
          onSkip={() => setActiveSpecialCard(null)}
        />
      )}

      {/* Progressive Level Up Modal */}
      {levelUpInfo && (
        <ProgressiveLevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          newCategory={levelUpInfo.newCat}
          previousCategory={levelUpInfo.prevCat}
        />
      )}
    </div>
  );
};

