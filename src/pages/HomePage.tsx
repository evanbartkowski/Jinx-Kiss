import React, { useState } from 'react';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { GameId } from '../types/game';
import { CustomDeck } from '../types/deck';
import { CommunityDecksSection } from '../components/decks/CommunityDecksSection';
import { sessionService, GameSession } from '../services/sessionService';
import {
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
  ArrowRight,
  Play,
  QrCode,
  ChevronDown,
  ChevronUp,
  Shuffle,
  History,
} from 'lucide-react';

interface HomePageProps {
  onSelectGame: (gameId: GameId) => void;
  onPlayDeck: (deck: CustomDeck) => void;
  onStartPartyMode?: () => void;
  onOpenMultiplayer?: () => void;
  onQuickPlay?: () => void;
  onResumeSession?: (session: GameSession) => void;
  onOpenHistory?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectGame,
  onPlayDeck,
  onStartPartyMode,
  onOpenMultiplayer,
  onQuickPlay,
  onResumeSession,
  onOpenHistory,
}) => {
  const [showCommunityDecks, setShowCommunityDecks] = useState(false);
  const [activeSession, setActiveSession] = useState<GameSession | null>(() =>
    sessionService.getActiveSession()
  );

  const getIcon = (name: string, color: string) => {
    const props = { className: 'w-7 h-7 sm:w-8 sm:h-8', style: { color } };
    switch (name) {
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
      case 'Shuffle': return <Shuffle {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const gameList = Object.values(GAMES_CONFIG);

  return (
    <div className="w-full flex flex-col items-center pb-12">
      {/* Top Quick Actions Bar */}
      <div className="w-full px-4 sm:px-8 xl:px-12 pt-6 pb-6 flex flex-wrap items-center justify-center sm:justify-between gap-4 border-b border-white/[0.06] mb-8">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Live Party Gaming
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <History className="w-4 h-4 text-purple-400" />
              <span>History</span>
            </button>
          )}

          {onQuickPlay && (
            <button
              onClick={onQuickPlay}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-neon-pink flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Quick Play (Instant Party)</span>
            </button>
          )}

          {onOpenMultiplayer && (
            <button
              onClick={onOpenMultiplayer}
              className="px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>Multiplayer Rooms</span>
            </button>
          )}
        </div>
      </div>

      {/* Resume Game Spotlight Banner */}
      {activeSession && onResumeSession && (
        <div className="w-full px-4 sm:px-8 xl:px-12 mb-8 animate-fade-in">
          <div
            onClick={() => onResumeSession(activeSession)}
            className="w-full p-6 sm:p-7 rounded-3xl glass-panel border border-brand-violet/50 hover:border-brand-violet bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-black/80 shadow-neon-violet/30 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:scale-[1.005] active:scale-[0.995] relative overflow-hidden"
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-transparent pointer-events-none" />

            <div className="flex items-center gap-5 z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-violet/20 border border-brand-violet/50 flex items-center justify-center text-brand-violet shadow-neon-violet shrink-0">
                <History className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-violet text-white shadow-neon-violet/40">
                    Saved Session
                  </span>
                  <span className="text-xs text-purple-300/80 font-bold">
                    Round {activeSession.currentRound} • Category: {activeSession.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                  {activeSession.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mt-0.5">
                  {activeSession.mode === 'party'
                    ? 'Multi-game Party Mode engine'
                    : `Game: ${GAMES_CONFIG[activeSession.gameId]?.title || activeSession.gameId}`}
                  {activeSession.players && activeSession.players.length > 0 && ` • Players: ${activeSession.players.join(', ')}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 z-10 shrink-0">
              <span className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-violet via-pink-600 to-brand-pink text-white font-black text-xs sm:text-sm shadow-neon-violet flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Game</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sessionService.clearActiveSession();
                  setActiveSession(null);
                }}
                className="px-4 py-3 rounded-2xl bg-zinc-900/70 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white text-xs font-semibold transition-all active:scale-95"
                title="Dismiss and start fresh"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Party Mode Spotlight Banner */}
      {onStartPartyMode && (
        <div className="w-full px-4 sm:px-8 xl:px-12 mb-10">
          <div
            onClick={onStartPartyMode}
            className="w-full p-6 sm:p-8 rounded-3xl glass-panel border border-brand-pink/40 hover:border-brand-pink/70 shadow-neon-pink/30 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:scale-[1.005] active:scale-[0.995] relative overflow-hidden"
          >
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-transparent pointer-events-none" />

            <div className="flex items-center gap-5 z-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-pink/20 border border-brand-pink/50 flex items-center justify-center text-brand-pink shadow-neon-pink shrink-0">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-pink text-white">
                    Featured Mode
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">Continuous multi-game engine</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                  Party Mode with Chaos Wheel
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1">
                  Seamlessly rotates games every round. Spin the interactive neon Chaos Wheel, trigger surprise Mystery Cards, and crown the Party MVP.
                </p>
              </div>
            </div>

            <div className="z-10 shrink-0">
              <span className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet text-white font-black text-xs sm:text-sm shadow-neon-pink flex items-center gap-2">
                <span>Configure & Start</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Grid of 12 Game Cards */}
      <div className="w-full px-4 sm:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
              Browse All Games ({gameList.length})
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">
              Choose any standalone game or spin into full party action
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
            {gameList.length} Full Party Modes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {gameList.map((game) => {
            const isRedFlag = game.id === 'red-flag-green-flag';
            const isChaosMix = game.id === 'chaos-mix';

            if (isRedFlag) {
              return (
                <div
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className="group relative rounded-3xl glass-panel p-7 sm:p-8 min-h-[300px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] select-none border border-transparent overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(16, 185, 129, 0.12) 100%)',
                    boxShadow: '0 12px 35px -15px rgba(239, 68, 68, 0.35), 0 12px 35px -15px rgba(16, 185, 129, 0.35)',
                    borderImage: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(16, 185, 129, 0.8) 100%) 1',
                  }}
                >
                  {/* Split Background Ambient Glow */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-25 blur-2xl transition-opacity duration-500 pointer-events-none -z-10 bg-gradient-to-r from-red-600 via-transparent to-emerald-500" />

                  <div>
                    {/* Split Icon Container */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-between px-2.5 mb-6 border border-white/20 transition-transform duration-300 group-hover:scale-110 shadow-lg bg-gradient-to-r from-red-950/80 via-zinc-900 to-emerald-950/80">
                      <Flag className="w-5 h-5 text-red-500 fill-red-500/40" />
                      <div className="w-[1px] h-6 bg-white/20" />
                      <Flag className="w-5 h-5 text-emerald-400 fill-emerald-400/40" />
                    </div>

                    {/* Split Title */}
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide flex items-center gap-1.5 flex-wrap">
                      <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">Red Flag</span>
                      <span className="text-zinc-500 text-lg">/</span>
                      <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">Green Flag</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-2 leading-relaxed">
                      {game.tagline}
                    </p>
                  </div>

                  {/* Bottom Play Indicator with Dual Glow */}
                  <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Dealbreaker or Keeper?</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 bg-gradient-to-r from-red-500/25 to-emerald-500/25 text-emerald-300 border border-white/10">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            }

            if (isChaosMix) {
              return (
                <div
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className="group relative rounded-3xl glass-panel p-7 sm:p-8 min-h-[300px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] select-none border border-pink-500/40 hover:border-cyan-400/70 overflow-hidden"
                  style={{
                    boxShadow: '0 12px 35px -15px rgba(217, 70, 239, 0.4), 0 12px 35px -15px rgba(6, 182, 212, 0.3)',
                  }}
                >
                  {/* Multicolored Rainbow Ambient Glow */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none -z-10 bg-gradient-to-tr from-pink-500 via-purple-500 via-cyan-400 to-amber-300" />

                  <div>
                    {/* Multicolored Icon Container */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-pink-400/50 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_-3px_rgba(236,72,153,0.5)] bg-gradient-to-tr from-pink-950/60 via-purple-950/60 to-cyan-950/60">
                      <Shuffle className="w-7 h-7 sm:w-8 sm:h-8 text-pink-300" />
                    </div>

                    {/* Multicolored Title */}
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide bg-gradient-to-r from-pink-400 via-purple-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                      {game.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-2 leading-relaxed">
                      {game.tagline}
                    </p>
                  </div>

                  {/* Bottom Play Indicator with Prismatic Accent */}
                  <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                    <span className="bg-gradient-to-r from-pink-400 to-cyan-300 bg-clip-text text-transparent font-bold">
                      All Games Mixed
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 bg-gradient-to-r from-pink-500/30 to-cyan-500/30 text-white border border-pink-500/30 shadow-neon-pink/20">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className="group relative rounded-3xl glass-panel border border-white/[0.08] hover:border-white/30 p-7 sm:p-8 min-h-[300px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] select-none"
                style={{
                  boxShadow: `0 10px 30px -15px ${game.themeColor}33`,
                }}
              >
                {/* Subtle Ambient Light behind card */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500 pointer-events-none -z-10"
                  style={{ backgroundColor: game.themeColor }}
                />

                <div>
                  {/* Icon Container */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${game.themeColor}18`,
                      borderColor: `${game.themeColor}40`,
                      boxShadow: `0 0 20px -3px ${game.themeColor}40`,
                    }}
                  >
                    {getIcon(game.iconName, game.themeColor)}
                  </div>

                  {/* Colored Title */}
                  <h3
                    className="text-xl sm:text-2xl font-black uppercase tracking-wide transition-colors"
                    style={{ color: game.themeColor }}
                  >
                    {game.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-2 leading-relaxed">
                    {game.tagline}
                  </p>
                </div>

                {/* Bottom Play Indicator */}
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                  <span>Play Standalone</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                    style={{ backgroundColor: `${game.themeColor}25`, color: game.themeColor }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Decks Collapsible Dropdown Section at the Bottom */}
      <div className="w-full px-4 sm:px-8 xl:px-12 mt-12">
        <button
          onClick={() => setShowCommunityDecks(!showCommunityDecks)}
          className="w-full py-5 px-6 sm:px-8 rounded-3xl glass-panel border border-white/10 hover:border-brand-violet/50 flex items-center justify-between transition-all duration-300 group shadow-lg cursor-pointer bg-white/[0.02] hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet group-hover:text-pink-400 transition-colors shadow-neon-violet/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-base sm:text-lg font-black text-white group-hover:text-pink-300 transition-colors block">
                Community Decks & Custom Creations
              </span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                {showCommunityDecks
                  ? 'Click to collapse community decks'
                  : 'Click to expand and explore custom player-created decks'}
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 group-hover:text-white transition-all group-hover:scale-105">
            {showCommunityDecks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showCommunityDecks && (
          <div className="mt-4 animate-fade-in">
            <CommunityDecksSection onPlayDeck={onPlayDeck} />
          </div>
        )}
      </div>
    </div>
  );
};
