import React from 'react';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { GameId } from '../types/game';
import { CustomDeck } from '../types/deck';
import { CommunityDecksSection } from '../components/decks/CommunityDecksSection';
import { Flame, Sparkles, SplitSquareVertical, Zap, Disc3, Flag, Wine, Crosshair, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onSelectGame: (gameId: GameId) => void;
  onPlayDeck: (deck: CustomDeck) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame, onPlayDeck }) => {
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
      default: return <Sparkles {...props} />;
    }
  };

  const gameList = Object.values(GAMES_CONFIG);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Header */}
      <div className="text-center pt-8 pb-12 px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/30 text-pink-300 text-xs font-semibold mb-4 shadow-neon-pink/20 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
          <span>Eight Interactive Party Games</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
          Unleash <span className="text-brand-gradient">The Night</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          The ultimate social gaming platform for friends, couples, and parties. Secrets, dares, heated debates, and unapologetic fun on a single shared screen.
        </p>
      </div>

      {/* Responsive Grid of 8 Game Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
                <span>Play Now</span>
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
