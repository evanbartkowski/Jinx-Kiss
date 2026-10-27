import { useLegendaryDraw } from '../../hooks/useLegendaryDraw';
import { RemovedPrompt } from '../common/RemovedPrompt';
import { useLivePromptState } from '../../hooks/useLivePrompt';
import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { votingService, VoteStats, SavedPlayerInfo } from '../../services/votingService';
import { CardRatingBar } from '../common/CardRatingBar';
import { soundEffects } from '../../utils/audio';
import { isPromptLegendary, triggerLegendaryCardEffects } from '../../utils/legendaryCards';
import { LegendaryCardBadge } from '../common/LegendaryCardBadge';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Trophy,
  Flame,
  Clock,
  Edit2,
  Check,
  X,
  History,
  Sparkles,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WouldYouRatherGameProps {
  prompts: PromptItem[];
  players: string[];
}

const CUSTOM_NAME_KEY = 'jinxkiss_wyr_custom_player_name';

export const WouldYouRatherGame: React.FC<WouldYouRatherGameProps> = ({ prompts, players }) => {
  const { currentUser } = useAuth();
  const authUser = currentUser?.username || null;

  const rollForLegendaryCard = useLegendaryDraw();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [voteStats, setVoteStats] = useState<VoteStats | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partyVotes, setPartyVotes] = useState<Record<string, 'A' | 'B'>>({});
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  // Custom player name when playing solo without party setup
  const [customName, setCustomName] = useState<string>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(CUSTOM_NAME_KEY);
        if (saved) return saved;
      }
    } catch {
      // Fallback
    }
    return authUser || 'You';
  });
  const [tempNameInput, setTempNameInput] = useState(customName);

  const [activePrompt, setActivePrompt] = useLivePromptState<PromptItem>(() => {
    const initial = prompts[0] || {
      id: 'init',
      gameId: 'would-you-rather',
      category: 'medium',
      text: 'Would you rather?',
    };
    return rollForLegendaryCard(initial, initial.category || 'medium', 'would-you-rather', 0.02, initial.playMode);
  });

  const isLegendary = isPromptLegendary(activePrompt);

  // Active player turn calculation
  const activePlayerName = players.length > 0
    ? players[playerIndex % players.length]
    : customName;

  useEffect(() => {
    if (isLegendary) {
      triggerLegendaryCardEffects(activePrompt);
    }
  }, [activePrompt?.id]);

  // Fetch latest stats for prompt on mount or prompt change
  useEffect(() => {
    if (!activePrompt) return;
    let isMounted = true;
    votingService.fetchStats(activePrompt.id).then((freshStats) => {
      if (isMounted && selectedChoice) {
        setVoteStats(freshStats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activePrompt?.id]);

  const handleSaveCustomName = () => {
    const trimmed = tempNameInput.trim() || 'You';
    setCustomName(trimmed);
    setIsEditingName(false);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CUSTOM_NAME_KEY, trimmed);
      }
    } catch {
      // Ignore
    }
  };

  const handleVote = async (choice: 'A' | 'B') => {
    if (!activePrompt || selectedChoice || isSubmitting) return;
    setSelectedChoice(choice);
    setIsSubmitting(true);
    soundEffects.playVoteSubmit();

    // Register active player in partyVotes map
    if (players.length > 0) {
      setPartyVotes(prev => ({ ...prev, [activePlayerName]: choice }));
    }

    try {
      const stats = await votingService.recordVote(activePrompt.id, choice, activePlayerName);
      setVoteStats(stats);
      soundEffects.playVoteReveal();
      confetti({
        particleCount: 35,
        spread: 65,
        origin: { y: 0.6 },
        colors: choice === 'A' ? ['#06B6D4', '#3B82F6'] : ['#EC4899', '#A855F7'],
      });
    } catch {
      // Local fallback
      setVoteStats(votingService.getStats(activePrompt.id));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Allow other players in the party to cast their vote on the current card
  const handlePartyPlayerVote = async (playerName: string, choice: 'A' | 'B') => {
    if (!activePrompt || partyVotes[playerName]) return;
    soundEffects.playVoteSubmit();
    setPartyVotes(prev => ({ ...prev, [playerName]: choice }));
    try {
      const updatedStats = await votingService.recordVote(activePrompt.id, choice, playerName);
      setVoteStats(updatedStats);
    } catch {
      setVoteStats(votingService.getStats(activePrompt.id));
    }
  };

  const nextCard = () => {
    soundEffects.playCardFlip();
    setSelectedChoice(null);
    setVoteStats(null);
    setPartyVotes({});
    if (players.length > 0) {
      setPlayerIndex(prev => (prev + 1) % players.length);
    }
    const nextIdx = (currentIndex + 1) % prompts.length;
    setCurrentIndex(nextIdx);
    const nextP = prompts[nextIdx] || prompts[0];
    const rolled = rollForLegendaryCard(nextP, nextP.category || 'medium', 'would-you-rather', 0.02, nextP?.playMode);
    setActivePrompt(rolled);
  };

  // Filter recent voters who chose Option A vs Option B
  const votersA = voteStats?.recentVoters?.filter(v => v.choice === 'A') || [];
  const votersB = voteStats?.recentVoters?.filter(v => v.choice === 'B') || [];
  const allSavedPlayers: SavedPlayerInfo[] = votingService.getAllPlayers();

  if (!activePrompt) return <RemovedPrompt onNext={nextCard} />;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col items-center gap-6">
      
      {/* Top Banner: Turn Indicator, Player Name & Community Players Roster */}
      <div className="w-full flex items-center justify-between flex-wrap gap-3 px-2">
        {/* Active Player / Persona Badge */}
        <div className="flex items-center gap-2">
          {players.length > 0 ? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-black shadow-neon-cyan/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Turn:</span>
              <span className="text-white uppercase tracking-wider">{activePlayerName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Playing as:</span>
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempNameInput}
                    onChange={(e) => setTempNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveCustomName()}
                    autoFocus
                    maxLength={20}
                    className="bg-black/80 border border-cyan-400 rounded px-2 py-0.5 text-xs text-white focus:outline-none w-28 font-bold"
                  />
                  <button
                    onClick={handleSaveCustomName}
                    className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">{customName}</span>
                  <button
                    onClick={() => {
                      setTempNameInput(customName);
                      setIsEditingName(true);
                    }}
                    title="Change your player name"
                    className="text-zinc-400 hover:text-cyan-300 transition-colors p-0.5 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Saved Players Roster Button */}
        <button
          onClick={() => setShowRosterModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/70 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-purple-400" />
          <span>Players Roster</span>
          {allSavedPlayers.length > 0 && (
            <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 rounded-full text-[10px] font-bold border border-purple-500/30">
              {allSavedPlayers.length}
            </span>
          )}
        </button>
      </div>

      {/* Question Header & Legendary Badge */}
      <div className="text-center flex flex-col items-center gap-2">
        {isLegendary ? (
          <LegendaryCardBadge title={activePrompt.legendaryTitle || '★ LEGENDARY SHOWDOWN ★'} size="lg" />
        ) : (
          <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-neon-cyan/20">
            Would You Rather
          </span>
        )}
        {currentIndex === 0 && (
          <h3 className="text-sm sm:text-base text-zinc-300 font-medium mt-1">
            Make your choice — results reveal how all other players voted!
          </h3>
        )}
      </div>

      {/* Choice Grid: Option A vs Option B */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 my-1">
        
        {/* OPTION A */}
        <button
          onClick={() => handleVote('A')}
          disabled={!!selectedChoice}
          className={`group relative p-5 sm:p-10 md:p-12 min-h-[200px] sm:min-h-[380px] md:min-h-[440px] rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center transition-all duration-300 active:scale-[0.98] ${
            selectedChoice ? 'cursor-default' : 'cursor-pointer'
          } ${
            isLegendary
              ? selectedChoice === 'A'
                ? 'border-2 border-yellow-400 bg-yellow-950/60 shadow-[0_0_50px_rgba(250,204,21,0.7)] ring-2 ring-yellow-400 scale-[1.02]'
                : 'border-2 border-yellow-400/80 hover:border-yellow-300 bg-yellow-950/20 hover:bg-yellow-950/40 shadow-[0_0_35px_rgba(250,204,21,0.4)]'
              : selectedChoice === 'A'
              ? 'border-cyan-400 bg-cyan-950/50 shadow-neon-cyan ring-2 ring-cyan-400/60 scale-[1.02]'
              : 'border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-neon-cyan/40 bg-cyan-950/15'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border ${
              isLegendary
                ? 'text-yellow-300 bg-yellow-950 border-yellow-400/50 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                : 'text-cyan-300 bg-cyan-950 border-cyan-500/40'
            }`}>
              Option A
            </span>
            {selectedChoice === 'A' && (
              <span className="flex items-center gap-1.5 text-xs font-black text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/40 animate-scale-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your Pick</span>
              </span>
            )}
          </div>

          <p className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-snug sm:leading-tight my-4 sm:my-6 flex-1 flex items-center justify-center ${
            isLegendary ? 'text-yellow-100 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'text-white'
          }`}>
            {activePrompt?.optionA || activePrompt?.text}
          </p>

          {/* Voting percentage bar & what other people picked */}
          {voteStats && (
            <div className="w-full mt-3 sm:mt-4 animate-fade-in flex flex-col gap-2">
              <div className="flex justify-between items-baseline text-xs sm:text-sm font-black text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>{voteStats.optionACount.toLocaleString()} players</span>
                </span>
                <span className="text-2xl sm:text-4xl font-black">{voteStats.optionAPercentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 sm:h-4 rounded-full bg-black/70 overflow-hidden border border-white/15">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isLegendary ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${voteStats.optionAPercentage}%` }}
                />
              </div>

              {/* Who chose Option A */}
              <div className="w-full mt-2 pt-2.5 border-t border-cyan-500/20 text-left">
                <span className="text-[10px] sm:text-xs font-bold text-cyan-300 block mb-1.5">
                  People who chose Option A:
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {votersA.slice(0, 5).map((voter, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        voter.name === activePlayerName
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50'
                          : 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300/90'
                      }`}
                    >
                      {voter.name}
                    </span>
                  ))}
                  {voteStats.optionACount > votersA.slice(0, 5).length && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-zinc-400">
                      +{ (voteStats.optionACount - votersA.slice(0, 5).length).toLocaleString() } others
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </button>

        {/* OPTION B */}
        <button
          onClick={() => handleVote('B')}
          disabled={!!selectedChoice}
          className={`group relative p-5 sm:p-10 md:p-12 min-h-[200px] sm:min-h-[380px] md:min-h-[440px] rounded-3xl sm:rounded-4xl glass-panel border flex flex-col justify-between items-center text-center transition-all duration-300 active:scale-[0.98] ${
            selectedChoice ? 'cursor-default' : 'cursor-pointer'
          } ${
            isLegendary
              ? selectedChoice === 'B'
                ? 'border-2 border-yellow-400 bg-yellow-950/60 shadow-[0_0_50px_rgba(250,204,21,0.7)] ring-2 ring-yellow-400 scale-[1.02]'
                : 'border-2 border-yellow-400/80 hover:border-yellow-300 bg-yellow-950/20 hover:bg-yellow-950/40 shadow-[0_0_35px_rgba(250,204,21,0.4)]'
              : selectedChoice === 'B'
              ? 'border-pink-400 bg-pink-950/50 shadow-neon-pink ring-2 ring-pink-400/60 scale-[1.02]'
              : 'border-pink-500/30 hover:border-pink-400/70 hover:shadow-neon-pink/40 bg-pink-950/15'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border ${
              isLegendary
                ? 'text-yellow-300 bg-yellow-950 border-yellow-400/50 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                : 'text-pink-300 bg-pink-950 border-pink-500/40'
            }`}>
              Option B
            </span>
            {selectedChoice === 'B' && (
              <span className="flex items-center gap-1.5 text-xs font-black text-pink-400 bg-pink-950/80 px-2.5 py-1 rounded-full border border-pink-500/40 animate-scale-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your Pick</span>
              </span>
            )}
          </div>

          <p className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-snug sm:leading-tight my-4 sm:my-6 flex-1 flex items-center justify-center ${
            isLegendary ? 'text-yellow-100 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'text-white'
          }`}>
            {activePrompt?.optionB || 'Live with the consequences of Option A'}
          </p>

          {/* Voting percentage bar & what other people picked */}
          {voteStats && (
            <div className="w-full mt-3 sm:mt-4 animate-fade-in flex flex-col gap-2">
              <div className="flex justify-between items-baseline text-xs sm:text-sm font-black text-pink-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-pink-400" />
                  <span>{voteStats.optionBCount.toLocaleString()} players</span>
                </span>
                <span className="text-2xl sm:text-4xl font-black">{voteStats.optionBPercentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 sm:h-4 rounded-full bg-black/70 overflow-hidden border border-white/15">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isLegendary ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'
                  }`}
                  style={{ width: `${voteStats.optionBPercentage}%` }}
                />
              </div>

              {/* Who chose Option B */}
              <div className="w-full mt-2 pt-2.5 border-t border-pink-500/20 text-left">
                <span className="text-[10px] sm:text-xs font-bold text-pink-300 block mb-1.5">
                  People who chose Option B:
                </span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {votersB.slice(0, 5).map((voter, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        voter.name === activePlayerName
                          ? 'bg-pink-500/20 border-pink-400 text-pink-200 ring-1 ring-pink-400/50'
                          : 'bg-pink-950/80 border-pink-500/30 text-pink-300/90'
                      }`}
                    >
                      {voter.name}
                    </span>
                  ))}
                  {voteStats.optionBCount > votersB.slice(0, 5).length && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-zinc-400">
                      +{ (voteStats.optionBCount - votersB.slice(0, 5).length).toLocaleString() } others
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </button>

      </div>

      {/* Community Outcome Verdict Banner */}
      {voteStats && selectedChoice && (
        <div className="w-full max-w-3xl p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 bg-zinc-950/85 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left animate-fade-in shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              (selectedChoice === 'A' && voteStats.optionAPercentage > 50) || (selectedChoice === 'B' && voteStats.optionBPercentage > 50)
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-neon-cyan/30'
                : voteStats.optionAPercentage === 50
                ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 shadow-neon-violet/30'
                : 'bg-pink-950/80 border-pink-500/50 text-pink-300 shadow-neon-pink/30'
            }`}>
              {((selectedChoice === 'A' && voteStats.optionAPercentage > 50) || (selectedChoice === 'B' && voteStats.optionBPercentage > 50)) ? (
                <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
              ) : voteStats.optionAPercentage === 50 ? (
                <Scale className="w-6 h-6 text-purple-400" />
              ) : (
                <Flame className="w-6 h-6 text-orange-400" />
              )}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white">
                {selectedChoice === 'A' && voteStats.optionAPercentage > 50 && (
                  <span>🏆 Majority Decision: <span className="text-cyan-300">{voteStats.optionAPercentage}%</span> of players chose Option A with you!</span>
                )}
                {selectedChoice === 'B' && voteStats.optionBPercentage > 50 && (
                  <span>🏆 Majority Decision: <span className="text-pink-300">{voteStats.optionBPercentage}%</span> of players chose Option B with you!</span>
                )}
                {selectedChoice === 'A' && voteStats.optionAPercentage < 50 && (
                  <span>⚡ Rebel Pick: You went against the grain! Only <span className="text-cyan-300">{voteStats.optionAPercentage}%</span> chose Option A.</span>
                )}
                {selectedChoice === 'B' && voteStats.optionBPercentage < 50 && (
                  <span>⚡ Rebel Pick: You went against the grain! Only <span className="text-pink-300">{voteStats.optionBPercentage}%</span> chose Option B.</span>
                )}
                {voteStats.optionAPercentage === 50 && (
                  <span>⚖️ Dead 50/50 Split: Exactly half of all players chose Option A and half chose Option B!</span>
                )}
              </h4>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                Total participation: {voteStats.totalVotes.toLocaleString()} people have played this dilemma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Updated live</span>
          </div>
        </div>
      )}

      {/* Party Multi-Player Voting Bar (When 2+ players are present) */}
      {selectedChoice && players.length > 1 && (
        <div className="w-full max-w-3xl p-4 sm:p-5 rounded-3xl bg-zinc-950/90 border border-white/10 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Party Voting Breakdown</span>
            </span>
            <span className="text-[11px] text-zinc-400">
              Tap to record everyone's pick
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {players.map((player) => {
              const currentPChoice = partyVotes[player];
              return (
                <div
                  key={player}
                  className="flex items-center gap-2 bg-zinc-900/90 px-3.5 py-2 rounded-2xl border border-white/10"
                >
                  <span className="text-xs font-bold text-white">{player}:</span>
                  {currentPChoice ? (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      currentPChoice === 'A'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-neon-cyan/20'
                        : 'bg-pink-950 text-pink-300 border-pink-500/40 shadow-neon-pink/20'
                    }`}>
                      Option {currentPChoice}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePartyPlayerVote(player, 'A')}
                        className="px-2 py-0.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-[10px] font-black border border-cyan-500/40 cursor-pointer active:scale-95"
                      >
                        A
                      </button>
                      <button
                        onClick={() => handlePartyPlayerVote(player, 'B')}
                        className="px-2 py-0.5 rounded-lg bg-pink-950/80 hover:bg-pink-900 text-pink-300 text-[10px] font-black border border-pink-500/40 cursor-pointer active:scale-95"
                      >
                        B
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Card Button */}
      {selectedChoice && (
        <button
          onClick={nextCard}
          className="px-10 sm:px-14 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-black text-base sm:text-lg shadow-2xl flex items-center gap-3 transition-all active:scale-95 animate-scale-in cursor-pointer"
        >
          <span>Next Dilemma</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Card Rating & Report Bar */}
      <div className="w-full max-w-md mt-2">
        <CardRatingBar prompt={activePrompt} />
      </div>

      {/* Modal: All Community Players Roster */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 bg-zinc-950 flex flex-col gap-4 max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-black text-white">Would You Rather Players</h3>
              </div>
              <button
                onClick={() => setShowRosterModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Everyone who has played and voted in Would You Rather on this device and community sessions:
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {allSavedPlayers.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No saved player history yet. Pick a card to record your first vote!
                </div>
              ) : (
                allSavedPlayers.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white text-sm">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30 text-[10px]">
                        {player.totalVotes} votes cast
                      </span>
                      <span className="text-zinc-500 text-[10px]">
                        {new Date(player.lastPlayed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowRosterModal(false)}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
