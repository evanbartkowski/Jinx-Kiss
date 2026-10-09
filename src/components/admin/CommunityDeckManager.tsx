import React, { useState, useEffect } from 'react';
import { CustomDeck } from '../../types/deck';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Check, X, Eye, ShieldAlert, Globe, Lock, Link2 } from 'lucide-react';

export const CommunityDeckManager: React.FC = () => {
  const { showToast } = useToast();
  const [decks, setDecks] = useState<CustomDeck[]>([]);
  const [previewDeck, setPreviewDeck] = useState<CustomDeck | null>(null);

  const loadDecks = async () => {
    const list = await adminService.getAllDecksForModeration();
    setDecks(list);
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const handleModerate = async (deckId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      await adminService.moderateDeck(deckId, status, reason);
      showToast(`Deck ${status === 'approved' ? 'approved for discovery' : 'rejected'}.`, 'success');
      loadDecks();
      if (previewDeck?.id === deckId) setPreviewDeck(null);
    } catch (e: any) {
      showToast(e.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-white">Community Deck Moderation</h3>
        <p className="text-xs text-zinc-400">Review public user-created decks for community discovery guidelines</p>
      </div>

      <div className="space-y-4">
        {decks.map(deck => (
          <div
            key={deck.id}
            className="p-5 rounded-2xl glass-panel border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                  style={{
                    color: deck.themeColor || '#FF4DA6',
                    borderColor: `${deck.themeColor || '#FF4DA6'}40`,
                    backgroundColor: `${deck.themeColor || '#FF4DA6'}15`,
                  }}
                >
                  {deck.gameId}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  deck.moderationStatus === 'approved'
                    ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
                    : deck.moderationStatus === 'rejected'
                    ? 'border-red-500/40 text-red-300 bg-red-950/40'
                    : 'border-amber-500/40 text-amber-300 bg-amber-950/40'
                }`}>
                  {deck.moderationStatus}
                </span>

                <span className="text-xs text-zinc-400">
                  By @{deck.creatorUsername} • {deck.cards.length} Cards
                </span>
              </div>

              <h4 className="text-base font-bold text-white">{deck.title}</h4>
              <p className="text-xs text-zinc-400 line-clamp-1">{deck.description}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setPreviewDeck(deck)}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Cards</span>
              </button>

              {deck.moderationStatus !== 'approved' && (
                <button
                  onClick={() => handleModerate(deck.id, 'approved')}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-neon-green transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              )}

              {deck.moderationStatus !== 'rejected' && (
                <button
                  onClick={() => handleModerate(deck.id, 'rejected', 'Violates community standards')}
                  className="px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Deck Preview Modal */}
      {previewDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl p-6 rounded-3xl glass-panel border border-white/20 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h4 className="text-lg font-bold text-white">{previewDeck.title}</h4>
                <p className="text-xs text-zinc-400">Cards inspection: {previewDeck.cards.length} cards</p>
              </div>
              <button
                onClick={() => setPreviewDeck(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
              {previewDeck.cards.map((card, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-zinc-200">
                  <span className="font-bold text-brand-pink mr-2">#{idx + 1}</span>
                  {card.optionA ? `A: ${card.optionA} | B: ${card.optionB}` : card.text}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setPreviewDeck(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
