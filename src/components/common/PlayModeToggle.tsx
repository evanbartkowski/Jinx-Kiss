import React from 'react';
import { useGameSettings } from '../../context/GameSettingsContext';
import { Users, Globe } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface PlayModeToggleProps {
  className?: string;
  compact?: boolean;
}

export const PlayModeToggle: React.FC<PlayModeToggleProps> = ({ className = '', compact = false }) => {
  const { playMode, setPlayMode } = useGameSettings();

  const handleToggle = (mode: 'in-person' | 'online') => {
    if (playMode === mode) return;
    soundEffects.playClick();
    setPlayMode(mode);
  };

  const isInPerson = playMode === 'in-person';

  return (
    <div
      className={`relative inline-flex items-center p-1 rounded-2xl bg-zinc-950/80 border border-white/[0.08] backdrop-blur-md shadow-inner transition-all select-none ${className}`}
      role="group"
      aria-label="Game Play Mode"
    >
      {/* Sliding Active Pill Background */}
      <div
        className={`absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out pointer-events-none ${
          isInPerson
            ? 'left-1 w-[calc(50%-4px)] bg-gradient-to-r from-brand-pink/30 via-pink-600/25 to-purple-600/25 border border-brand-pink/60 shadow-[0_0_15px_rgba(255,77,166,0.35)]'
            : 'left-[calc(50%)] w-[calc(50%-4px)] bg-gradient-to-r from-cyan-500/30 via-blue-600/25 to-indigo-600/25 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        }`}
      />

      {/* In-Person Option */}
      <button
        type="button"
        onClick={() => handleToggle('in-person')}
        title="In-Person: Prompts designed for hanging out in the same room"
        aria-pressed={isInPerson}
        className={`relative z-10 flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
          isInPerson
            ? 'text-pink-100 drop-shadow-[0_0_8px_rgba(255,77,166,0.6)]'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Users className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isInPerson ? 'text-brand-pink scale-110 drop-shadow-[0_0_6px_rgba(255,77,166,0.8)]' : 'text-zinc-400'}`} />
        <span className={compact ? 'hidden xs:inline' : 'inline'}>
          In Person
        </span>
      </button>

      {/* Online Option */}
      <button
        type="button"
        onClick={() => handleToggle('online')}
        title="Online: Prompts designed for Discord, video calls & remote group hangouts"
        aria-pressed={!isInPerson}
        className={`relative z-10 flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
          !isInPerson
            ? 'text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Globe className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${!isInPerson ? 'text-cyan-400 scale-110 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] animate-pulse' : 'text-zinc-400'}`} />
        <span className={compact ? 'hidden xs:inline' : 'inline'}>
          Online
        </span>
      </button>
    </div>
  );
};
