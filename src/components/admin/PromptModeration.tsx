import React, { useState, useEffect } from 'react';
import { CommunitySubmission } from '../../types/submission';
import { adminService } from '../../services/adminService';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../../data/gamesConfig';
import { useToast } from '../../context/ToastContext';
import { Check, X, Edit, MessageSquare, AlertCircle } from 'lucide-react';

export const PromptModeration: React.FC = () => {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [editingSub, setEditingSub] = useState<CommunitySubmission | null>(null);
  const [editText, setEditText] = useState('');

  const loadSubmissions = async () => {
    const all = await adminService.getAllSubmissions();
    setSubmissions(all);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = async (sub: CommunitySubmission) => {
    try {
      await adminService.approveSubmission(sub.id);
      showToast('Prompt approved and published to game library!', 'success');
      loadSubmissions();
    } catch (e: any) {
      showToast(e.message || 'Failed to approve', 'error');
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    try {
      await adminService.rejectSubmission(rejectingId, rejectReason || 'Inappropriate or duplicate content');
      showToast('Submission rejected.', 'info');
      setRejectingId(null);
      setRejectReason('');
      loadSubmissions();
    } catch (e: any) {
      showToast(e.message || 'Failed to reject', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSub || !editText.trim()) return;
    try {
      await adminService.approveSubmission(editingSub.id, { text: editText.trim() });
      showToast('Prompt edited, approved, and published!', 'success');
      setEditingSub(null);
      setEditText('');
      loadSubmissions();
    } catch (e: any) {
      showToast(e.message || 'Failed to save', 'error');
    }
  };

  const filtered = submissions.filter(s => s.status === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Sub-header & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">Community Prompt Moderation</h3>
          <p className="text-xs text-zinc-400">Review, edit, and publish player-submitted prompts to official decks</p>
        </div>

        <div className="flex rounded-xl bg-zinc-900 border border-white/10 p-1">
          {(['pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filterStatus === tab
                  ? 'bg-brand-pink text-white shadow-neon-pink'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-3xl glass-panel border border-dashed border-white/10">
          <p className="text-sm font-semibold text-zinc-400">
            No {filterStatus} submissions right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(sub => {
            const game = GAMES_CONFIG[sub.gameId] || { title: sub.gameId, themeColor: '#FF4DA6' };
            const cat = CATEGORY_LABELS[sub.category] || { label: sub.category };

            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl glass-panel border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                      style={{
                        color: game.themeColor,
                        backgroundColor: `${game.themeColor}15`,
                        borderColor: `${game.themeColor}40`,
                      }}
                    >
                      {game.title}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-white/10">
                      {cat.label}
                    </span>

                    {sub.type && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-brand-pink bg-pink-950 border border-pink-500/30">
                        {sub.type}
                      </span>
                    )}

                    <span className="text-[11px] text-zinc-400">
                      By <strong className="text-white">@{sub.submitterUsername}</strong>
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {sub.optionA ? `Option A: ${sub.optionA} | Option B: ${sub.optionB}` : `"${sub.text}"`}
                  </p>

                  {sub.moderationReason && (
                    <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                      Reason: {sub.moderationReason}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                {sub.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(sub)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-neon-green transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingSub(sub);
                        setEditText(sub.text);
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setRejectingId(sub.id)}
                      className="px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-red-500/30">
            <h4 className="text-base font-bold text-white mb-2">Rejection Reason</h4>
            <p className="text-xs text-zinc-400 mb-4">Provide a clear note why this prompt was rejected.</p>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate prompt / Inappropriate language"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-neon-red"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-white/20">
            <h4 className="text-base font-bold text-white mb-2">Edit & Approve Prompt</h4>
            <textarea
              rows={4}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3.5 text-sm text-white mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingSub(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-neon-green"
              >
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
