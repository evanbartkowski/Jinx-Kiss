import React, { useState } from 'react';
import { GameCategory } from '../../types/game';
import { CATEGORY_LABELS } from '../../data/gamesConfig';
import { useGameSettings } from '../../context/GameSettingsContext';
import { AgeConfirmationModal } from './AgeConfirmationModal';

interface CategorySelectorProps {
  applicableCategories?: GameCategory[];
  currentCategory: GameCategory;
  onSelectCategory: (category: GameCategory) => void;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  applicableCategories = ['easy', 'medium', 'extreme', 'couples', '18+', 'spicy', 'kids'],
  currentCategory,
  onSelectCategory,
  className = '',
}) => {
  const { isAgeConfirmed, confirmAge } = useGameSettings();
  const [pendingCategory, setPendingCategory] = useState<GameCategory | null>(null);

  const handleCategoryClick = (cat: GameCategory) => {
    if (cat === '18+' && !isAgeConfirmed) {
      setPendingCategory('18+');
      return;
    }
    onSelectCategory(cat);
  };

  const handleAgeConfirm = () => {
    confirmAge();
    if (pendingCategory) {
      onSelectCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 overflow-x-auto py-2 no-scrollbar ${className}`}>
        {applicableCategories.map((cat) => {
          const isSelected = currentCategory === cat;
          const meta = CATEGORY_LABELS[cat] || { label: cat, badgeColor: '' };

          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-brand-pink/30 to-brand-violet/30 border-brand-pink text-white shadow-neon-pink scale-105'
                  : 'bg-zinc-900/60 border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/20 hover:bg-zinc-800/60'
              }`}
            >
              {meta.label}
              {cat === '18+' && (
                <span className="ml-1 text-[10px] text-pink-400 font-bold">🔞</span>
              )}
            </button>
          );
        })}
      </div>

      <AgeConfirmationModal
        isOpen={!!pendingCategory}
        onConfirm={handleAgeConfirm}
        onCancel={() => setPendingCategory(null)}
      />
    </>
  );
};
