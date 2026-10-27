import React, { useId, useState } from 'react';
import { GameId, PromptItem } from '../../types/game';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../../data/gamesConfig';
import { getPromptValidationErrors } from '../../utils/promptValidation';

interface Props {
  initial?: Partial<PromptItem>;
  fixedGame?: GameId;
  fixedMode?: 'online' | 'in-person';
  onSave: (card: PromptItem) => Promise<void>;
  onClose: () => void;
  saveLabel?: string;
  notice?: string;
}

export function PromptEditor({ initial, fixedGame, fixedMode, onSave, onClose, saveLabel = 'Save card', notice }: Props) {
  const titleId = useId();
  const [card, setCard] = useState<PromptItem>({
    id: crypto.randomUUID(),
    gameId: fixedGame || 'truth-or-dare',
    category: 'medium',
    text: '',
    type: 'truth',
    playMode: fixedMode || 'in-person',
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const field = (key: keyof PromptItem, value: unknown) => setCard((previous) => ({ ...previous, [key]: value }));
  const inputClass = 'w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white';
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const result: PromptItem = {
      ...card,
      text:
        card.gameId === 'would-you-rather'
          ? `Would you rather ${card.optionA?.trim()} or ${card.optionB?.trim()}?`
          : card.text.trim(),
      type: card.gameId === 'truth-or-dare' ? card.type : undefined,
      optionA: card.gameId === 'would-you-rather' ? card.optionA?.trim() : undefined,
      optionB: card.gameId === 'would-you-rather' ? card.optionB?.trim() : undefined,
      forfeit: card.gameId === 'truth-or-sip' ? card.forfeit?.trim() : undefined,
      discussionPrompt: card.gameId === 'hot-takes' ? card.discussionPrompt?.trim() : undefined,
      scenario: card.gameId === 'red-flag-green-flag' ? card.text.trim() : undefined,
      confessionStarter: card.gameId === 'confessions' ? card.confessionStarter?.trim() : undefined,
      originGameId: undefined,
      rarity: card.isLegendary ? 'legendary' : undefined,
    };
    const errors = getPromptValidationErrors(result);
    if (errors.length) {
      setError(errors.join(' '));
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(result);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save this card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl glass-panel border border-brand-pink/30"
      >
        <h3 id={titleId} className="text-xl font-black text-white mb-4">
          {initial?.id ? 'Edit card' : 'Add card'}
        </h3>
        <form onSubmit={save} className="space-y-4">
          {notice && <p className="text-sm text-zinc-400">{notice}</p>}
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-zinc-300">
              Game
              <select
                className={inputClass}
                value={card.gameId}
                disabled={!!fixedGame}
                onChange={(e) => field('gameId', e.target.value)}
              >
                {Object.values(GAMES_CONFIG)
                  .filter((g) => g.id !== 'chaos-mix')
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
              </select>
            </label>
            <label className="text-xs text-zinc-300">
              Category
              <select className={inputClass} value={card.category} onChange={(e) => field('category', e.target.value)}>
                {Object.entries(CATEGORY_LABELS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-zinc-300">
              Play mode
              <select
                className={inputClass}
                value={card.playMode || 'in-person'}
                disabled={!!fixedMode}
                onChange={(e) => field('playMode', e.target.value)}
              >
                <option value="in-person">In person</option>
                <option value="online">Online</option>
              </select>
            </label>
            {card.gameId === 'truth-or-dare' && (
              <label className="text-xs text-zinc-300">
                Card type
                <select
                  className={inputClass}
                  value={card.type || 'truth'}
                  onChange={(e) => field('type', e.target.value)}
                >
                  <option value="truth">Truth</option>
                  <option value="dare">Dare</option>
                </select>
              </label>
            )}
          </div>
          {card.gameId === 'would-you-rather' ? (
            <>
              <label className="block text-xs text-zinc-300">
                Option A
                <input
                  className={inputClass}
                  value={card.optionA || ''}
                  required
                  onChange={(e) => field('optionA', e.target.value)}
                />
              </label>
              <label className="block text-xs text-zinc-300">
                Option B
                <input
                  className={inputClass}
                  value={card.optionB || ''}
                  required
                  onChange={(e) => field('optionB', e.target.value)}
                />
              </label>
            </>
          ) : (
            <label className="block text-xs text-zinc-300">
              Card text
              <textarea
                className={inputClass}
                value={card.text}
                required
                rows={4}
                onChange={(e) => field('text', e.target.value)}
              />
            </label>
          )}
          {card.gameId === 'truth-or-sip' && (
            <label className="block text-xs text-zinc-300">
              Forfeit
              <input
                className={inputClass}
                placeholder="Take a sip of any drink, or pass."
                value={card.forfeit || ''}
                onChange={(e) => field('forfeit', e.target.value)}
              />
            </label>
          )}
          {card.gameId === 'hot-takes' && (
            <label className="block text-xs text-zinc-300">
              Discussion prompt (optional)
              <input
                className={inputClass}
                value={card.discussionPrompt || ''}
                onChange={(e) => field('discussionPrompt', e.target.value)}
              />
            </label>
          )}
          {card.gameId === 'confessions' && (
            <label className="block text-xs text-zinc-300">
              Confession starter (optional)
              <input
                className={inputClass}
                value={card.confessionStarter || ''}
                onChange={(e) => field('confessionStarter', e.target.value)}
              />
            </label>
          )}
          <label className="flex gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={!!card.isLegendary}
              onChange={(e) => field('isLegendary', e.target.checked)}
            />
            Rare card
          </label>
          {card.isLegendary && (
            <label className="block text-xs text-zinc-300">
              Rare card title
              <input
                className={inputClass}
                value={card.legendaryTitle || ''}
                onChange={(e) => field('legendaryTitle', e.target.value)}
              />
            </label>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" disabled={saving} onClick={onClose} className="px-4 py-2 text-zinc-300">
              Cancel
            </button>
            <button
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-brand-pink text-white font-bold disabled:opacity-50"
            >
            {saving ? 'Saving…' : saveLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
