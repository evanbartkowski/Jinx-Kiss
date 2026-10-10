import React, { useState } from 'react';
import { CustomDeck } from '../../types/deck';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../../data/gamesConfig';
import { Play, Layers, Lock, Globe, Link2, Copy, Trash2, Edit, QrCode, X, Check, Users } from 'lucide-react';
import { generateQRCodeSVG } from '../../utils/qrCode';
import { useToast } from '../../context/ToastContext';
import { soundEffects } from '../../utils/audio';

interface DeckCardProps {
  deck: CustomDeck;
  onPlay: (deck: CustomDeck) => void;
  onEdit?: (deck: CustomDeck) => void;
  onDuplicate?: (deck: CustomDeck) => void;
  onDelete?: (deck: CustomDeck) => void;
  isOwner?: boolean;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onPlay,
  onEdit,
  onDuplicate,
  onDelete,
  isOwner = false,
}) => {
  const { showToast } = useToast();
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const gameMeta = GAMES_CONFIG[deck.gameId] || GAMES_CONFIG['truth-or-dare'];
  const themeColor = deck.themeColor || gameMeta.themeColor;
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#/deck/${deck.shareToken || deck.id}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      showToast('Deck link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="group relative rounded-3xl glass-panel border border-white/[0.08] hover:border-white/25 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex-1 min-w-[280px]"
      style={{
        boxShadow: `0 10px 30px -10px ${themeColor}22`,
      }}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
              style={{
                color: themeColor,
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}40`,
              }}
            >
              {gameMeta.title}
            </span>

            {/* Play Mode Badge: Online vs In-Person */}
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              (deck.playMode || 'in-person') === 'online'
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-pink-950/40 text-pink-300 border-brand-pink/40 shadow-[0_0_10px_rgba(255,77,166,0.15)]'
            }`}>
              {(deck.playMode || 'in-person') === 'online' ? (
                <>
                  <Globe className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Online Deck</span>
                </>
              ) : (
                <>
                  <Users className="w-2.5 h-2.5 text-brand-pink" />
                  <span>In-Person Deck</span>
                </>
              )}
            </span>

            {/* Game Mode / Category Badge */}
            {deck.gameMode && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                {CATEGORY_LABELS[deck.gameMode]?.label || deck.gameMode}
              </span>
            )}

            {/* Visibility Badge */}
            {isOwner && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-black/40 border border-white/10 px-2 py-0.5 rounded-full">
                {deck.visibility === 'public' ? (
                  <>
                    <Globe className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Public</span>
                  </>
                ) : deck.visibility === 'unlisted' ? (
                  <>
                    <Link2 className="w-2.5 h-2.5 text-cyan-400" />
                    <span>Unlisted</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    <span>Private</span>
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>{deck.cards.length} Cards</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-black text-white group-hover:text-white transition-colors line-clamp-1">
          {deck.title}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
          {deck.description || 'Custom card deck created for unforgettable party game nights.'}
        </p>

        {/* Creator Info */}
        <div className="mt-4 text-[11px] text-zinc-500 flex items-center gap-1.5">
          <span>By</span>
          <span className="text-zinc-300 font-semibold">@{deck.creatorUsername}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <button
          onClick={() => {
            soundEffects.playGameSelect(deck.gameId);
            onPlay(deck);
          }}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${themeColor}, #A855F7)`,
          }}
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Play Deck</span>
        </button>

        {/* QR Share Button */}
        <button
          onClick={() => setShowQRModal(true)}
          className="p-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 hover:border-white/20 transition-all"
          title="Share Deck QR Code"
        >
          <QrCode className="w-3.5 h-3.5" />
        </button>

        {isOwner && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(deck)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 hover:border-white/20 transition-all"
                title="Edit Deck"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(deck)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 hover:border-white/20 transition-all"
                title="Duplicate Deck"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(deck)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-red-400 bg-zinc-900 border border-white/10 hover:border-red-500/30 transition-all"
                title="Delete Deck"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* QR Share Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xs rounded-3xl glass-panel border border-brand-pink/50 p-6 text-center relative shadow-neon-pink/30">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-black uppercase text-white mb-1">
              Share Deck
            </h4>
            <p className="text-xs text-zinc-400 mb-4 line-clamp-1">
              {deck.title}
            </p>

            {/* QR View */}
            <div
              className="w-44 h-44 mx-auto rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg mb-4"
              dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(shareUrl, 160) }}
            />

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-xl bg-brand-pink/20 border border-brand-pink/50 text-pink-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-pink/30 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
