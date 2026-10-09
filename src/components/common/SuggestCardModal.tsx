import React, { useState } from 'react';
import { GameCategory, GameId } from '../../types/game';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../../data/gamesConfig';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { submissionService } from '../../services/submissionService';
import { Sparkles, X, Send, Lock } from 'lucide-react';

interface SuggestCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledGameId: GameId;
  prefilledCategory: GameCategory;
}

export const SuggestCardModal: React.FC<SuggestCardModalProps> = ({
  isOpen,
  onClose,
  prefilledGameId,
  prefilledCategory,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [gameId, setGameId] = useState<GameId>(prefilledGameId);
  const [category, setCategory] = useState<GameCategory>(prefilledCategory);
  const [promptText, setPromptText] = useState('');
  const [todType, setTodType] = useState<'truth' | 'dare'>('truth');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      openAuthModal('login');
      return;
    }

    if (!promptText.trim()) {
      showToast('Please enter your card prompt.', 'error');
      return;
    }

    if (gameId === 'would-you-rather' && (!optionA.trim() || !optionB.trim())) {
      showToast('Please provide both Option A and Option B.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submissionService.submitPrompt(
        gameId,
        category,
        promptText,
        currentUser.uid,
        currentUser.username,
        {
          type: gameId === 'truth-or-dare' ? todType : undefined,
          optionA: gameId === 'would-you-rather' ? optionA : undefined,
          optionB: gameId === 'would-you-rather' ? optionB : undefined,
        }
      );

      showToast('Your card has been submitted! Our team will review it.', 'success');
      setPromptText('');
      setOptionA('');
      setOptionB('');
      onClose();
    } catch (e: any) {
      showToast(e.message || 'Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-brand-pink/30 shadow-2xl shadow-brand-pink/10 animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-pink/20 text-brand-pink shadow-neon-pink">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Suggest a Card</h3>
              <p className="text-xs text-zinc-400">Share your wild, hilarious prompt with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 mb-4">
              <Lock className="w-6 h-6 text-brand-pink" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Account Required to Submit</h4>
            <p className="text-xs text-zinc-400 max-w-xs mb-6">
              Create a free username account or sign in to suggest new cards for our official decks and get credited!
            </p>
            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-pink to-brand-violet rounded-xl text-sm font-semibold text-white shadow-neon-pink hover:opacity-95 active:scale-95 transition-all"
            >
              Sign In to Suggest
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            
            {/* Game selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Game
              </label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value as GameId)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-pink"
              >
                {Object.values(GAMES_CONFIG).map((g) => (
                  <option key={g.id} value={g.id} className="bg-zinc-900 text-white">
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GameCategory)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-pink"
              >
                {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => (
                  <option key={catKey} value={catKey} className="bg-zinc-900 text-white">
                    {info.label} ({info.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Truth or Dare special type */}
            {gameId === 'truth-or-dare' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTodType('truth')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      todType === 'truth'
                        ? 'border-brand-pink bg-brand-pink/20 text-white shadow-neon-pink'
                        : 'border-white/10 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    Truth
                  </button>
                  <button
                    type="button"
                    onClick={() => setTodType('dare')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      todType === 'dare'
                        ? 'border-brand-violet bg-brand-violet/20 text-white shadow-neon-violet'
                        : 'border-white/10 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    Dare
                  </button>
                </div>
              </div>
            )}

            {/* Would you rather options */}
            {gameId === 'would-you-rather' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Option A
                  </label>
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => {
                      setOptionA(e.target.value);
                      setPromptText('Would You Rather...');
                    }}
                    placeholder="e.g. Always have free coffee for life..."
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Option B
                  </label>
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="e.g. Never have to wait in line anywhere..."
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Card Prompt
                </label>
                <textarea
                  rows={4}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Type your original card prompt here..."
                  className="w-full bg-zinc-900/80 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink leading-relaxed resize-none"
                  required
                />
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 rounded-xl font-semibold text-sm text-white shadow-neon-pink flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Card for Review'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
