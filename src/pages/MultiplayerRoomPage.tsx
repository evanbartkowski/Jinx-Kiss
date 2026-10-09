import React, { useState, useEffect } from 'react';
import {
  multiplayerService,
  MultiplayerRoom,
  MultiplayerPlayer,
} from '../services/multiplayerService';
import { GameId, PartyModeConfig, PromptItem } from '../types/game';
import { GAMES_CONFIG } from '../data/gamesConfig';
import { ALL_DEFAULT_PROMPTS, getDefaultPromptsForGame } from '../data/prompts';
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

    const res = await multiplayerService.createRoom(playerName.trim(), defaultConfig);
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

  const handleStartGame = async () => {
    if (!isHost || !room) return;
    soundEffects.playSuccess();
    const firstGameId = room.config.selectedGames[0] || 'truth-or-dare';
    const firstPrompt = getDefaultPromptsForGame(firstGameId, 'medium')[0] || ALL_DEFAULT_PROMPTS[firstGameId][0];
    await multiplayerService.startRoomGame(roomCode, firstPrompt);
  };

  const handleNextRound = async () => {
    if (!isHost || !room) return;
    soundEffects.playClick();

    const games = room.config.selectedGames;
    const nextGame = games[Math.floor(Math.random() * games.length)];
    const pool = ALL_DEFAULT_PROMPTS[nextGame] || [];
    const nextPrompt = pool[Math.floor(Math.random() * pool.length)];

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

  const handleKick = async (targetId: string) => {
    if (!isHost) return;
    soundEffects.playClick();
    await multiplayerService.kickPlayer(roomCode, targetId);
    showToast('Player removed', 'info');
  };

  // If not in a room, render Create / Join Screen
  if (!roomCode || !playerId) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/15 border border-brand-pink/40 text-pink-300 text-xs font-semibold mb-3 shadow-neon-pink/20">
            <Users className="w-4 h-4 text-brand-pink" />
            <span>Real-time Multiplayer Rooms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-2">
            Party <span className="text-brand-gradient">Rooms</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Play together on separate phones! Host creates a room, guests scan the QR code or enter the code.
          </p>
        </div>

        {/* Create Room Box */}
        <div className="p-6 rounded-3xl glass-panel border border-brand-pink/40 shadow-neon-pink/20 mb-6">
          <h3 className="text-base font-black uppercase text-white mb-3 flex items-center gap-2">
            <Crown className="w-4 h-4 text-brand-pink" /> Host A New Party
          </h3>
          <form onSubmit={handleCreateRoom} className="space-y-3">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your display name (e.g. Alex)"
              required
              className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink/60"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-neon-pink transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Create Room & Invite Friends</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Join Room Box */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10">
          <h3 className="text-base font-black uppercase text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" /> Join Existing Room
          </h3>
          <form onSubmit={handleJoinRoom} className="space-y-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="5-digit room code (e.g. JINX8)"
              maxLength={6}
              required
              className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-mono uppercase tracking-widest placeholder-zinc-500 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your display name"
              required
              className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl border border-white/20 hover:border-white/40 text-white font-bold text-sm transition-all active:scale-95"
            >
              Join Room
            </button>
          </form>
        </div>

        <button
          onClick={onExit}
          className="mt-6 w-full py-3 text-xs font-semibold text-zinc-500 hover:text-white text-center block"
        >
          ← Return to Home
        </button>
      </div>
    );
  }

  const activeMetadata = room?.currentGameId ? (GAMES_CONFIG[room.currentGameId] || GAMES_CONFIG['truth-or-dare']) : GAMES_CONFIG['truth-or-dare'];

  // LOBBY VIEW
  if (room?.status === 'lobby') {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-8 animate-fade-in flex flex-col items-center gap-6">
        {/* Room Code Badge */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
            Party Room Code
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-brand-pink font-mono tracking-widest animate-pulse-slow">
            {roomCode}
          </h2>
        </div>

        {/* Invite & QR Buttons */}
        <div className="flex gap-2 w-full max-w-sm">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={() => setShowQRModal(true)}
            className="py-3 px-5 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-xs font-bold text-purple-300 hover:bg-purple-900/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Players List */}
        <div className="w-full p-6 rounded-3xl glass-panel border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-pink" /> Connected Players ({players.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <div className="flex items-center gap-2 truncate">
                  {p.isHost && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  <span className="text-xs font-bold text-white truncate">{p.name}</span>
                </div>

                {isHost && !p.isHost && (
                  <button
                    onClick={() => handleKick(p.id)}
                    className="text-zinc-500 hover:text-rose-400 p-1"
                    title="Remove player"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Game button (Host) or Waiting status (Guest) */}
        {isHost ? (
          <button
            onClick={handleStartGame}
            disabled={players.length < 1}
            className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-neon-pink flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Party Mode ({players.length} Players)</span>
          </button>
        ) : (
          <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 max-w-sm w-full">
            <p className="text-xs font-semibold text-zinc-300 animate-pulse">
              Waiting for Host ({room?.hostName}) to start the party...
            </p>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-xs rounded-3xl glass-panel border border-brand-pink/50 p-6 text-center relative shadow-neon-pink/30">
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-sm font-black uppercase text-white mb-1">
                Scan to Join Room
              </h4>
              <p className="text-xs text-brand-pink font-mono font-bold mb-4">
                Code: {roomCode}
              </p>

              {/* QR Image */}
              <div
                className="w-48 h-48 mx-auto rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg"
                dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(roomUrl, 180) }}
              />

              <p className="text-[11px] text-zinc-400 mt-4">
                Point any phone camera at this QR code to join instantly with no login!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ACTIVE IN-GAME MULTIPLAYER VIEW
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center gap-6 animate-fade-in">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between text-xs text-zinc-400">
        <span className="font-mono text-brand-pink font-bold">Room: {roomCode}</span>
        <span>Round {room?.currentRound || 1}</span>
        <button onClick={onExit} className="hover:text-white flex items-center gap-1">
          <LogOut className="w-3.5 h-3.5" /> Leave
        </button>
      </div>

      {/* Game Mode Header */}
      <div
        className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border"
        style={{
          borderColor: `${activeMetadata.themeColor}50`,
          backgroundColor: `${activeMetadata.themeColor}15`,
          color: activeMetadata.themeColor,
        }}
      >
        {activeMetadata.title}
      </div>

      {/* Main Prompt Card */}
      <div
        className="w-full p-8 sm:p-10 rounded-3xl glass-panel border text-center relative overflow-hidden"
        style={{ borderColor: `${activeMetadata.themeColor}50` }}
      >
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold block mb-3">
          {activeMetadata.tagline}
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-relaxed my-4">
          "{room?.currentPrompt?.text || 'Get ready for the next round...'}"
        </p>

        {/* If Results Revealed */}
        {room?.revealResults && (
          <div className="animate-scale-in p-4 rounded-2xl bg-black/60 border border-white/10 my-4 text-left">
            <span className="text-xs font-black uppercase text-brand-pink tracking-wider block mb-2">
              📊 Live Room Results:
            </span>
            <div className="space-y-1.5">
              {players.map(p => (
                <div key={p.id} className="flex justify-between text-xs text-zinc-200">
                  <span className="font-semibold">{p.name}:</span>
                  <span className="font-black text-white">
                    {p.currentAnswer || p.currentVote || 'No vote'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Player Input Controls (Phone Voting) */}
      {!room?.revealResults && (
        <div className="w-full flex flex-col items-center gap-3">
          {hasVotedThisRound ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Response recorded! Waiting for host to reveal...</span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-3">
              {/* Would You Rather Choice Buttons */}
              {room?.currentGameId === 'would-you-rather' ? (
                <div className="w-full grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleGuestVote('Option A')}
                    className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-200 font-black text-sm active:scale-95"
                  >
                    Choice A
                  </button>
                  <button
                    onClick={() => handleGuestVote('Option B')}
                    className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-200 font-black text-sm active:scale-95"
                  >
                    Choice B
                  </button>
                </div>
              ) : room?.currentGameId === 'confessions' ? (
                /* Confession typing form */
                <form onSubmit={handleGuestAnswer} className="w-full flex gap-2">
                  <input
                    type="text"
                    value={guestAnswer}
                    onChange={(e) => setGuestAnswer(e.target.value)}
                    placeholder="Type your secret confession anonymously..."
                    className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs"
                  >
                    Send Secret
                  </button>
                </form>
              ) : (
                /* Standard Yes / No / Done buttons */
                <div className="flex gap-3">
                  <button
                    onClick={() => handleGuestVote('Done / Answered')}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95"
                  >
                    Completed Challenge!
                  </button>
                  <button
                    onClick={() => handleGuestVote('Skipped')}
                    className="px-6 py-3 rounded-2xl border border-white/20 text-zinc-400 hover:text-white font-semibold text-xs active:scale-95"
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
        <div className="w-full p-4 rounded-3xl glass-panel border border-brand-pink/30 flex items-center justify-between gap-3 mt-4">
          <span className="text-xs font-black uppercase text-brand-pink flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" /> Host Panel
          </span>

          <div className="flex gap-2">
            {!room?.revealResults ? (
              <button
                onClick={handleReveal}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md active:scale-95"
              >
                Reveal Votes!
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet text-white text-xs font-black shadow-neon-pink flex items-center gap-1.5 active:scale-95"
              >
                <span>Next Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
