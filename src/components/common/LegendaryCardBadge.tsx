import React from 'react';
import { Sparkles, Crown } from 'lucide-react';

interface LegendaryCardBadgeProps {
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LegendaryCardBadge: React.FC<LegendaryCardBadgeProps> = ({
  title = '★ RARE LEGENDARY CARD ★',
  size = 'md',
}) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-gradient-to-r from-yellow-950/90 via-amber-900/90 to-yellow-950/90 shadow-[0_0_30px_rgba(250,204,21,0.7)] animate-pulse-slow backdrop-blur-md select-none ${
        isLg
          ? 'px-6 py-2.5 text-sm sm:text-base'
          : isSm
          ? 'px-3.5 py-1 text-[11px]'
          : 'px-5 py-2 text-xs sm:text-sm'
      }`}
    >
      <Crown className={`${isLg ? 'w-5 h-5' : isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]`} />
      <span className="font-black uppercase tracking-widest text-yellow-200 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]">
        {title}
      </span>
      <Sparkles className={`${isLg ? 'w-5 h-5' : isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-yellow-300 animate-spin-slow drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]`} />
    </div>
  );
};

