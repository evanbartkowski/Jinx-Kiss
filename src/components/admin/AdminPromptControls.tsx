import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayingDeck } from '../../context/PlayingDeckContext';
import { useToast } from '../../context/ToastContext';
import { PromptItem } from '../../types/game';
import { adminService } from '../../services/adminService';
import { PromptEditor } from './PromptEditor';

export function AdminPromptControls({ prompt }: { prompt: PromptItem }) {
  const { isAdmin } = useAuth();
  const deck = usePlayingDeck();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!isAdmin) return null;
  const source = { ...prompt, gameId: prompt.originGameId || prompt.gameId, originGameId: undefined };
  const remove = async () => {
    if (
      !confirm(
        deck ? 'Permanently remove this card from this deck?' : 'Remove this official card from play for everyone?'
      )
    )
      return;
    setBusy(true);
    try {
      await adminService.removePlayingPrompt(source, deck?.id);
      showToast('Card removed from play.', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not remove card.', 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center gap-2 flex-wrap w-full pt-2" data-admin-prompt-id={prompt.id}>
        <button
          type="button"
          disabled={busy}
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-fuchsia-400/40 bg-fuchsia-950/40 text-xs font-bold text-fuchsia-200 hover:bg-fuchsia-900/50"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit prompt<span className="text-[9px] uppercase tracking-wider text-fuchsia-400">Admin</span>
        </button>
        <button
          type="button"
          aria-label="Delete prompt"
          title="Delete prompt"
          disabled={busy}
          onClick={() => void remove()}
          className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-red-300"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {editing &&
        createPortal(
          <PromptEditor
            initial={source}
            fixedGame={source.gameId}
            fixedMode={source.playMode || deck?.playMode || 'in-person'}
            saveLabel="Save permanently"
            notice={
              deck
                ? 'Save this change to the deck for everyone who plays it.'
                : 'Save this change to the official card for everyone. Your current round stays in progress.'
            }
            onClose={() => setEditing(false)}
            onSave={async (card) => {
              await adminService.savePlayingPrompt(card, deck?.id);
              showToast('Prompt permanently saved.', 'success');
            }}
          />,
          document.body
        )}
    </>
  );
}
