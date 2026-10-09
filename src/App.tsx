import React, { useState, useEffect } from 'react';
import { GameId } from './types/game';
import { CustomDeck } from './types/deck';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { GameSettingsProvider } from './context/GameSettingsContext';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { MyDecksPage } from './pages/MyDecksPage';
import { CreateDeckPage } from './pages/CreateDeckPage';
import { EditDeckPage } from './pages/EditDeckPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export type AppView = 'home' | 'game' | 'my-decks' | 'create-deck' | 'edit-deck' | 'profile' | 'admin';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedGameId, setSelectedGameId] = useState<GameId>('truth-or-dare');
  const [activeCustomDeck, setActiveCustomDeck] = useState<CustomDeck | null>(null);
  const [editingDeck, setEditingDeck] = useState<CustomDeck | null>(null);

  // Sync with browser URL hash / history
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('game/')) {
        const id = hash.replace('game/', '') as GameId;
        setSelectedGameId(id);
        setActiveCustomDeck(null);
        setCurrentView('game');
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

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f3f4f6] relative">
      <AmbientBackground />
      <Header currentView={currentView} onNavigate={(v) => navigateTo(v as AppView)} />

      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomePage
            onSelectGame={handleSelectGame}
            onPlayDeck={handlePlayDeck}
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
