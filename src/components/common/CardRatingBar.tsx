import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { ratingService, CardRatingData } from '../../services/ratingService';
import { favoritesService } from '../../services/favoritesService';
import { soundEffects } from '../../utils/audio';
import { useToast } from '../../context/ToastContext';
import { ThumbsUp, ThumbsDown, Heart, Flag, Check, X } from 'lucide-react';

interface CardRatingBarProps {
  prompt: PromptItem;
}

export const CardRatingBar: React.FC<CardRatingBarProps> = ({ prompt }) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState<CardRatingData>({ likes: 0, dislikes: 0, userVote: null });
  const [isFav, setIsFav] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    ratingService.getRating(prompt.id).then(setRating);
    setIsFav(favoritesService.isFavorite(prompt.id));
  }, [prompt.id]);

  const handleVote = async (type: 'like' | 'dislike') => {
    soundEffects.playClick();
    const updated = await ratingService.vote(prompt.id, type);
    setRating(updated);
  };

  const handleToggleFav = () => {
    soundEffects.playClick();
    const nextState = favoritesService.toggleFavorite(prompt);
    setIsFav(nextState);
    showToast(nextState ? 'Added to favorites!' : 'Removed from favorites', 'info');
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setIsSubmittingReport(true);
    await ratingService.reportCard(prompt.id, prompt.text, prompt.gameId, reportReason.trim());
    setIsSubmittingReport(false);
    setShowReportModal(false);
    setReportReason('');
    showToast('Report submitted for moderation. Thank you!', 'success');
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-3 border-t border-white/[0.08]">
      {/* Favorite Button */}
      <button
        type="button"
        onClick={handleToggleFav}
        aria-label="Favorite prompt"
        className={`p-2 rounded-full border transition-all duration-200 active:scale-95 ${
          isFav
            ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-neon-pink/30'
            : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
        }`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
      </button>

      {/* Upvote */}
      <button
        type="button"
        onClick={() => handleVote('like')}
        aria-label="Like prompt"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95 ${
          rating.userVote === 'like'
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        <span>{rating.likes > 0 ? rating.likes : ''}</span>
      </button>

      {/* Downvote */}
      <button
        type="button"
        onClick={() => handleVote('dislike')}
        aria-label="Dislike prompt"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95 ${
          rating.userVote === 'dislike'
            ? 'bg-red-500/20 border-red-500/50 text-red-400'
            : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        <span>{rating.dislikes > 0 ? rating.dislikes : ''}</span>
      </button>

      {/* Report Button */}
      <button
        type="button"
        onClick={() => setShowReportModal(true)}
        aria-label="Report card"
        className="p-2 rounded-full border border-white/10 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-200 active:scale-95"
      >
        <Flag className="w-3.5 h-3.5" />
      </button>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl glass-panel border border-rose-500/30 p-6 relative">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-black uppercase text-white mb-2 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-400" />
              Report Card
            </h4>
            <p className="text-xs text-zinc-400 mb-4 line-clamp-2 italic">
              "{prompt.text}"
            </p>

            <form onSubmit={handleReportSubmit}>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Reason for report:
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Inappropriate content, typo, offensive, etc."
                required
                rows={3}
                className="w-full rounded-2xl bg-black/50 border border-white/10 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400/50 mb-4 resize-none"
              />

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-neon-red/30 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
