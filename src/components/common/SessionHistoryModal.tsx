import React, { useState, useEffect } from 'react';
import { sessionService, GameSession } from '../../services/sessionService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { soundEffects } from '../../utils/audio';
import {
  History,
  X,
  Play,
  RotateCcw,
  Trash2,
  Edit2,
  Archive,
  Check,
  Calendar,
  Users,
  Flame,
  Award,
} from 'lucide-react';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResumeSession: (session: GameSession) => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  onResumeSession,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await sessionService.getAllSessions(currentUser?.uid);
      setSessions(data);
    } catch {
      showToast('Failed to load session history', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, currentUser?.uid]);

  if (!isOpen) return null;

  const handleStartRename = (s: GameSession) => {
    setEditingId(s.id);
    setEditName(s.name);
  };

  const handleSaveRename = async (id: string) => {
    if (!editName.trim()) return;
    soundEffects.playClick();
    await sessionService.renameSession(id, editName.trim());
    setSessions(prev => prev.map(s => s.id === id ? { ...s, name: editName.trim() } : s));
    setEditingId(null);
    showToast('Session renamed', 'success');
  };

  const handleToggleArchive = async (id: string) => {
    soundEffects.playClick();
    await sessionService.toggleArchiveSession(id);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isArchived: !s.isArchived } : s));
    showToast('Session status updated', 'info');
  };

  const handleDelete = async (id: string) => {
    soundEffects.playClick();
    await sessionService.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast('Session deleted', 'info');
  };

  const handleResetCardHistory = () => {
    soundEffects.playClick();
    sessionService.resetCardHistory();
    showToast('Deck card history cleared. All cards are fresh!', 'success');
  };

  const handleResume = (s: GameSession) => {
    soundEffects.playSuccess();
    onResumeSession(s);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl glass-panel border border-brand-pink/40 p-6 sm:p-8 relative shadow-neon-pink/20 max-h-[90vh] flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-pink/20 border border-brand-pink/40 flex items-center justify-center text-brand-pink">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase text-white tracking-wide">
                Session History & Saved Games
              </h3>
              <p className="text-xs text-zinc-400">
                Pick up where you left off with zero repeated cards
              </p>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 my-2 max-h-[50vh] pr-1">
          {isLoading ? (
            <div className="text-center py-12 text-zinc-400 text-xs">
              Loading session history...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-pink" />
              <p className="font-bold text-white text-sm mb-1">No saved sessions yet</p>
              <p>Your game sessions will automatically save here after each card!</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={`p-4 rounded-2xl border transition-all ${
                  s.isArchived
                    ? 'bg-white/[0.01] border-white/5 opacity-60'
                    : 'bg-white/[0.03] border-white/10 hover:border-brand-pink/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 truncate">
                    {editingId === s.id ? (
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-black/60 border border-brand-pink/50 rounded-xl px-3 py-1 text-xs text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(s.id)}
                          className="p-1 rounded-lg bg-brand-pink text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white truncate">
                          {s.name}
                        </span>
                        <button
                          onClick={() => handleStartRename(s)}
                          className="text-zinc-500 hover:text-white p-0.5"
                          title="Rename"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-brand-pink">
                        <Flame className="w-3.5 h-3.5" />
                        {s.gameId} ({s.category})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Round {s.currentRound}
                      </span>
                      {s.players.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {s.players.length} Players
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResume(s)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-neon-pink flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Resume</span>
                    </button>

                    <button
                      onClick={() => handleToggleArchive(s.id)}
                      className="p-2 rounded-xl border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title={s.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-xl border border-white/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info & Reset card history button */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-zinc-500 text-[11px]">
            Card deduplication ensures no prompt repeats until all cards are drawn.
          </span>

          <button
            onClick={handleResetCardHistory}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-amber-500/40 text-zinc-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset history to allow all cards to be played again"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Deck Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

