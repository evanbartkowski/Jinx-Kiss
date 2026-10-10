import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, User, Layers, Shield, LogOut, Volume2, History, Play } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050505]/80 border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="cursor-pointer group flex flex-col justify-center select-none"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-brand-gradient drop-shadow-[0_0_12px_rgba(255,77,166,0.35)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.55)] transition-all">
              JINX KISS
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-ping hidden sm:inline-block" />
          </div>
          <span className="text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide">
            Good friends. Bad decisions.
          </span>
        </div>

        {/* Navigation & User actions */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          
          {/* Quick Play link */}
          {onQuickPlay && (
            <button
              onClick={onQuickPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white shadow-neon-pink/30 hover:shadow-neon-pink/50 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Quick Play</span>
              <span className="sm:hidden">Play</span>
            </button>
          )}

          {/* Party Mode link */}
          <button
            onClick={() => onNavigate('party-setup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentView === 'party-setup' || currentView === 'party-game'
                ? 'bg-brand-pink/20 text-pink-300 border border-brand-pink/50 shadow-neon-pink/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-pink" />
            <span className="hidden sm:inline">Party Mode</span>
          </button>

          {/* Multiplayer Rooms link */}
          <button
            onClick={() => onNavigate('multiplayer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentView === 'multiplayer'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/50 shadow-neon-violet/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span className="hidden md:inline">Multiplayer</span> Rooms
          </button>

          {/* Custom Decks link for logged-in users */}
          {isAuthenticated && (
            <button
              onClick={() => onNavigate('my-decks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentView === 'my-decks'
                  ? 'bg-brand-pink/15 text-pink-300 border border-brand-pink/30 shadow-neon-pink/20'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Layers className="w-4 h-4 text-brand-pink" />
              <span className="hidden lg:inline">My Decks</span>
            </button>
          )}

          {/* Admin link for admin users */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentView === 'admin'
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40 shadow-neon-violet/30'
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
              onClick={onOpenHistory}
              title="Game History & Saved Sessions"
              aria-label="Game History"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all active:scale-95"
            >
              <History className="w-4 h-4 text-purple-400" />
              <span className="hidden md:inline">History</span>
            </button>
          )}

          {/* Audio Settings Modal Trigger */}
          {onOpenAudio && (
            <button
              onClick={onOpenAudio}
              title="Audio & Ambient Music"
              aria-label="Audio Settings"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-pink-400" />
            </button>
          )}

          {/* Auth Button */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                  currentView === 'profile'
                    ? 'border-brand-violet/50 bg-brand-violet/10 text-white shadow-neon-violet/20'
                    : 'border-white/10 bg-zinc-900/60 text-zinc-200 hover:border-white/20 hover:bg-zinc-800/60'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-pink to-brand-violet flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-brand-pink/20 to-brand-violet/20 border border-brand-pink/30 hover:border-brand-pink/60 text-pink-200 hover:text-white shadow-sm hover:shadow-neon-pink/30 transition-all active:scale-95"
            >
              <User className="w-4 h-4 text-brand-pink" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

