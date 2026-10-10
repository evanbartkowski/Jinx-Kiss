import React, { useState } from 'react';
import { CustomDeck, DeckVisibility } from '../../types/deck';
import { GameId, GameCategory, PromptItem } from '../../types/game';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../../data/gamesConfig';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, Save, Globe, Lock, Link2, Sparkles } from 'lucide-react';

interface DeckEditorProps {
  initialDeck?: CustomDeck | null;
  onSave: (deckData: any) => Promise<void>;
  onCancel: () => void;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({
  initialDeck,
  onSave,
  onCancel,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialDeck?.title || '');
  const [description, setDescription] = useState(initialDeck?.description || '');
  const [gameId, setGameId] = useState<GameId>(initialDeck?.gameId || 'truth-or-dare');
  const [gameMode, setGameMode] = useState<GameCategory>(initialDeck?.gameMode || 'medium');
  const [themeColor, setThemeColor] = useState(initialDeck?.themeColor || '#FF4DA6');
  const [visibility, setVisibility] = useState<DeckVisibility>(initialDeck?.visibility || 'private');
  const [cards, setCards] = useState<PromptItem[]>(initialDeck?.cards || []);

  // New card form state
  const [newCardText, setNewCardText] = useState('');
  const [newCardType, setNewCardType] = useState<'truth' | 'dare'>('truth');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Live preview card index
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (gameId === 'would-you-rather') {
      if (!newOptionA.trim() || !newOptionB.trim()) {
        showToast('Please enter both Option A and Option B', 'error');
        return;
      }
    } else {
      if (!newCardText.trim()) {
        showToast('Please enter card text', 'error');
        return;
      }
    }

    const newCard: PromptItem = {
      id: 'card_' + Math.random().toString(36).substring(2, 9),
      gameId,
      category: gameMode,
      text: gameId === 'would-you-rather' ? 'Would You Rather...' : newCardText.trim(),
      type: gameId === 'truth-or-dare' ? newCardType : undefined,
      optionA: gameId === 'would-you-rather' ? newOptionA.trim() : undefined,
      optionB: gameId === 'would-you-rather' ? newOptionB.trim() : undefined,
    };

    setCards(prev => [...prev, newCard]);
    setNewCardText('');
    setNewOptionA('');
    setNewOptionB('');
    showToast('Card added to deck!', 'success');
  };

  const handleRemoveCard = (index: number) => {
    setCards(prev => prev.filter((_, i) => i !== index));
    if (previewIndex >= cards.length - 1) {
      setPreviewIndex(Math.max(0, cards.length - 2));
    }
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cards.length) return;
    const reordered = [...cards];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setCards(reordered);
    setPreviewIndex(targetIdx);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showToast('Deck title is required', 'error');
      return;
    }
    if (cards.length === 0) {
      showToast('Please add at least 1 card to your deck', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        gameId,
        gameMode,
        themeColor,
        visibility,
        cards,
        creatorUid: currentUser?.uid || 'guest',
        creatorUsername: currentUser?.username || 'Guest',
      });
      showToast('Deck saved successfully!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to save deck', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const previewCard = cards[previewIndex];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div>
          <h2 className="text-2xl font-black text-white">
            {initialDeck ? 'Edit Custom Deck' : 'Create Custom Deck'}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Craft your own customized card deck with custom rules and cards.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onCancel}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-neon-pink flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Deck'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Deck Settings & Add Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Deck Metadata Card */}
          <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400">
              Deck Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Deck Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Late Night Wild Dares"
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-pink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Game Type
                </label>
                <select
                  value={gameId}
                  onChange={(e) => {
                    const newId = e.target.value as GameId;
                    setGameId(newId);
                    setThemeColor(GAMES_CONFIG[newId].themeColor);
                  }}
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-pink"
                >
                  {Object.values(GAMES_CONFIG).map((g) => (
                    <option key={g.id} value={g.id} className="bg-zinc-900 text-white">
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Game Mode / Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Game Mode / Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(['easy', 'medium', 'extreme', 'couples', '18+', 'spicy', 'kids'] as GameCategory[]).map((mode) => {
                  const isSelected = gameMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setGameMode(mode)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-brand-pink to-brand-violet text-white shadow-neon-pink scale-105'
                          : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {CATEGORY_LABELS[mode]?.label || mode}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description for other players"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-pink"
              />
            </div>

            {/* Visibility Options */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Deck Visibility
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    visibility === 'private'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300 shadow-neon-amber/20'
                      : 'border-white/10 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-bold">Private</span>
                  <span className="text-[10px] text-zinc-500 text-center">Only you</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('unlisted')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    visibility === 'unlisted'
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-neon-cyan/20'
                      : 'border-white/10 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Unlisted</span>
                  <span className="text-[10px] text-zinc-500 text-center">Anyone with link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    visibility === 'public'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-neon-green/20'
                      : 'border-white/10 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold">Public</span>
                  <span className="text-[10px] text-zinc-500 text-center">Community Discovery</span>
                </button>
              </div>

              {visibility === 'public' && (
                <p className="text-[11px] text-emerald-400 mt-2">
                  ✨ Public decks appear immediately in the Community Decks section for everyone to explore and play!
                </p>
              )}
            </div>
          </div>

          {/* Add Card Box */}
          <div className="p-6 rounded-3xl glass-panel border border-brand-pink/30 shadow-neon-pink/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Card</span>
            </h3>

            <form onSubmit={handleAddCard} className="space-y-4">
              
              {/* Specialized fields depending on game */}
              {gameId === 'truth-or-dare' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCardType('truth')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      newCardType === 'truth'
                        ? 'border-brand-pink bg-brand-pink/20 text-white shadow-neon-pink'
                        : 'border-white/10 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    Truth
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCardType('dare')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      newCardType === 'dare'
                        ? 'border-brand-violet bg-brand-violet/20 text-white shadow-neon-violet'
                        : 'border-white/10 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    Dare
                  </button>
                </div>
              )}

              {gameId === 'would-you-rather' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newOptionA}
                    onChange={(e) => setNewOptionA(e.target.value)}
                    placeholder="Option A: e.g. Never have to sleep again..."
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    value={newOptionB}
                    onChange={(e) => setNewOptionB(e.target.value)}
                    placeholder="Option B: e.g. Never feel physical exhaustion..."
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  placeholder="Enter prompt text for this card..."
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-brand-pink resize-none"
                />
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-brand-pink to-brand-violet rounded-xl font-bold text-xs text-white shadow-neon-pink hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Card to Deck ({cards.length} Total)</span>
              </button>
            </form>
          </div>

          {/* Cards List with Reordering */}
          <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span>Deck Cards ({cards.length})</span>
              <span className="text-xs text-zinc-500 normal-case">Drag or use arrows to reorder</span>
            </h3>

            {cards.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs">
                No cards added yet. Add your first card above!
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {cards.map((card, idx) => (
                  <div
                    key={card.id || idx}
                    onClick={() => setPreviewIndex(idx)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      previewIndex === idx
                        ? 'border-brand-pink/50 bg-brand-pink/10 shadow-neon-pink/10'
                        : 'border-white/[0.06] bg-zinc-900/50 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-black/60 border border-white/10 text-[10px] font-bold text-zinc-400 flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        {card.type && (
                          <span className="text-[10px] font-bold uppercase text-brand-pink mr-1.5">
                            [{card.type}]
                          </span>
                        )}
                        <span className="text-xs text-zinc-200">
                          {card.optionA ? `${card.optionA} OR ${card.optionB}` : card.text}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveCard(idx, 'up'); }}
                        disabled={idx === 0}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveCard(idx, 'down'); }}
                        disabled={idx === cards.length - 1}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveCard(idx); }}
                        className="p-1 text-zinc-400 hover:text-red-400"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live Card Preview */}
        <div className="space-y-4">
          <div className="sticky top-28">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-3">
              <Eye className="w-4 h-4 text-brand-pink" />
              <span>Live Gameplay Card Preview</span>
            </h3>

            {previewCard ? (
              <div
                className="w-full min-h-[320px] p-8 rounded-3xl glass-panel border flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl transition-all"
                style={{
                  borderColor: `${themeColor}60`,
                  boxShadow: `0 0 35px -5px ${themeColor}33`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    style={{
                      color: themeColor,
                      backgroundColor: `${themeColor}20`,
                      borderColor: `${themeColor}50`,
                    }}
                  >
                    {previewCard.type || GAMES_CONFIG[gameId].title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    Card #{previewIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="my-6">
                  {gameId === 'would-you-rather' ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-white font-bold">
                        A: {previewCard.optionA}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">vs</span>
                      <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-500/30 text-xs text-white font-bold">
                        B: {previewCard.optionB}
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg font-black text-white leading-relaxed">
                      "{previewCard.text}"
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-zinc-400 font-medium">
                  {title || 'Untitled Custom Deck'}
                </div>
              </div>
            ) : (
              <div className="w-full min-h-[320px] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center text-zinc-500 text-xs">
                <Sparkles className="w-8 h-8 text-zinc-600 mb-2" />
                Add cards to see live preview
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

