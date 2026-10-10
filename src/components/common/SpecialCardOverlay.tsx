import React, { useEffect } from 'react';
import { SpecialCard } from '../../types/specialCard';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Users,
  RotateCcw,
  Crosshair,
  Zap,
  Flame,
  HelpCircle,
  Shuffle,
  Crown,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';

interface SpecialCardOverlayProps {
  card: SpecialCard;
  activePlayerName?: string;
  onAccept: () => void;
  onSkip: () => void;
}

export const SpecialCardOverlay: React.FC<SpecialCardOverlayProps> = ({
  card,
  activePlayerName,
  onAccept,
  onSkip,
}) => {
  useEffect(() => {
    if (card.rarity === 'legendary') {
      soundEffects.playLegendaryCard();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#EF4444', '#D946EF', '#10B981'],
      });
    } else {
      soundEffects.playRareCard();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: [card.themeColor, '#FFFFFF'],
      });
    }
  }, [card]);

  const getIcon = () => {
    const props = { className: 'w-10 h-10', style: { color: card.themeColor } };
    switch (card.iconName) {
      case 'Users': return <Users {...props} />;
      case 'RotateCcw': return <RotateCcw {...props} />;
      case 'Crosshair': return <Crosshair {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'HelpCircle': return <HelpCircle {...props} />;
      case 'Shuffle': return <Shuffle {...props} />;
      case 'Crown': return <Crown {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const isLegendary = card.rarity === 'legendary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      {/* Background radial blast */}
      <div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-30 ${
          isLegendary ? 'bg-amber-400 animate-pulse' : 'bg-brand-pink'
        }`}
      />

      <div
        className={`w-full max-w-lg rounded-3xl glass-panel p-8 sm:p-10 text-center relative border transition-all duration-300 animate-scale-in flex flex-col items-center ${card.glowClass}`}
        style={{
          boxShadow: isLegendary
            ? '0 0 60px rgba(245,158,11,0.5), inset 0 0 30px rgba(245,158,11,0.2)'
            : `0 0 45px ${card.themeColor}40`,
        }}
      >
        {/* Rarity Pill Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border"
          style={{
            color: card.themeColor,
            borderColor: `${card.themeColor}60`,
            backgroundColor: `${card.themeColor}15`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{card.badgeText}</span>
        </div>

        {/* Big Icon */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border shadow-lg"
          style={{
            borderColor: `${card.themeColor}50`,
            backgroundColor: `${card.themeColor}20`,
          }}
        >
          {getIcon()}
        </div>

        {/* Title */}
        <h2
          className="text-3xl sm:text-4xl font-black uppercase tracking-wide mb-3"
          style={{ color: card.themeColor, textShadow: `0 0 25px ${card.themeColor}60` }}
        >
          {card.title}
        </h2>

        {/* Target player if available */}
        {activePlayerName && (
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-4">
            Drawn by <span className="text-white">{activePlayerName}</span>
          </p>
        )}

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 max-w-md font-medium">
          {card.description}
        </p>

        {/* Effect Highlight Card */}
        <div
          className="w-full p-4 rounded-2xl border text-left mb-8"
          style={{
            borderColor: `${card.themeColor}40`,
            backgroundColor: `${card.themeColor}10`,
          }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
            Special Rule Effect:
          </span>
          <p className="text-xs sm:text-sm font-bold text-white">
            {card.effect}
          </p>
          <span className="text-[11px] font-bold text-amber-300 block mt-2">
            ★ +{card.pointsAwarded} Bonus Points awarded
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onSkip}
            className="flex-1 py-3.5 rounded-2xl border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            Pass / Skip Card
          </button>

          <button
            onClick={onAccept}
            className="flex-1 py-3.5 rounded-2xl text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            style={{
              backgroundColor: card.themeColor,
              boxShadow: `0 0 25px ${card.themeColor}60`,
            }}
          >
            <span>Accept Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

