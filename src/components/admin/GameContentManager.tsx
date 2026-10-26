import React, { useEffect, useState } from 'react';
import { PromptItem } from '../../types/game';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../../data/gamesConfig';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { PromptEditor } from './PromptEditor';

export function GameContentManager() {
  const { showToast } = useToast();
  const [cards, setCards] = useState<PromptItem[]>([]);
  const [game, setGame] = useState('all');
  const [category, setCategory] = useState('all');
  const [mode, setMode] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<Partial<PromptItem> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(100);
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [local, online] = await Promise.all([
        adminService.getAllPromptsForManager(undefined, undefined, 'in-person', true),
        adminService.getAllPromptsForManager(undefined, undefined, 'online', true),
      ]);
      setCards([...local, ...online]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load cards.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const changeStatus = async (card: PromptItem, active: boolean) => {
    setBusy(true);
    try {
      await adminService.updateOfficialPrompt(card.id, { isActive: active });
      showToast(active ? 'Card restored.' : 'Card removed from play.', 'success');
      await load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not update card.', 'error');
    } finally {
      setBusy(false);
    }
  };
  const filtered = cards.filter(
    (card) =>
      (game === 'all' || card.gameId === game) &&
      (category === 'all' || card.category === category) &&
      (mode === 'all' || (card.playMode || 'in-person') === mode) &&
      (status === 'all' || (status === 'active' ? card.isActive !== false : card.isActive === false)) &&
      [card.text, card.optionA, card.optionB, card.id].join(' ').toLowerCase().includes(search.toLowerCase())
  );
  const control = 'bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-white">Game Content Manager</h3>
          <p className="text-sm text-zinc-400">
            Manage cards across every game, category, and play mode. Deleted cards can be restored.
          </p>
        </div>
        <button onClick={() => setEditor({})} className="px-4 py-2 rounded-xl bg-brand-pink font-bold text-white">
          Add card
        </button>
      </div>
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <input
          aria-label="Search cards"
          className={control}
          placeholder="Search cards or IDs"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisible(100);
          }}
        />
        <select
          aria-label="Filter game"
          className={control}
          value={game}
          onChange={(e) => {
            setGame(e.target.value);
            setVisible(100);
          }}
        >
          <option value="all">All games</option>
          {Object.values(GAMES_CONFIG)
            .filter((g) => g.id !== 'chaos-mix')
            .map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
        </select>
        <select
          aria-label="Filter category"
          className={control}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setVisible(100);
          }}
        >
          <option value="all">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter play mode"
          className={control}
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setVisible(100);
          }}
        >
          <option value="all">Both play modes</option>
          <option value="in-person">In person</option>
          <option value="online">Online</option>
        </select>
        <select
          aria-label="Filter status"
          className={control}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setVisible(100);
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>
      {error && (
        <p role="alert" className="text-red-300">
          {error}
        </p>
      )}
      <div className="flex justify-between text-sm text-zinc-400">
        <p>{loading ? 'Loading cards…' : `${filtered.length} cards`}</p>
        <button disabled={loading || busy} onClick={() => void load()}>
          Refresh
        </button>
      </div>
      <div className="space-y-3">
        {filtered.slice(0, visible).map((card) => (
          <article
            key={card.id}
            className={`p-4 rounded-2xl bg-zinc-900/70 border border-white/10 ${card.isActive === false ? 'opacity-60' : ''}`}
          >
            <p className="text-xs text-brand-pink mb-2">
              {GAMES_CONFIG[card.gameId]?.title} · {CATEGORY_LABELS[card.category]?.label} ·{' '}
              {card.playMode === 'online' ? 'Online' : 'In person'}
              {card.type ? ` · ${card.type}` : ''}
              {card.isLegendary ? ' · Rare' : ''}
              {card.isActive === false ? ' · Deleted' : ''}
            </p>
            <p className="text-sm text-white">{card.optionA ? `A: ${card.optionA} / B: ${card.optionB}` : card.text}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <button disabled={busy} onClick={() => setEditor(card)} className="text-sm text-zinc-200">
                Edit card
              </button>
              {card.isActive === false ? (
                <button
                  disabled={busy}
                  onClick={() => void changeStatus(card, true)}
                  className="text-sm text-emerald-300"
                >
                  Restore card
                </button>
              ) : (
                <button
                  disabled={busy}
                  onClick={() => {
                    if (confirm('Remove this card from all games? You can restore it later.'))
                      void changeStatus(card, false);
                  }}
                  className="text-sm text-red-300"
                >
                  Delete card
                </button>
              )}
              <span className="text-[10px] text-zinc-500 break-all">{card.id}</span>
            </div>
          </article>
        ))}
      </div>
      {!loading && !filtered.length && <p className="text-zinc-400">No cards match these filters.</p>}
      {filtered.length > visible && (
        <button onClick={() => setVisible((n) => n + 100)} className={control}>
          Show more cards
        </button>
      )}
      {editor && (
        <PromptEditor
          initial={editor}
          onClose={() => setEditor(null)}
          onSave={async (card) => {
            await adminService.addOfficialPrompt(card);
            showToast('Card saved.', 'success');
            await load();
          }}
        />
      )}
    </div>
  );
}
