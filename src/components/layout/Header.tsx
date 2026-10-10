import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGameSettings } from '../../context/GameSettingsContext';
import { PlayModeToggle } from '../common/PlayModeToggle';
import { Sparkles, User, Layers, Shield, LogOut, Volume2, History, Play, Heart, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (view: string, param?: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(view, param);
  };

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

        {/* Desktop Navigation & User actions */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2.5">
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
              <span>Quick Play</span>
            </button>
          )}

          {/* Party Mode link */}
          <button
            onClick={() => {
              soundEffects.playClick();
              handleNav('party-setup');
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
            <span>Party Mode</span>
          </button>

          {/* Multiplayer Rooms link */}
          <button
            onClick={() => {
              soundEffects.playClick();
              handleNav('multiplayer');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentView === 'multiplayer'
                ? isOnline
                  ? 'bg-blue-950/60 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-purple-950/60 text-purple-300 border border-purple-500/50 shadow-neon-violet/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span>Multiplayer Rooms</span>
          </button>

          {/* Custom Decks link for logged-in users */}
          {isAuthenticated && (
            <button
              onClick={() => {
                soundEffects.playClick();
                handleNav('my-decks');
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
                handleNav('admin');
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
              <span>Admin</span>
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
              <span>History</span>
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
                onClick={() => handleNav('profile')}
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

        {/* Mobile Header Action Controls (Streamlined, zero overflow) */}
        <div className="md:hidden flex items-center gap-2">
          {/* Compact PlayMode Toggle */}
          <PlayModeToggle compact />

          {/* Quick Audio Mute / Settings Trigger on Mobile */}
          {onOpenAudio && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAudio();
              }}
              title="Audio"
              aria-label="Audio Settings"
              className="p-2 rounded-xl text-zinc-300 hover:text-white bg-white/[0.04] border border-white/10 active:scale-95 transition-all"
            >
              <Volume2 className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-pink-400'}`} />
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen)}
            }
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-zinc-200 hover:text-white bg-zinc-900/90 border border-white/15 active:scale-95 shadow-md transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Animated Dropdown Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full border-t border-white/[0.08] bg-[#09090d]/95 backdrop-blur-2xl px-4 py-4 flex flex-col gap-2.5 animate-fade-in shadow-2xl">
          {/* Quick Play */}
          {onQuickPlay && (
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsMobileMenuOpen(false);
                onQuickPlay();
              }}
              className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between text-sm font-black text-white shadow-lg active:scale-[0.98] transition-all ${
                isOnline
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                  : 'bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet shadow-neon-pink/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Play className="w-4 h-4 fill-white" />
                <span>Quick Play</span>
              </div>
              <span className="text-[11px] opacity-80 uppercase tracking-widest font-extrabold">Instant</span>
            </button>
          )}

          {/* Party Mode */}
          <button
            onClick={() => handleNav('party-setup')}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-sm font-bold border transition-all active:scale-[0.98] ${
              currentView === 'party-setup' || currentView === 'party-game'
                ? isOnline
                  ? 'bg-cyan-950/60 text-cyan-200 border-cyan-400/50'
                  : 'bg-brand-pink/20 text-pink-200 border-brand-pink/50'
                : 'bg-white/[0.03] text-zinc-200 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-brand-pink'}`} />
              <span>Party Mode with Chaos Wheel</span>
            </div>
            <span className="text-xs text-zinc-400">→</span>
          </button>

          {/* Multiplayer Rooms */}
          <button
            onClick={() => handleNav('multiplayer')}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-sm font-bold border transition-all active:scale-[0.98] ${
              currentView === 'multiplayer'
                ? isOnline
                  ? 'bg-blue-950/60 text-cyan-200 border-cyan-400/50'
                  : 'bg-purple-950/60 text-purple-200 border-purple-500/50'
                : 'bg-white/[0.03] text-zinc-200 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🎮</span>
              <span>Multiplayer Rooms</span>
            </div>
            <span className="text-xs text-zinc-400">→</span>
          </button>

          {/* Session History */}
          {onOpenHistory && (
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsMobileMenuOpen(false);
                onOpenHistory();
              }}
              className="w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-sm font-bold bg-white/[0.03] text-zinc-200 border border-white/10 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <History className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-purple-400'}`} />
                <span>Saved Sessions & History</span>
              </div>
              <span className="text-xs text-zinc-400">→</span>
            </button>
          )}

          {/* Custom Decks (if logged in) */}
          {isAuthenticated && (
            <button
              onClick={() => handleNav('my-decks')}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-sm font-bold border transition-all active:scale-[0.98] ${
                currentView === 'my-decks'
                  ? isOnline
                    ? 'bg-cyan-950/40 text-cyan-200 border-cyan-400/40'
                    : 'bg-brand-pink/15 text-pink-200 border-brand-pink/40'
                  : 'bg-white/[0.03] text-zinc-200 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${isOnline ? 'text-cyan-400' : 'text-brand-pink'}`} />
                <span>My Custom Decks</span>
              </div>
              <span className="text-xs text-zinc-400">→</span>
            </button>
          )}

          {/* Admin Dashboard */}
          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-sm font-bold bg-purple-950/40 text-purple-200 border border-purple-500/30 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Admin Dashboard</span>
              </div>
              <span className="text-xs text-purple-300">→</span>
            </button>
          )}

          {/* User Auth / Profile Row */}
          <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between">
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-white"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                    isOnline ? 'bg-cyan-500' : 'bg-brand-pink'
                  }`}>
                    {currentUser.username.substring(0, 1).toUpperCase()}
                  </div>
                  <span>{currentUser.username}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-3 py-2 rounded-xl text-red-400 text-xs font-semibold hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all border ${
                  isOnline
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                    : 'bg-brand-pink/20 border-brand-pink/40 text-pink-200'
                }`}
              >
                Sign In / Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

