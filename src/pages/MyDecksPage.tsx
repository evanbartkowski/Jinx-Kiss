import React, { useState, useEffect } from 'react';
import { CustomDeck } from '../types/deck';
import { deckService } from '../services/deckService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DeckCard } from '../components/decks/DeckCard';
import { Plus, Layers, Lock, Copy, Check } from 'lucide-react';

interface MyDecksPageProps {
  onCreateNew: () => void;
  onEditDeck: (deck: CustomDeck) => void;
  onPlayDeck: (deck: CustomDeck) => void;
}

export const MyDecksPage: React.FC<MyDecksPageProps> = ({
  onCreateNew,
  onEditDeck,
  onPlayDeck,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [decks, setDecks] = useState<CustomDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserDecks = async () => {
    if (!currentUser) return;
    try {
      const userDecks = await deckService.getUserDecks(currentUser.uid);
      setDecks(userDecks);
    } catch (e) {
      console.warn('Failed to load user decks', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUserDecks();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, isAuthenticated]);

  const handleDelete = async (deck: CustomDeck) => {
    if (!currentUser) return;
    if (!confirm(`Are you sure you want to delete "${deck.title}"?`)) return;

    try {
      await deckService.deleteDeck(deck.id, currentUser.uid);
      showToast('Deck deleted successfully.', 'info');
      loadUserDecks();
    } catch (e: any) {
      showToast(e.message || 'Failed to delete deck', 'error');
    }
  };

  const handleDuplicate = async (deck: CustomDeck) => {
    if (!currentUser) return;
    try {
      await deckService.duplicateDeck(deck, currentUser.uid, currentUser.username);
      showToast('Deck duplicated!', 'success');
      loadUserDecks();
    } catch (e: any) {
      showToast(e.message || 'Failed to duplicate deck', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center text-brand-pink mx-auto mb-4 shadow-neon-pink">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">My Decks Library</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6">
          Sign in or create a free username account to create, save, and manage your private and public custom party decks.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-gradient-to-r from-brand-pink to-brand-violet rounded-xl text-white font-bold text-sm shadow-neon-pink transition-all active:scale-95"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-brand-pink" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">My Decks</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Manage your personal creations, private decks, and public submissions
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-5 py-2.5 bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-neon-pink flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Deck</span>
        </button>
      </div>

      {/* Decks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-3xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-panel border border-dashed border-white/10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">You haven't created any decks yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-6">
            Build a deck with your own hilarious secrets and challenges to play with friends or share with the community!
          </p>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-pink to-brand-violet text-white font-bold text-xs rounded-xl shadow-neon-pink transition-all active:scale-95"
          >
            Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onPlay={onPlayDeck}
              onEdit={onEditDeck}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              isOwner={true}
            />
          ))}
        </div>
      )}

    </div>
  );
};

