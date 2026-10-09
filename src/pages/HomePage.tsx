import React from 'react';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { GameId } from '../types/game';
import { CustomDeck } from '../types/deck';
import { CommunityDecksSection } from '../components/decks/CommunityDecksSection';
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
} from 'lucide-react';

interface HomePageProps {
  onSelectGame: (gameId: GameId) => void;
  onPlayDeck: (deck: CustomDeck) => void;
  onStartPartyMode?: () => void;
  onOpenMultiplayer?: () => void;
  onQuickPlay?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectGame,
  onPlayDeck,
  onStartPartyMode,
  onOpenMultiplayer,
  onQuickPlay,
}) => {
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
      default: return <Sparkles {...props} />;
    }
  };

  const gameList = Object.values(GAMES_CONFIG);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Header */}
      <div className="text-center pt-8 pb-10 px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/30 text-pink-300 text-xs font-semibold mb-4 shadow-neon-pink/20 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
          <span>Twelve Interactive Party Games & Multiplayer</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
          Unleash <span className="text-brand-gradient">The Night</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
          The ultimate social gaming platform for friends, couples, and parties. Continuous Party Mode, live phone multiplayer rooms, Chaos Wheel spins, and zero boring moments.
        </p>

        {/* Quick Actions (Quick Play & Multiplayer Rooms) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          {onQuickPlay && (
            <button
              onClick={onQuickPlay}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-neon-pink flex items-center gap-2.5 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Quick Play (Instant Party)</span>
            </button>
          )}

          {onOpenMultiplayer && (
            <button
              onClick={onOpenMultiplayer}
              className="px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all active:scale-95 shadow-md"
            >
              <QrCode className="w-5 h-5 text-purple-400" />
              <span>Multiplayer Rooms</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Party Mode Spotlight Banner */}
      {onStartPartyMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-10">
          <div
            onClick={onStartPartyMode}
            className="w-full p-6 sm:p-8 rounded-3xl glass-panel border border-brand-pink/40 hover:border-brand-pink/70 shadow-neon-pink/30 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden"
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
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mt-1">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
            Browse All Games ({gameList.length})
          </h2>
          <span className="text-xs text-zinc-400 font-medium">Select any game to play standalone</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameList.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="group relative rounded-3xl glass-panel border border-white/[0.08] hover:border-white/30 p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] select-none"
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
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-110"
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
                  className="text-xl font-black uppercase tracking-wide transition-colors"
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
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                  style={{ backgroundColor: `${game.themeColor}25`, color: game.themeColor }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Decks Section */}
      <CommunityDecksSection onPlayDeck={onPlayDeck} />
    </div>
  );
};
