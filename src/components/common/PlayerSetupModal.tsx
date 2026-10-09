import React, { useState } from 'react';
import { useGameSettings } from '../../context/GameSettingsContext';
import { Users, Plus, X, Edit2, Check } from 'lucide-react';

interface PlayerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: string[];
  onUpdatePlayers: (players: string[]) => void;
}

export const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({
  isOpen,
  onClose,
  players,
  onUpdatePlayers,
}) => {
  const { savedPlayers, setSavedPlayers } = useGameSettings();
  const [newName, setNewName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newName.trim();
    if (!clean) return;
    if (players.includes(clean)) return;

    const updated = [...players, clean];
    onUpdatePlayers(updated);
    setSavedPlayers(updated);
    setNewName('');
  };

  const handleRemove = (index: number) => {
    const updated = players.filter((_, i) => i !== index);
    onUpdatePlayers(updated);
    setSavedPlayers(updated);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(players[index]);
  };

  const saveEdit = (index: number) => {
    const clean = editingValue.trim();
    if (!clean) return;
    const updated = [...players];
    updated[index] = clean;
    onUpdatePlayers(updated);
    setSavedPlayers(updated);
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl animate-scale-in flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-pink" />
            <h3 className="text-lg font-bold text-white">Party Players</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-1">
          {players.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No players added yet. Add names below to track turns!
            </div>
          ) : (
            players.map((player, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/15 transition-all"
              >
                {editingIndex === idx ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="bg-black/60 border border-brand-pink/50 rounded-lg px-2 py-1 text-sm text-white flex-1 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(idx)}
                      className="p-1 text-emerald-400 hover:text-emerald-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-[11px] font-bold text-violet-300 flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium text-zinc-200">{player}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(idx)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
                        title="Edit name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/[0.05]"
                        title="Remove player"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Player Input */}
        <form onSubmit={handleAdd} className="pt-4 border-t border-white/[0.08] flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter player name..."
            className="flex-1 bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink/60 transition-all"
            maxLength={20}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-brand-pink to-brand-violet rounded-xl text-white font-medium text-sm flex items-center gap-1.5 shadow-neon-pink/30 hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-semibold text-zinc-200 transition-all"
        >
          Done
        </button>

      </div>
    </div>
  );
};
