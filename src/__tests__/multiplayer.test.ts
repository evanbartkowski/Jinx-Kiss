import { describe, it, expect } from 'vitest';
import { multiplayerService } from '../services/multiplayerService';
import { PartyModeConfig } from '../types/game';

describe('Realtime Multiplayer Party Rooms', () => {
  const dummyConfig: PartyModeConfig = {
    playerNames: ['HostAlex'],
    selectedGames: ['truth-or-dare', 'most-likely-to', 'whos-lying'],
    categories: ['easy', 'medium'],
    roundCount: 10,
    enableChaosWheel: true,
    enableMysteryCards: true,
    enableScoring: true,
    timerSeconds: 30,
    contentBoundary: 'all',
  };

  it('creates a room with a 5-character alphanumeric code and sets up the host', async () => {
    const { roomCode, playerId } = await multiplayerService.createRoom('HostAlex', dummyConfig);
    expect(roomCode).toHaveLength(5);
    expect(playerId).toBeDefined();

    let roomSnapshot: any = null;
    const unsub = multiplayerService.subscribeToRoom(roomCode, (room) => {
      roomSnapshot = room;
    });

    expect(roomSnapshot).toBeDefined();
    expect(roomSnapshot.roomCode).toBe(roomCode);
    expect(roomSnapshot.hostName).toBe('HostAlex');
    expect(roomSnapshot.status).toBe('lobby');

    unsub();
  });

  it('allows guests to join with a display name', async () => {
    const { roomCode } = await multiplayerService.createRoom('HostAlex', dummyConfig);
    const joinRes = await multiplayerService.joinRoom(roomCode, 'GuestJordan');

    expect(joinRes.success).toBe(true);
    expect(joinRes.playerId).toBeDefined();

    let playerList: any[] = [];
    const unsub = multiplayerService.subscribeToPlayers(roomCode, (players) => {
      playerList = players;
    });

    expect(playerList.length).toBeGreaterThanOrEqual(2);
    expect(playerList.some(p => p.name === 'GuestJordan')).toBe(true);
    expect(playerList.some(p => p.isHost)).toBe(true);

    unsub();
  });

  it('records votes, allows host reveal, and advances round while resetting votes', async () => {
    const { roomCode, playerId: hostId } = await multiplayerService.createRoom('HostAlex', dummyConfig);
    const { playerId: guestId } = await multiplayerService.joinRoom(roomCode, 'GuestSam');

    // Start game
    await multiplayerService.startRoomGame(roomCode, {
      id: 'p-1',
      gameId: 'would-you-rather',
      category: 'medium',
      text: 'Sample prompt',
    });

    // Guest submits vote
    await multiplayerService.submitVote(roomCode, guestId, 'Option A');

    let players: any[] = [];
    multiplayerService.subscribeToPlayers(roomCode, (list) => {
      players = list;
    });

    const sam = players.find(p => p.id === guestId);
    expect(sam?.hasSubmitted).toBe(true);
    expect(sam?.currentVote).toBe('Option A');

    // Host reveals
    await multiplayerService.revealResults(roomCode);

    let currentRoom: any = null;
    multiplayerService.subscribeToRoom(roomCode, (r) => {
      currentRoom = r;
    });
    expect(currentRoom.revealResults).toBe(true);

    // Host advances round
    await multiplayerService.nextRound(roomCode, 'most-likely-to', {
      id: 'p-2',
      gameId: 'most-likely-to',
      category: 'medium',
      text: 'Next prompt',
    }, 2);

    expect(currentRoom.currentRound).toBe(2);
    expect(currentRoom.revealResults).toBe(false);

    const samAfter = players.find(p => p.id === guestId);
    expect(samAfter?.currentVote).toBeNull();
    expect(samAfter?.hasSubmitted).toBe(false);
  });

  it('allows host to kick players', async () => {
    const { roomCode } = await multiplayerService.createRoom('HostAlex', dummyConfig);
    const { playerId: guestId } = await multiplayerService.joinRoom(roomCode, 'DisruptivePlayer');

    let players: any[] = [];
    const unsub = multiplayerService.subscribeToPlayers(roomCode, (list) => {
      players = list;
    });

    expect(players.some(p => p.id === guestId)).toBe(true);

    await multiplayerService.kickPlayer(roomCode, guestId);

    expect(players.some(p => p.id === guestId)).toBe(false);

    unsub();
  });
});
