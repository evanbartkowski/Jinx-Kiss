import React, { useState } from 'react';
import { PromptItem } from '../../types/game';
import { reportService, ReportReason } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../utils/audio';
import { Flag, X, AlertTriangle, Check, Send } from 'lucide-react';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: PromptItem;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  prompt,
}) => {
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const [reason, setReason] = useState<ReportReason>('offensive');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setIsSubmitting(true);

    try {
      await reportService.submitReport(
        prompt.id,
        prompt.text,
        prompt.gameId,
        prompt.category,
        reason,
        details,
        currentUser?.uid
      );
      showToast('Report submitted for moderation. Thank you!', 'success');
      onClose();
      setDetails('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit report';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions: { id: ReportReason; label: string; desc: string }[] = [
    { id: 'offensive', label: 'Offensive or Inappropriate', desc: 'Crosses boundaries or promotes harassment' },
    { id: 'duplicate', label: 'Duplicate or Repetitive', desc: 'Identical or very similar to another prompt' },
    { id: 'confusing', label: 'Confusing or Poorly Written', desc: 'Hard to understand or has grammar issues' },
    { id: 'wrong-difficulty', label: 'Wrong Difficulty Tier', desc: 'Too intense or too tame for this category' },
    { id: 'wrong-game', label: "Doesn't Fit Game Type", desc: 'Belongs in a different game or deck' },
    { id: 'broken', label: 'Broken or Bugged', desc: 'Missing options or formatting glitch' },
    { id: 'other', label: 'Other Issue', desc: 'Any other problem with this card' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl glass-panel border border-rose-500/40 p-6 sm:p-8 relative shadow-neon-pink/20 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-white tracking-wide">
              Report Card Prompt
            </h3>
            <p className="text-xs text-zinc-400">
              Help keep Jinx Kiss enjoyable and high-quality for everyone
            </p>
          </div>
        </div>

        {/* Card Preview Quote */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Card Content ({prompt.gameId} • {prompt.category}):
          </span>
          <p className="text-xs sm:text-sm text-zinc-200 font-semibold italic">
            "{prompt.text}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
              Reason for reporting
            </label>
            <div className="space-y-2">
              {reasonOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    reason === opt.id
                      ? 'bg-rose-950/30 border-rose-500/60 text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={opt.id}
                    checked={reason === opt.id}
                    onChange={() => setReason(opt.id)}
                    className="mt-0.5 accent-rose-500"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span className="text-[11px] text-zinc-400 block">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1.5">
              Additional context (optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain why this card should be adjusted or removed..."
              rows={3}
              className="w-full bg-black/60 border border-white/15 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs shadow-neon-pink flex items-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

