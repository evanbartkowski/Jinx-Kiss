import { db } from '../config/firebase';
import {
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { GameId, PartyModeConfig, PromptItem } from '../types/game';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  currentVote?: string | number | null;
  currentAnswer?: string | null;
  hasSubmitted?: boolean;
  lastSeen: number;
}

export interface MultiplayerRoom {
  roomCode: string;
  hostId: string;
  hostName: string;
  status: 'lobby' | 'playing' | 'ended';
  currentGameId: GameId;
  currentPrompt: PromptItem | null;
  currentRound: number;
  revealResults: boolean;
  config: PartyModeConfig;
  createdAt: number;
  updatedAt: number;
}

// In-memory fallback state for tests and offline environments
const fallbackRooms = new Map<string, MultiplayerRoom>();
const fallbackPlayers = new Map<string, Map<string, MultiplayerPlayer>>();
const fallbackRoomListeners = new Map<string, Set<(room: MultiplayerRoom | null) => void>>();
const fallbackPlayerListeners = new Map<string, Set<(players: MultiplayerPlayer[]) => void>>();

function notifyFallbackRoom(code: string) {
  const room = fallbackRooms.get(code) || null;
  fallbackRoomListeners.get(code)?.forEach(cb => cb(room));
}

function notifyFallbackPlayers(code: string) {
  const map = fallbackPlayers.get(code);
  const list = map ? Array.from(map.values()) : [];
  fallbackPlayerListeners.get(code)?.forEach(cb => cb(list));
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const multiplayerService = {
  async createRoom(hostName: string, config: PartyModeConfig): Promise<{ roomCode: string; playerId: string }> {
    const roomCode = generateRoomCode();
    const playerId = `host_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const roomData: MultiplayerRoom = {
      roomCode,
      hostId: playerId,
      hostName,
      status: 'lobby',
      currentGameId: config.selectedGames[0] || 'truth-or-dare',
      currentPrompt: null,
      currentRound: 1,
      revealResults: false,
      config,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const hostPlayerData: MultiplayerPlayer = {
      id: playerId,
      name: hostName,
      isHost: true,
      score: 0,
      lastSeen: Date.now(),
    };

    // Store in fallback map
    fallbackRooms.set(roomCode, roomData);
    const pMap = new Map<string, MultiplayerPlayer>();
    pMap.set(playerId, hostPlayerData);
    fallbackPlayers.set(roomCode, pMap);

    // Save to Firestore
    try {
      if (db) {
        const roomRef = doc(db, 'rooms', roomCode);
        await setDoc(roomRef, { ...roomData, serverCreatedAt: serverTimestamp() });

        const playerRef = doc(db, 'rooms', roomCode, 'players', playerId);
        await setDoc(playerRef, hostPlayerData);
      }
    } catch (e) {
      console.warn('Multiplayer room created in local fallback mode:', e);
    }

    notifyFallbackRoom(roomCode);
    notifyFallbackPlayers(roomCode);

    return { roomCode, playerId };
  },

  async joinRoom(roomCode: string, playerName: string): Promise<{ playerId: string; success: boolean; error?: string }> {
    const cleanCode = roomCode.trim().toUpperCase();
    const playerId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newPlayer: MultiplayerPlayer = {
      id: playerId,
      name: playerName.trim(),
      isHost: false,
      score: 0,
      lastSeen: Date.now(),
    };

    // Update local memory map
    let pMap = fallbackPlayers.get(cleanCode);
    if (!pMap) {
      pMap = new Map();
      fallbackPlayers.set(cleanCode, pMap);
    }
    pMap.set(playerId, newPlayer);
    notifyFallbackPlayers(cleanCode);

    // Persist to Firestore
    try {
      if (db) {
        const roomRef = doc(db, 'rooms', cleanCode);
        const snap = await getDoc(roomRef);
        if (snap.exists()) {
          const playerRef = doc(db, 'rooms', cleanCode, 'players', playerId);
          await setDoc(playerRef, newPlayer);
          return { playerId, success: true };
        }
      }
    } catch {
      // Offline fallback
    }

    if (fallbackRooms.has(cleanCode)) {
      return { playerId, success: true };
    }

    return { playerId: '', success: false, error: 'Room not found. Check the code and try again.' };
  },

  subscribeToRoom(roomCode: string, callback: (room: MultiplayerRoom | null) => void): Unsubscribe {
    const cleanCode = roomCode.trim().toUpperCase();

    // Setup fallback listener
    if (!fallbackRoomListeners.has(cleanCode)) {
      fallbackRoomListeners.set(cleanCode, new Set());
    }
    fallbackRoomListeners.get(cleanCode)!.add(callback);
    callback(fallbackRooms.get(cleanCode) || null);

    let firestoreUnsub: Unsubscribe = () => {};
    try {
      if (db) {
        const roomRef = doc(db, 'rooms', cleanCode);
        firestoreUnsub = onSnapshot(roomRef, (snap) => {
          if (snap.exists()) {
            callback(snap.data() as MultiplayerRoom);
          } else {
            callback(fallbackRooms.get(cleanCode) || null);
          }
        }, () => {
          callback(fallbackRooms.get(cleanCode) || null);
        });
      }
    } catch {
      // ignore
    }

    return () => {
      fallbackRoomListeners.get(cleanCode)?.delete(callback);
      firestoreUnsub();
    };
  },

  subscribeToPlayers(roomCode: string, callback: (players: MultiplayerPlayer[]) => void): Unsubscribe {
    const cleanCode = roomCode.trim().toUpperCase();

    if (!fallbackPlayerListeners.has(cleanCode)) {
      fallbackPlayerListeners.set(cleanCode, new Set());
    }
    fallbackPlayerListeners.get(cleanCode)!.add(callback);

    const initialList = Array.from(fallbackPlayers.get(cleanCode)?.values() || []);
    callback(initialList);

    let firestoreUnsub: Unsubscribe = () => {};
    try {
      if (db) {
        const playersCol = collection(db, 'rooms', cleanCode, 'players');
        firestoreUnsub = onSnapshot(playersCol, (snap) => {
          const list: MultiplayerPlayer[] = [];
          snap.forEach(d => list.push(d.data() as MultiplayerPlayer));
          callback(list.length > 0 ? list : Array.from(fallbackPlayers.get(cleanCode)?.values() || []));
        }, () => {
          callback(Array.from(fallbackPlayers.get(cleanCode)?.values() || []));
        });
      }
    } catch {
      // ignore
    }

    return () => {
      fallbackPlayerListeners.get(cleanCode)?.delete(callback);
      firestoreUnsub();
    };
  },

  async startRoomGame(roomCode: string, firstPrompt: PromptItem): Promise<void> {
    const cleanCode = roomCode.trim().toUpperCase();
    const updates: Partial<MultiplayerRoom> = {
      status: 'playing',
      currentPrompt: firstPrompt,
      currentRound: 1,
      revealResults: false,
      updatedAt: Date.now(),
    };

    if (fallbackRooms.has(cleanCode)) {
      const room = fallbackRooms.get(cleanCode)!;
      Object.assign(room, updates);
      notifyFallbackRoom(cleanCode);
    }

    try {
      if (db) {
        const roomRef = doc(db, 'rooms', cleanCode);
        await updateDoc(roomRef, updates);
      }
    } catch {
      // fallback
    }
  },

  async submitVote(roomCode: string, playerId: string, vote: string | number): Promise<void> {
    const cleanCode = roomCode.trim().toUpperCase();

    // Fallback update
    const pMap = fallbackPlayers.get(cleanCode);
    if (pMap && pMap.has(playerId)) {
      const p = pMap.get(playerId)!;
      p.currentVote = vote;
      p.hasSubmitted = true;
      notifyFallbackPlayers(cleanCode);
    }

    try {
      if (db) {
        const playerRef = doc(db, 'rooms', cleanCode, 'players', playerId);
        await updateDoc(playerRef, {
          currentVote: vote,
          hasSubmitted: true,
          lastSeen: Date.now(),
        });
      }
    } catch {
      // fallback
    }
  },

  async submitAnswer(roomCode: string, playerId: string, answer: string): Promise<void> {
    const cleanCode = roomCode.trim().toUpperCase();

    const pMap = fallbackPlayers.get(cleanCode);
    if (pMap && pMap.has(playerId)) {
      const p = pMap.get(playerId)!;
      p.currentAnswer = answer;
      p.hasSubmitted = true;
      notifyFallbackPlayers(cleanCode);
    }

    try {
      if (db) {
        const playerRef = doc(db, 'rooms', cleanCode, 'players', playerId);
        await updateDoc(playerRef, {
          currentAnswer: answer,
          hasSubmitted: true,
          lastSeen: Date.now(),
        });
      }
    } catch {
      // fallback
    }
  },

  async revealResults(roomCode: string): Promise<void> {
    const cleanCode = roomCode.trim().toUpperCase();

    if (fallbackRooms.has(cleanCode)) {
      const room = fallbackRooms.get(cleanCode)!;
      room.revealResults = true;
      notifyFallbackRoom(cleanCode);
    }

    try {
      if (db) {
        const roomRef = doc(db, 'rooms', cleanCode);
        await updateDoc(roomRef, { revealResults: true, updatedAt: Date.now() });
      }
    } catch {
      // fallback
    }
  },

  async nextRound(roomCode: string, nextGameId: GameId, nextPrompt: PromptItem, nextRoundNum: number): Promise<void> {
    const cleanCode = roomCode.trim().toUpperCase();

    // Clear player votes
    const pMap = fallbackPlayers.get(cleanCode);
    if (pMap) {
      pMap.forEach(p => {
        p.currentVote = null;
        p.currentAnswer = null;
        p.hasSubmitted = false;
      });
      notifyFallbackPlayers(cleanCode);
    }

    if (fallbackRooms.has(cleanCode)) {
      const room = fallbackRooms.get(cleanCode)!;
      room.currentGameId = nextGameId;
      room.currentPrompt = nextPrompt;
      room.currentRound = nextRoundNum;
      room.revealResults = false;
      notifyFallbackRoom(cleanCode);
    }

    try {
      if (db) {
        const roomRef = doc(db, 'rooms', cleanCode);
        await updateDoc(roomRef, {
          currentGameId: nextGameId,
          currentPrompt: nextPrompt,
          currentRound: nextRoundNum,
          revealResults: false,
          updatedAt: Date.now(),
        });
      }
    } catch {
      // fallback
    }
  },

  async kickPlayer(roomCode: string, playerId: string): Promise<void> {
    const cleanCode = roomCode.trim().toUpperCase();

    const pMap = fallbackPlayers.get(cleanCode);
    if (pMap) {
      pMap.delete(playerId);
      notifyFallbackPlayers(cleanCode);
    }

    try {
      if (db) {
        const playerRef = doc(db, 'rooms', cleanCode, 'players', playerId);
        await deleteDoc(playerRef);
      }
    } catch {
      // fallback
    }
  },

  async awardPoints(roomCode: string, playerId: string, points: number): Promise<void> {
    const cleanCode = roomCode.trim().toUpperCase();

    const pMap = fallbackPlayers.get(cleanCode);
    if (pMap && pMap.has(playerId)) {
      const p = pMap.get(playerId)!;
      p.score += points;
      notifyFallbackPlayers(cleanCode);
    }

    try {
      if (db) {
        const playerRef = doc(db, 'rooms', cleanCode, 'players', playerId);
        const snap = await getDoc(playerRef);
        if (snap.exists()) {
          const cur = snap.data().score || 0;
          await updateDoc(playerRef, { score: cur + points });
        }
      }
    } catch {
      // fallback
    }
  },
};

