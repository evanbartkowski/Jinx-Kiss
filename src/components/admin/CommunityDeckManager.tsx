import React, { useEffect, useState } from 'react';
import { CustomDeck } from '../../types/deck';
import { PromptItem } from '../../types/game';
import { GAMES_CONFIG } from '../../data/gamesConfig';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { PromptEditor } from './PromptEditor';

export function CommunityDeckManager() {
  const { showToast } = useToast();
  const [decks, setDecks] = useState<CustomDeck[]>([]);
  const [selected, setSelected] = useState<CustomDeck | null>(null);
  const [editor, setEditor] = useState<Partial<PromptItem> | null>(null);
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      setDecks(await adminService.getAllDecksForModeration());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load decks.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const update = async (deck: CustomDeck, updates: Partial<CustomDeck>) => {
    setSaving(true);
    try {
      const saved = await adminService.updateManagedDeck(deck.id, updates);
      setDecks((list) => list.map((d) => (d.id === saved.id ? saved : d)));
      setSelected((current) => (current?.id === saved.id ? saved : current));
      showToast('Deck saved.', 'success');
    } finally {
      setSaving(false);
    }
  };
  const runUpdate = (deck: CustomDeck, updates: Partial<CustomDeck>) => {
    void update(deck, updates).catch((e) =>
      showToast(e instanceof Error ? e.message : 'Could not save deck.', 'error')
    );
  };
  const filtered = decks.filter(
    (d) =>
      (visibility === 'all' || d.visibility === visibility) &&
      `${d.title} ${d.creatorUsername} ${d.gameId}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-white">All decks</h3>
        <p className="text-sm text-zinc-400">
          Browse public, unlisted, and private decks. Add, edit, or delete their cards.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          aria-label="Search decks"
          value={search}
          placeholder="Search decks or creators"
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-white"
        />
        <select
          aria-label="Deck visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-white"
        >
          <option value="all">All visibility</option>
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="private">Private</option>
        </select>
        <button disabled={loading || saving} onClick={() => void load()} className="text-zinc-300">
          Refresh
        </button>
      </div>
      {error && (
        <p role="alert" className="text-red-300">
          {error}
        </p>
      )}
      {loading && <p className="text-zinc-400">Loading decks…</p>}
      {filtered.map((deck) => (
        <article key={deck.id} className="p-5 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-3">
          <div>
            <h4 className="font-bold text-white">{deck.title}</h4>
            <p className="text-xs text-zinc-400">
              @{deck.creatorUsername} · {GAMES_CONFIG[deck.gameId]?.title} · {deck.visibility} ·{' '}
              {deck.playMode === 'online' ? 'Online' : 'In person'} · {deck.cards.length} cards ·{' '}
              {deck.moderationStatus}
            </p>
          </div>
          <p className="text-sm text-zinc-300">{deck.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <button disabled={saving} onClick={() => setSelected(deck)} className="text-brand-pink">
              Manage cards
            </button>
            {deck.visibility === 'public' && (
              <button
                disabled={saving}
                className="text-zinc-300"
                onClick={() =>
                  runUpdate(deck, { moderationStatus: deck.moderationStatus === 'rejected' ? 'approved' : 'rejected' })
                }
              >
                {deck.moderationStatus === 'rejected' ? 'Approve for discovery' : 'Hide from discovery'}
              </button>
            )}
          </div>
        </article>
      ))}
      {!loading && !filtered.length && <p className="text-zinc-400">No decks match these filters.</p>}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center">
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} cards`}
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-3xl glass-panel border border-white/15 space-y-4"
          >
            <div className="flex justify-between gap-4">
              <h3 className="font-bold text-xl text-white">{selected.title}</h3>
              <button disabled={saving} className="text-zinc-300" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
            <button
              disabled={saving}
              onClick={() =>
                setEditor({
                  gameId: selected.gameId === 'chaos-mix' ? 'truth-or-dare' : selected.gameId,
                  playMode: selected.playMode || 'in-person',
                  category: selected.gameMode || 'medium',
                })
              }
              className="px-4 py-2 rounded-xl bg-brand-pink text-white font-bold"
            >
              Add card to deck
            </button>
            {selected.cards.map((card, index) => (
              <article key={card.id} className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
                <p className="text-xs text-zinc-400">
                  Card {index + 1} · {card.category} {card.type && `· ${card.type}`}
                </p>
                <p className="text-sm text-white">
                  {card.optionA ? `A: ${card.optionA} / B: ${card.optionB}` : card.text}
                </p>
                <div className="flex gap-4 text-sm">
                  <button disabled={saving} className="text-zinc-200" onClick={() => setEditor(card)}>
                    Edit card
                  </button>
                  <button
                    disabled={saving}
                    className="text-red-300"
                    onClick={() => {
                      if (confirm('Delete this card from this deck?'))
                        runUpdate(selected, { cards: selected.cards.filter((c) => c.id !== card.id) });
                    }}
                  >
                    Delete card
                  </button>
                </div>
              </article>
            ))}
            {!selected.cards.length && (
              <p className="text-zinc-400">This deck has no cards. Add a card to make it playable.</p>
            )}
          </section>
        </div>
      )}
      {selected && editor && (
        <PromptEditor
          initial={editor}
          fixedGame={selected.gameId === 'chaos-mix' ? undefined : selected.gameId}
          fixedMode={selected.playMode || 'in-person'}
          onClose={() => setEditor(null)}
          onSave={async (card) => {
            const exists = selected.cards.some((c) => c.id === card.id);
            await update(selected, {
              cards: exists ? selected.cards.map((c) => (c.id === card.id ? card : c)) : [...selected.cards, card],
            });
          }}
        />
      )}
    </div>
  );
}
