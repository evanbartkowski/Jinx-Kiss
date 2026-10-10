import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGameSettings } from '../../context/GameSettingsContext';
import { PlayModeToggle } from '../common/PlayModeToggle';
import { Sparkles, User, Layers, Shield, LogOut, Volume2, History, Play, Heart } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAudio?: () => void;
  onOpenHistory?: () => void;
  onQuickPlay?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAudio,
  onOpenHistory,
  onQuickPlay,
}) => {
  const { currentUser, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();
  const { playMode } = useGameSettings();
  const isOnline = playMode === 'online';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050505]/85 border-b transition-colors duration-500 ${
      isOnline ? 'border-cyan-500/25 shadow-[0_4px_25px_-5px_rgba(6,182,212,0.15)]' : 'border-white/[0.06]'
    }`}>
      <div className="w-full px-4 sm:px-8 xl:px-12 h-20 flex items-center justify-between">
        
        {/* Brand / Logo + Mode indicator */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div 
            onClick={() => {
              soundEffects.playClick();
              onNavigate('home');
            }}
            className="cursor-pointer group flex flex-col justify-center select-none"
          >
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-wider uppercase transition-all duration-500 ${
                isOnline
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.45)] group-hover:drop-shadow-[0_0_22px_rgba(59,130,246,0.65)]'
                  : 'text-brand-gradient drop-shadow-[0_0_12px_rgba(255,77,166,0.35)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.55)]'
              }`}>
                JINX KISS
              </h1>
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 group-hover:scale-125 ${
                isOnline
                  ? 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_14px_rgba(6,182,212,0.9)] animate-pulse'
                  : 'text-brand-pink fill-brand-pink drop-shadow-[0_0_14px_rgba(255,77,166,0.9)] animate-pulse'
              }`} />
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide">
              {isOnline ? 'Good friends. Bad decisions. (Remote)' : 'Good friends. Bad decisions.'}
            </span>
          </div>

          {/* Desktop/Tablet PlayModeToggle beside logo */}
          <div className="hidden md:flex items-center">
            <PlayModeToggle />
          </div>
        </div>

        {/* Navigation & User actions */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          
          {/* Mobile PlayModeToggle */}
          <div className="md:hidden mr-1">
            <PlayModeToggle compact />
          </div>

          {/* Quick Play link */}
          {onQuickPlay && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onQuickPlay();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all active:scale-95 ${
                isOnline
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                  : 'bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 shadow-neon-pink/30 hover:shadow-neon-pink/50'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Quick Play</span>
              <span className="sm:hidden">Play</span>
            </button>
          )}

          {/* Party Mode link */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('party-setup');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentView === 'party-setup' || currentView === 'party-game'
                ? isOnline
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-brand-pink/20 text-pink-300 border border-brand-pink/50 shadow-neon-pink/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-brand-pink'}`} />
            <span className="hidden sm:inline">Party Mode</span>
          </button>

          {/* Multiplayer Rooms link */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('multiplayer');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentView === 'multiplayer'
                ? isOnline
                  ? 'bg-blue-950/60 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-purple-950/60 text-purple-300 border border-purple-500/50 shadow-neon-violet/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span className="hidden md:inline">Multiplayer</span> Rooms
          </button>

          {/* Custom Decks link for logged-in users */}
          {isAuthenticated && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('my-decks');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentView === 'my-decks'
                  ? isOnline
                    ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-brand-pink/15 text-pink-300 border border-brand-pink/30 shadow-neon-pink/20'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Layers className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-brand-pink'}`} />
              <span className="hidden lg:inline">My Decks</span>
            </button>
          )}

          {/* Admin link for admin users */}
          {isAdmin && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentView === 'admin'
                  ? isOnline
                    ? 'bg-blue-950/60 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-purple-950/60 text-purple-300 border border-purple-500/40 shadow-neon-violet/30'
                  : 'text-purple-300 hover:text-purple-200 hover:bg-purple-950/40 border border-purple-500/20'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Session History Modal Trigger */}
          {onOpenHistory && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenHistory();
              }}
              title="Game History & Saved Sessions"
              aria-label="Game History"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all active:scale-95"
            >
              <History className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-purple-400'}`} />
              <span className="hidden md:inline">History</span>
            </button>
          )}

          {/* Audio Settings Modal Trigger */}
          {onOpenAudio && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAudio();
              }}
              title="Audio & Ambient Music"
              aria-label="Audio Settings"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all active:scale-95"
            >
              <Volume2 className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-pink-400'}`} />
            </button>
          )}

          {/* Auth Button */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                  currentView === 'profile'
                    ? isOnline
                      ? 'border-cyan-400/50 bg-cyan-950/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'border-brand-violet/50 bg-brand-violet/10 text-white shadow-neon-violet/20'
                    : 'border-white/10 bg-zinc-900/60 text-zinc-200 hover:border-white/20 hover:bg-zinc-800/60'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm ${
                  isOnline
                    ? 'bg-gradient-to-tr from-cyan-400 to-blue-600'
                    : 'bg-gradient-to-tr from-brand-pink to-brand-violet'
                }`}>
                  {currentUser.username.substring(0, 1).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.username}</span>
              </button>

              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                isOnline
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 hover:border-cyan-400/60 text-cyan-200 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-gradient-to-r from-brand-pink/20 to-brand-violet/20 border border-brand-pink/30 hover:border-brand-pink/60 text-pink-200 hover:text-white shadow-sm hover:shadow-neon-pink/30'
              }`}
            >
              <User className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-brand-pink'}`} />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

