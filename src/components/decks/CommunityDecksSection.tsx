import React, { useState, useEffect } from 'react';
import { CustomDeck } from '../../types/deck';
import { GameId } from '../../types/game';
import { GAMES_CONFIG } from '../../data/gamesConfig';
import { deckService } from '../../services/deckService';
import { DeckCard } from './DeckCard';
import { Sparkles, Search, Filter } from 'lucide-react';

interface CommunityDecksSectionProps {
  onPlayDeck: (deck: CustomDeck) => void;
}

export const CommunityDecksSection: React.FC<CommunityDecksSectionProps> = ({ onPlayDeck }) => {
  const [decks, setDecks] = useState<CustomDeck[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState<GameId | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const publicDecks = await deckService.getPublicDecks();
        setDecks(publicDecks);
      } catch (e) {
        console.warn('Failed to load community decks', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecks();
  }, []);

  const filteredDecks = decks.filter(deck => {
    const matchesSearch =
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.creatorUsername.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGameFilter === 'all' || deck.gameId === selectedGameFilter;
    return matchesSearch && matchesGame;
  });

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] mt-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-brand-violet/20 text-brand-violet border border-brand-violet/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-violet">
              Created By The Community
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Community Decks
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
            Explore approved player-crafted decks. Open and play any deck instantly with your friends—no sign-in required.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decks or creators..."
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink"
            />
          </div>

          {/* Game filter */}
          <select
            value={selectedGameFilter}
            onChange={(e) => setSelectedGameFilter(e.target.value as any)}
            className="w-full sm:w-auto bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-brand-pink"
          >
            <option value="all">All Games</option>
            {Object.values(GAMES_CONFIG).map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Decks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-3xl glass-panel animate-pulse" />
          ))}
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="text-center py-16 rounded-3xl glass-panel border border-dashed border-white/10">
          <p className="text-sm font-semibold text-zinc-400">
            No community decks matched your search.
          </p>
          <span className="text-xs text-zinc-500 mt-1 block">
            Be the first to create and publish a deck for this game!
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onPlay={onPlayDeck}
            />
          ))}
        </div>
      )}

    </section>
  );
};

