import React, { useState, useEffect } from 'react';
import { GameCategory, GameId, PromptItem } from '../../types/game';
import { GAMES_CONFIG, CATEGORY_LABELS } from '../../data/gamesConfig';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, Edit2, Trash2, Power, Filter } from 'lucide-react';

export const GameContentManager: React.FC = () => {
  const { showToast } = useToast();
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameId | 'all'>('all');
  const [selectedCat, setSelectedCat] = useState<GameCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PromptItem | null>(null);
  const [formGameId, setFormGameId] = useState<GameId>('truth-or-dare');
  const [formCategory, setFormCategory] = useState<GameCategory>('medium');
  const [formText, setFormText] = useState('');
  const [formType, setFormType] = useState<'truth' | 'dare'>('truth');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');

  const loadPrompts = async () => {
    const list = await adminService.getAllPromptsForManager();
    setPrompts(list);
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormGameId(selectedGame === 'all' ? 'truth-or-dare' : selectedGame);
    setFormCategory(selectedCat === 'all' ? 'medium' : selectedCat);
    setFormText('');
    setFormOptionA('');
    setFormOptionB('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: PromptItem) => {
    setEditingItem(item);
    setFormGameId(item.gameId);
    setFormCategory(item.category);
    setFormText(item.text);
    setFormType(item.type || 'truth');
    setFormOptionA(item.optionA || '');
    setFormOptionB(item.optionB || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    try {
      if (editingItem) {
        await adminService.updateOfficialPrompt(editingItem.id, {
          gameId: formGameId,
          category: formCategory,
          text: formText.trim(),
          type: formGameId === 'truth-or-dare' ? formType : undefined,
          optionA: formGameId === 'would-you-rather' ? formOptionA.trim() : undefined,
          optionB: formGameId === 'would-you-rather' ? formOptionB.trim() : undefined,
        });
        showToast('Prompt updated successfully!', 'success');
      } else {
        await adminService.addOfficialPrompt({
          id: 'admin_p_' + Math.random().toString(36).substring(2, 9),
          gameId: formGameId,
          category: formCategory,
          text: formText.trim(),
          type: formGameId === 'truth-or-dare' ? formType : undefined,
          optionA: formGameId === 'would-you-rather' ? formOptionA.trim() : undefined,
          optionB: formGameId === 'would-you-rather' ? formOptionB.trim() : undefined,
          isActive: true,
        });
        showToast('New prompt added to game library!', 'success');
      }
      setIsModalOpen(false);
      loadPrompts();
    } catch (e: any) {
      showToast(e.message || 'Operation failed', 'error');
    }
  };

  const handleToggleActive = async (item: PromptItem) => {
    const newStatus = item.isActive === false ? true : false;
    await adminService.updateOfficialPrompt(item.id, { isActive: newStatus });
    showToast(`Prompt ${newStatus ? 'enabled' : 'disabled'}.`, 'info');
    loadPrompts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disable/delete this prompt?')) return;
    await adminService.deleteOfficialPrompt(id);
    showToast('Prompt disabled.', 'info');
    loadPrompts();
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesGame = selectedGame === 'all' || p.gameId === selectedGame;
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesQuery = p.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.optionA && p.optionA.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.optionB && p.optionB.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGame && matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">Game Content Manager</h3>
          <p className="text-xs text-zinc-400">Add, edit, disable, or modify official cards across all 8 games</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 rounded-xl text-xs font-bold text-white shadow-neon-pink flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink"
          />
        </div>

        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value as any)}
          className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none"
        >
          <option value="all">All Games</option>
          {Object.values(GAMES_CONFIG).map(g => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </select>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value as any)}
          className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Prompt Cards Grid */}
      <div className="text-xs text-zinc-400 font-semibold mb-2">
        Showing {filteredPrompts.length} Prompts
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredPrompts.map((item) => {
          const game = GAMES_CONFIG[item.gameId] || { title: item.gameId, themeColor: '#FF4DA6' };
          const cat = CATEGORY_LABELS[item.category] || { label: item.category };
          const isActive = item.isActive !== false;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl glass-panel border flex items-center justify-between gap-4 transition-all ${
                isActive ? 'border-white/[0.08]' : 'border-zinc-800 opacity-60 bg-black/40'
              }`}
            >
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                    style={{
                      color: game.themeColor,
                      backgroundColor: `${game.themeColor}15`,
                      borderColor: `${game.themeColor}40`,
                    }}
                  >
                    {game.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-white/10">
                    {cat.label}
                  </span>
                  {!isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-950 text-red-400 border border-red-500/30">
                      Disabled
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed truncate">
                  {item.optionA ? `A: ${item.optionA} | B: ${item.optionB}` : item.text}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`p-2 rounded-xl border text-xs transition-all ${
                    isActive
                      ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                  }`}
                  title={isActive ? 'Disable card' : 'Enable card'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all"
                  title="Edit prompt"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 transition-all"
                  title="Delete/disable"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-brand-pink/30 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-4">
              {editingItem ? 'Edit Official Card' : 'Add New Official Card'}
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Game</label>
                  <select
                    value={formGameId}
                    onChange={(e) => setFormGameId(e.target.value as GameId)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {Object.values(GAMES_CONFIG).map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as GameCategory)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formGameId === 'would-you-rather' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formOptionA}
                    onChange={(e) => setFormOptionA(e.target.value)}
                    placeholder="Option A..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    value={formOptionB}
                    onChange={(e) => setFormOptionB(e.target.value)}
                    placeholder="Option B..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Card Text</label>
                  <textarea
                    rows={3}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs text-white resize-none"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet text-white font-bold text-xs shadow-neon-pink"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

