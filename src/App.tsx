import React, { useState, useEffect } from 'react';
import { GameId, PartyModeConfig } from './types/game';
import { CustomDeck } from './types/deck';
import { GAMES_CONFIG } from './data/gamesConfig';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { GameSettingsProvider } from './context/GameSettingsContext';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { AudioSettingsModal } from './components/common/AudioSettingsModal';
import { SessionHistoryModal } from './components/common/SessionHistoryModal';
import { GameSession } from './services/sessionService';

// Pages
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { PartyModeSetupPage } from './pages/PartyModeSetupPage';
import { PartyModeGame } from './components/party/PartyModeGame';
import { MultiplayerRoomPage } from './pages/MultiplayerRoomPage';
import { MyDecksPage } from './pages/MyDecksPage';
import { CreateDeckPage } from './pages/CreateDeckPage';
import { EditDeckPage } from './pages/EditDeckPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { adminService } from './services/adminService';

export type AppView =
  | 'home'
  | 'game'
  | 'party-setup'
  | 'party-game'
  | 'multiplayer'
  | 'my-decks'
  | 'create-deck'
  | 'edit-deck'
  | 'profile'
  | 'admin';

function AppContent() {
  useEffect(() => adminService.watchOfficialPrompts(), []);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedGameId, setSelectedGameId] = useState<GameId>('truth-or-dare');
  const [activeCustomDeck, setActiveCustomDeck] = useState<CustomDeck | null>(null);
  const [editingDeck, setEditingDeck] = useState<CustomDeck | null>(null);
  const [activePartyConfig, setActivePartyConfig] = useState<PartyModeConfig | null>(null);
  const [activeRoomCode, setActiveRoomCode] = useState<string>('');
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Sync with browser URL hash / history
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('game/')) {
        const id = hash.replace('game/', '') as GameId;
        setSelectedGameId(id);
        setActiveCustomDeck(null);
        setCurrentView('game');
      } else if (hash.startsWith('room/')) {
        const code = hash.replace('room/', '');
        setActiveRoomCode(code);
        setCurrentView('multiplayer');
      } else if (hash === 'multiplayer' || hash === 'rooms') {
        setCurrentView('multiplayer');
      } else if (hash === 'party' || hash === 'party-setup') {
        setCurrentView('party-setup');
      } else if (hash === 'my-decks') {
        setCurrentView('my-decks');
      } else if (hash === 'create-deck') {
        setCurrentView('create-deck');
      } else if (hash === 'profile') {
        setCurrentView('profile');
      } else if (hash === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (view: AppView, param?: string) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'game') {
      window.location.hash = `#/game/${param || selectedGameId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'multiplayer') {
      window.location.hash = param ? `#/room/${param}` : `#/rooms`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = `#/${view}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectGame = (gameId: GameId) => {
    setSelectedGameId(gameId);
    setActiveCustomDeck(null);
    navigateTo('game', gameId);
  };

  const handlePlayDeck = (deck: CustomDeck) => {
    setSelectedGameId(deck.gameId);
    setActiveCustomDeck(deck);
    setCurrentView('game');
    window.location.hash = `#/deck/${deck.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditDeck = (deck: CustomDeck) => {
    setEditingDeck(deck);
    navigateTo('edit-deck');
  };

  const handleStartPartyMode = (config: PartyModeConfig) => {
    setActivePartyConfig(config);
    setCurrentView('party-game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickPlay = () => {
    const quickConfig: PartyModeConfig = {
      playerNames: ['Sam', 'Alex', 'Jordan', 'Taylor'],
      selectedGames: Object.keys(GAMES_CONFIG) as GameId[],
      categories: ['medium', 'spicy'],
      roundCount: 20,
      enableChaosWheel: true,
      enableMysteryCards: true,
      enableScoring: true,
      timerSeconds: 30,
      contentBoundary: 'all',
    };
    handleStartPartyMode(quickConfig);
  };

  const handleResumeSession = (session: GameSession) => {
    if (session.mode === 'party' && session.partyConfig) {
      setActivePartyConfig(session.partyConfig);
      setCurrentView('party-game');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedGameId(session.gameId);
      setActiveCustomDeck(null);
      navigateTo('game', session.gameId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f3f4f6] relative isolate w-full max-w-full overflow-x-hidden">
      <AmbientBackground />
      <Header
        currentView={currentView}
        onNavigate={(v) => navigateTo(v as AppView)}
        onOpenAudio={() => setIsAudioModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onQuickPlay={handleQuickPlay}
      />

      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomePage
            onSelectGame={handleSelectGame}
            onPlayDeck={handlePlayDeck}
            onStartPartyMode={() => navigateTo('party-setup')}
            onOpenMultiplayer={() => navigateTo('multiplayer')}
            onQuickPlay={handleQuickPlay}
            onResumeSession={handleResumeSession}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
          />
        )}

        {currentView === 'party-setup' && (
          <PartyModeSetupPage
            onStartParty={handleStartPartyMode}
            onCancel={() => navigateTo('home')}
          />
        )}

        {currentView === 'party-game' && activePartyConfig && (
          <PartyModeGame
            config={activePartyConfig}
            onExit={() => navigateTo('home')}
          />
        )}

        {currentView === 'multiplayer' && (
          <MultiplayerRoomPage
            initialRoomCode={activeRoomCode}
            onExit={() => navigateTo('home')}
          />
        )}

        {currentView === 'game' && (
          <GamePage
            gameId={selectedGameId}
            customDeck={activeCustomDeck}
            onExit={() => navigateTo('home')}
          />
        )}

        {currentView === 'my-decks' && (
          <MyDecksPage
            onCreateNew={() => navigateTo('create-deck')}
            onEditDeck={handleEditDeck}
            onPlayDeck={handlePlayDeck}
          />
        )}

        {currentView === 'create-deck' && (
          <CreateDeckPage
            onDeckCreated={(deck) => {
              setActiveCustomDeck(deck);
              navigateTo('my-decks');
            }}
            onCancel={() => navigateTo('my-decks')}
          />
        )}

        {currentView === 'edit-deck' && editingDeck && (
          <EditDeckPage
            deck={editingDeck}
            onDeckUpdated={() => navigateTo('my-decks')}
            onCancel={() => navigateTo('my-decks')}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage onNavigate={(v) => navigateTo(v as AppView)} />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage onNavigate={(v) => navigateTo(v as AppView)} />
        )}
      </main>

      {/* Auth Modal for Sign In / Sign Up */}
      <AuthModal />

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />

      {/* Session History & Resume Modal */}
      <SessionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onResumeSession={(session) => {
          setIsHistoryModalOpen(false);
          handleResumeSession(session);
        }}
      />

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <GameSettingsProvider>
          <AppContent />
        </GameSettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
