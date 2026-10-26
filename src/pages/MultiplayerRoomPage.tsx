import React, { useState, useEffect } from 'react';
import {
  multiplayerService,
  MultiplayerRoom,
  MultiplayerPlayer,
} from '../services/multiplayerService';
import { GameId, PartyModeConfig, PlayMode, PromptItem } from '../types/game';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { getPartyPromptPool } from '../utils/partyPrompts';
import { partyRequiresAdultConfirmation, requiresAdultConfirmation } from '../utils/contentPolicy';
import { AgeConfirmationModal } from '../components/common/AgeConfirmationModal';
import { useGameSettings } from '../context/GameSettingsContext';
import { soundEffects } from '../utils/audio';
import { useToast } from '../context/ToastContext';
import { generateQRCodeSVG } from '../utils/qrCode';
import {
  Users,
  Copy,
  QrCode,
  Play,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Trophy,
  Crown,
  Eye,
  Send,
  LogOut,
  Flame,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MultiplayerRoomPageProps {
  initialRoomCode?: string;
  onExit: () => void;
}

export const MultiplayerRoomPage: React.FC<MultiplayerRoomPageProps> = ({
  initialRoomCode,
  onExit,
}) => {
  const { showToast } = useToast();
  const { playMode, setPlayMode, isAgeConfirmed, confirmAge } = useGameSettings();

  // Mode: 'menu' | 'in-room'
  const [roomCode, setRoomCode] = useState<string>(initialRoomCode || '');
  const [playerId, setPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [players, setPlayers] = useState<MultiplayerPlayer[]>([]);

  // UI state
  const [showQRModal, setShowQRModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [guestVote, setGuestVote] = useState<string | number | null>(null);
  const [guestAnswer, setGuestAnswer] = useState<string>('');
  const [hasVotedThisRound, setHasVotedThisRound] = useState(false);

  // Auto-connect if initialRoomCode provided
  useEffect(() => {
    if (initialRoomCode) {
      setRoomCode(initialRoomCode.toUpperCase());
    }
  }, [initialRoomCode]);

  // Synchronize room playMode with global playMode
  useEffect(() => {
    if (room?.playMode && room.playMode !== playMode) {
      setPlayMode(room.playMode);
    }
  }, [room?.playMode, playMode, setPlayMode]);

  // Subscribe to real-time room updates
  useEffect(() => {
    if (!roomCode || !playerId) return;

    const unsubRoom = multiplayerService.subscribeToRoom(roomCode, (updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom && updatedRoom.status === 'playing' && !updatedRoom.revealResults) {
        // Reset local vote state on new round
        setHasVotedThisRound(false);
        setGuestVote(null);
        setGuestAnswer('');
      }
    });

    const unsubPlayers = multiplayerService.subscribeToPlayers(roomCode, (updatedPlayers) => {
      setPlayers(updatedPlayers);
      // Check if self was kicked
      const me = updatedPlayers.find(p => p.id === playerId);
      if (!me && updatedPlayers.length > 0) {
        showToast('You were removed from the room.', 'info');
        setRoomCode('');
        setPlayerId('');
      }
    });

    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, [roomCode, playerId]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    soundEffects.playClick();
    const defaultConfig: PartyModeConfig = {
      playMode,
      playerNames: [playerName.trim()],
      selectedGames: Object.keys(GAMES_CONFIG) as GameId[],
      categories: ['easy', 'medium', 'spicy'],
      roundCount: 20,
      enableChaosWheel: true,
      enableMysteryCards: true,
      enableScoring: true,
      timerSeconds: 30,
      contentBoundary: 'all',
    };

    const res = await multiplayerService.createRoom(playerName.trim(), defaultConfig, playMode);
    setRoomCode(res.roomCode);
    setPlayerId(res.playerId);
    window.location.hash = `#/room/${res.roomCode}`;
    showToast(`Room created! Code: ${res.roomCode}`, 'success');
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !playerName.trim()) return;

    soundEffects.playClick();
    const res = await multiplayerService.joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    if (res.success) {
      setPlayerId(res.playerId);
      window.location.hash = `#/room/${roomCode.trim().toUpperCase()}`;
      showToast('Joined party room!', 'success');
    } else {
      showToast(res.error || 'Failed to join room', 'error');
    }
  };

  const isHost = players.find(p => p.id === playerId)?.isHost || false;
  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/#/room/${roomCode}` : '';

  const handleCopyLink = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(roomUrl).then(() => {
      setIsCopied(true);
      showToast('Invite link copied!', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleToggleRoomPlayMode = async (newMode: PlayMode) => {
    if (!isHost || !roomCode) return;
    soundEffects.playClick();
    await multiplayerService.updateRoomPlayMode(roomCode, newMode);
    setPlayMode(newMode);
    showToast(`Switched room to ${newMode === 'online' ? 'Online (Discord/Webcams)' : 'In Person'}!`, 'info');
  };

  const handleStartGame = async () => {
    if (!isHost || !room) return;
    soundEffects.playSuccess();
    const currentMode = room.playMode || playMode || 'in-person';
    const firstGameId = room.config.selectedGames[0] || 'truth-or-dare';
    const promptsPool = getPartyPromptPool(firstGameId, { ...room.config, playMode: currentMode });
    const firstPrompt = promptsPool[Math.floor(Math.random() * promptsPool.length)];
    if (!firstPrompt) { showToast('No cards match the room categories.', 'error'); return; }
    await multiplayerService.startRoomGame(roomCode, firstPrompt);
  };

  const handleNextRound = async () => {
    if (!isHost || !room) return;
    soundEffects.playClick();

    const currentMode = room.playMode || playMode || 'in-person';
    const games = room.config.selectedGames;
    const nextGame = games[Math.floor(Math.random() * games.length)];
    const pool = getPartyPromptPool(nextGame, { ...room.config, playMode: currentMode });
    const nextPrompt = pool[Math.floor(Math.random() * pool.length)];
    if (!nextPrompt) { showToast('No cards match the room categories.', 'error'); return; }

    await multiplayerService.nextRound(roomCode, nextGame, nextPrompt, room.currentRound + 1);
  };

  const handleReveal = async () => {
    if (!isHost) return;
    soundEffects.playSuccess();
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4DA6', '#A855F7', '#06B6D4'],
    });
    await multiplayerService.revealResults(roomCode);
  };

  const handleGuestVote = async (voteValue: string | number) => {
    soundEffects.playClick();
    setGuestVote(voteValue);
    setHasVotedThisRound(true);
    await multiplayerService.submitVote(roomCode, playerId, voteValue);
    showToast('Vote submitted!', 'success');
  };

  const handleGuestAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestAnswer.trim()) return;
    soundEffects.playClick();
    setHasVotedThisRound(true);
    await multiplayerService.submitAnswer(roomCode, playerId, guestAnswer.trim());
    showToast('Secret answer sent!', 'success');
  };

  if (room && !isAgeConfirmed && (partyRequiresAdultConfirmation(room.config) || (room.currentPrompt && requiresAdultConfirmation(room.currentPrompt.category)))) {
    return <AgeConfirmationModal isOpen onConfirm={confirmAge} onCancel={onExit} />;
  }

  const handleKick = async (targetId: string) => {
    if (!isHost) return;
    soundEffects.playClick();
    await multiplayerService.kickPlayer(roomCode, targetId);
    showToast('Player removed', 'info');
  };

  // If not in a room, render Create / Join Screen
  if (!roomCode || !playerId) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 xl:px-12 py-8 min-h-[calc(100dvh-5rem)] flex flex-col justify-between animate-fade-in">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-pink/15 border border-brand-pink/40 text-pink-300 text-xs font-semibold mb-4 shadow-neon-pink/20">
            <Users className="w-4 h-4 text-brand-pink" />
            <span>Real-time Multiplayer Rooms</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight mb-4">
            Party <span className="text-brand-gradient">Rooms</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            Play together in real-time across separate phones! The host launches the room on a main screen, and everyone joins instantly with their own phone by scanning a QR code or entering the 5-digit code.
          </p>
        </div>

        {/* 2-Column Responsive Host / Join Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch flex-1 max-w-5xl mx-auto w-full mb-8">
          {/* Host A New Party Card */}
          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-brand-pink/40 shadow-neon-pink/20 flex flex-col justify-between relative overflow-hidden group hover:border-brand-pink/70 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 border border-brand-pink/40 flex items-center justify-center text-brand-pink mb-6">
                <Crown className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-black uppercase text-white mb-2 tracking-wide">
                Host A New Party
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                You control the game flow, reveal votes on screen, and invite friends with a single code or QR scan.
              </p>

              <div className="space-y-2 mb-6 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes all 14 party games in rotation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Private votes, live reveals, and scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant 1-click QR code for guests</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Your Host Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. Alex (Host)"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-2xl px-5 py-4 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink/60 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-base shadow-neon-pink transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create Room & Invite Friends</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Join Existing Room Card */}
          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/15 shadow-neon-violet/10 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6">
                <Users className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-black uppercase text-white mb-2 tracking-wide">
                Join Existing Room
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                Enter the 5-character code from your party host to join the live room right from this device.
              </p>

              <div className="space-y-2 mb-6 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Vote secretly from your phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>No account or download required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Real-time instant synchronization</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  5-Digit Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. JINX8"
                  maxLength={6}
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-2xl px-5 py-4 text-center text-lg text-white font-mono uppercase tracking-widest placeholder-zinc-500 focus:outline-none focus:border-purple-400 transition-all font-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. Sam"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-2xl px-5 py-4 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-black text-base transition-all active:scale-95 cursor-pointer"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>

        {/* Footer return button */}
        <div className="text-center pt-4">
          <button
            onClick={onExit}
            className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Home
          </button>
        </div>
      </div>
    );
  }

  const activeMetadata = room?.currentGameId ? (GAMES_CONFIG[room.currentGameId] || GAMES_CONFIG['truth-or-dare']) : GAMES_CONFIG['truth-or-dare'];

  // LOBBY VIEW
  if (room?.status === 'lobby') {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-6 min-h-[calc(100dvh-5rem)] flex flex-col justify-between gap-6 animate-fade-in">
        {/* Top Navigation & Status Bar */}
        <div className="w-full flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/15 border border-brand-pink/40 text-xs font-bold text-pink-300">
              <Users className="w-3.5 h-3.5 text-brand-pink" />
              <span>Party Lobby</span>
            </div>
            {isHost ? (
              <button
                onClick={() => handleToggleRoomPlayMode(room.playMode === 'online' ? 'in-person' : 'online')}
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
                  room.playMode === 'online'
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-neon-cyan/20'
                    : 'bg-brand-pink/15 border-brand-pink/40 text-pink-300 shadow-neon-pink/20'
                }`}
                title="Click to toggle between In-Person and Online Discord mode"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{room.playMode === 'online' ? 'Online Mode (Discord)' : 'In-Person Mode'}</span>
                <span className="text-[10px] opacity-75 underline ml-1">Change</span>
              </button>
            ) : (
              <span
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border ${
                  room.playMode === 'online'
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                    : 'bg-brand-pink/15 border-brand-pink/40 text-pink-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{room.playMode === 'online' ? 'Online Mode (Discord)' : 'In-Person Mode'}</span>
              </span>
            )}
            {isHost && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
                <Crown className="w-3.5 h-3.5" /> Host Controls Active
              </span>
            )}
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Leave Room</span>
          </button>
        </div>

        {/* Central Room Code Banner */}
        <div className="w-full py-8 sm:py-10 rounded-3xl glass-panel border border-brand-pink/30 flex flex-col items-center text-center relative overflow-hidden shadow-neon-pink/15">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 via-brand-violet/10 to-brand-pink/10 blur-3xl pointer-events-none" />

          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-400 block mb-2">
            Party Room Code • Friends Join at <span className="text-white font-mono font-bold">jinxkiss.com</span>
          </span>

          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-brand-pink font-mono tracking-widest drop-shadow-[0_0_35px_rgba(255,77,166,0.6)] animate-pulse-slow">
            {roomCode}
          </h2>

          {/* Invite Actions */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={handleCopyLink}
              className="py-3 px-6 rounded-2xl bg-white/10 border border-white/20 hover:border-white/40 text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>

            <button
              onClick={() => setShowQRModal(true)}
              className="py-3 px-6 rounded-2xl bg-purple-950/60 border border-purple-500/50 text-sm font-bold text-purple-200 hover:bg-purple-900/60 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-neon-violet/30 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Left: Players Grid (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-pink" /> Connected Players ({players.length})
                </span>
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                {players.length === 1 ? 'Waiting for guests to join...' : 'Ready to start!'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    p.isHost
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 shadow-md'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/25 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-brand-violet text-white font-black text-sm flex items-center justify-center shrink-0">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        {p.isHost && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <span className="text-sm font-bold text-white truncate">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                        {p.isHost ? 'Party Host' : 'Player'}
                      </span>
                    </div>
                  </div>

                  {isHost && !p.isHost && (
                    <button
                      onClick={() => handleKick(p.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/40 transition-colors"
                      title="Remove player"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Room Settings & Rules Overview (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 flex flex-col gap-5">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-violet" /> Room Game Setup
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Total Games</span>
                <span className="font-bold text-white">{room?.config?.selectedGames?.length || 14} in rotation</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Round Limit</span>
                <span className="font-bold text-white">{room?.config?.roundCount || 20} Rounds</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Chaos Wheel</span>
                <span className="font-bold text-pink-400">{room?.config?.enableChaosWheel ? 'Active' : 'Off'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-400">Live Scoring</span>
                <span className="font-bold text-emerald-400">{room?.config?.enableScoring ? 'Enabled' : 'Off'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-400">Timer</span>
                <span className="font-bold text-purple-400">{room?.config?.timerSeconds || 30}s per prompt</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
              💡 <span className="font-bold text-zinc-300">Host Tip:</span> Cast or display this screen on a TV or laptop for the room, while everyone votes privately from their phones!
            </div>
          </div>
        </div>

        {/* Bottom Host Launcher or Guest Waiting */}
        <div className="w-full">
          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={players.length < 1}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-brand-pink via-purple-600 to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-base sm:text-lg shadow-neon-pink flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Party Mode ({players.length} {players.length === 1 ? 'Player' : 'Players'} Connected)</span>
            </button>
          ) : (
            <div className="w-full py-5 px-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-brand-pink animate-pulse" />
              <p className="text-sm font-semibold text-zinc-300">
                Waiting for Host (<span className="text-white font-bold">{room?.hostName}</span>) to start the party... Stay on this page!
              </p>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl glass-panel border border-brand-pink/50 p-8 text-center relative shadow-neon-pink/30">
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-base font-black uppercase text-white mb-1">
                Scan to Join Room
              </h4>
              <p className="text-sm text-brand-pink font-mono font-bold mb-6">
                Room Code: {roomCode}
              </p>

              {/* QR Image */}
              <div
                className="w-56 h-56 mx-auto rounded-2xl bg-white p-3 flex items-center justify-center shadow-lg"
                dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(roomUrl, 210) }}
              />

              <p className="text-xs text-zinc-400 mt-5">
                Point any phone camera at this QR code to join instantly with zero login!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ACTIVE IN-GAME MULTIPLAYER VIEW
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 xl:px-12 py-6 min-h-[calc(100dvh-5rem)] flex flex-col justify-between gap-6 animate-fade-in">
      {/* Top Banner Navigation */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm text-zinc-400 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-brand-pink font-bold bg-brand-pink/10 px-3 py-1.5 rounded-full border border-brand-pink/30">
            Room: {roomCode}
          </span>
          <span className="font-bold text-white bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            Round {room?.currentRound || 1}
          </span>
        </div>

        {/* Game Mode Header Pill */}
        <div
          className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-md"
          style={{
            borderColor: `${activeMetadata.themeColor}50`,
            backgroundColor: `${activeMetadata.themeColor}15`,
            color: activeMetadata.themeColor,
          }}
        >
          {activeMetadata.title}
        </div>

        <button onClick={onExit} className="hover:text-white flex items-center gap-1.5 cursor-pointer">
          <LogOut className="w-4 h-4" /> <span>Leave</span>
        </button>
      </div>

      {/* Main Responsive Prompt Card */}
      <div
        className="w-full min-h-[380px] p-8 sm:p-14 md:p-16 rounded-3xl glass-panel border text-center relative overflow-hidden flex flex-col justify-between items-center transition-all duration-300"
        style={{
          borderColor: `${activeMetadata.themeColor}50`,
          boxShadow: `0 15px 45px -12px ${activeMetadata.themeColor}35`,
        }}
      >
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold block">
          {activeMetadata.tagline}
        </span>

        <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-relaxed my-6 max-w-4xl">
          "{room?.currentPrompt?.text || 'Get ready for the next round...'}"
        </p>

        {/* If Results Revealed */}
        {room?.revealResults ? (
          <div className="animate-scale-in w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-black/80 border border-brand-pink/30 my-4 text-left shadow-neon-pink/15">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10 flex-wrap">
              <span className="text-xs sm:text-sm font-black uppercase text-brand-pink tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Anonymous Room Results</span>
              </span>

              {/* Voting stats */}
              {(() => {
                const totalCast = players.filter(p => !!p.currentVote || !!p.currentAnswer).length;
                const abstained = players.length - totalCast;
                return (
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {totalCast} Voted
                    </span>
                    {abstained > 0 && (
                      <span className="text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {abstained} Abstained
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Anonymous vote tally bars */}
            {(() => {
              const voteCounts: Record<string, number> = {};
              players.forEach(p => {
                if (p.currentVote) {
                  const key = String(p.currentVote);
                  voteCounts[key] = (voteCounts[key] || 0) + 1;
                }
              });

              const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
              const sortedVotes = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
              const isTie = sortedVotes.length > 1 && sortedVotes[0][1] === sortedVotes[1][1];

              if (totalVotes === 0 && !players.some(p => p.currentAnswer)) {
                return (
                  <p className="text-xs text-zinc-400 italic text-center py-4">
                    No votes were submitted this round.
                  </p>
                );
              }

              return (
                <div className="space-y-3.5 mb-6">
                  {isTie && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider text-center">
                      ⚡ Tie Result! Equal votes recorded.
                    </div>
                  )}

                  {sortedVotes.map(([option, count], idx) => {
                    const pct = Math.round((count / totalVotes) * 100);
                    const isWinner = idx === 0 && !isTie;
                    return (
                      <div key={option} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-black text-white flex items-center gap-2">
                            {isWinner && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                            <span>{option}</span>
                          </span>
                          <span className="font-bold text-zinc-300">
                            {count} {count === 1 ? 'vote' : 'votes'} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-3.5 rounded-full bg-white/10 overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              isWinner
                                ? 'bg-gradient-to-r from-brand-pink via-purple-500 to-cyan-400 shadow-neon-pink'
                                : 'bg-gradient-to-r from-zinc-600 to-zinc-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Anonymous secret answers (Confessions) */}
                  {players.some(p => p.currentAnswer) && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                        Anonymous Responses:
                      </span>
                      {players.filter(p => p.currentAnswer).map((p, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-zinc-200 italic">
                          "{p.currentAnswer}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Live Emoji Reactions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                React to result:
              </span>
              <div className="flex items-center gap-1.5">
                {['🔥', '😱', '😂', '👏', '💀'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      soundEffects.playClick();
                      confetti({ particleCount: 15, spread: 45, origin: { y: 0.8 } });
                      showToast(`Reacted with ${emoji}!`, 'info');
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-base active:scale-125 transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            {hasVotedThisRound ? 'Waiting for host to reveal results...' : 'Vote privately on your phone below'}
          </div>
        )}
      </div>

      {/* Player Input Controls (Phone Voting) */}
      {!room?.revealResults && (
        <div className="w-full flex flex-col items-center gap-3">
          {hasVotedThisRound ? (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center gap-3 shadow-neon-green/20">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Response recorded! Waiting for host to reveal results...</span>
            </div>
          ) : (
            <div className="w-full max-w-2xl flex flex-col items-center gap-3">
              {/* Would You Rather Choice Buttons */}
              {room?.currentGameId === 'would-you-rather' ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleGuestVote('Option A')}
                    className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-200 font-black text-base active:scale-95 transition-all shadow-neon-cyan/20 cursor-pointer"
                  >
                    Choice A
                  </button>
                  <button
                    onClick={() => handleGuestVote('Option B')}
                    className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-200 font-black text-base active:scale-95 transition-all shadow-neon-cyan/20 cursor-pointer"
                  >
                    Choice B
                  </button>
                </div>
              ) : room?.currentGameId === 'confessions' ? (
                /* Confession typing form */
                <form onSubmit={handleGuestAnswer} className="w-full flex gap-3">
                  <input
                    type="text"
                    value={guestAnswer}
                    onChange={(e) => setGuestAnswer(e.target.value)}
                    placeholder="Type your secret confession anonymously..."
                    className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-neon-violet/30 cursor-pointer"
                  >
                    Send Secret
                  </button>
                </form>
              ) : (
                /* Standard Yes / No / Done buttons */
                <div className="flex gap-4 flex-wrap justify-center w-full">
                  <button
                    onClick={() => handleGuestVote('Done / Answered')}
                    className="flex-1 sm:flex-initial px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Completed Challenge!
                  </button>
                  <button
                    onClick={() => handleGuestVote('Skipped')}
                    className="flex-1 sm:flex-initial px-8 py-4 rounded-2xl border border-white/20 hover:border-white/40 text-zinc-300 hover:text-white font-bold text-sm active:scale-95 transition-all cursor-pointer"
                  >
                    Take Penalty Sip / Skip
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Host Control Actions */}
      {isHost && (
        <div className="w-full p-5 rounded-3xl glass-panel border border-brand-pink/30 flex items-center justify-between gap-4 mt-2">
          <span className="text-xs sm:text-sm font-black uppercase text-brand-pink flex items-center gap-2">
            <Crown className="w-4 h-4" /> Host Panel
          </span>

          <div className="flex gap-3">
            {!room?.revealResults ? (
              <button
                onClick={handleReveal}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-black shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Reveal Votes!
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-neon-pink flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next Round</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
