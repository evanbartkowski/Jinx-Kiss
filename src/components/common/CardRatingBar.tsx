import React, { useState, useEffect } from 'react';
import { PromptItem } from '../../types/game';
import { ratingService, CardRatingData } from '../../services/ratingService';
import { favoritesService } from '../../services/favoritesService';
import { soundEffects } from '../../utils/audio';
import { useToast } from '../../context/ToastContext';
import { ReportCardModal } from './ReportCardModal';
import { ThumbsUp, ThumbsDown, Heart, Flag } from 'lucide-react';
import { AdminPromptControls } from '../admin/AdminPromptControls';

interface CardRatingBarProps {
  prompt: PromptItem;
}

export const CardRatingBar: React.FC<CardRatingBarProps> = ({ prompt }) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState<CardRatingData>({ likes: 0, dislikes: 0, userVote: null });
  const [isFav, setIsFav] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

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

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-white/[0.08]">
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
        title="Report this card"
        className="p-2 rounded-full border border-white/10 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <Flag className="w-3.5 h-3.5" />
      </button>

      {/* Comprehensive Report Modal */}
      <AdminPromptControls prompt={prompt} />
      <ReportCardModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        prompt={prompt}
      />
    </div>
  );
};

