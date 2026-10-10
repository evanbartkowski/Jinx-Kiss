export type SpecialCardType =
  | 'double-trouble'
  | 'reverse-card'
  | 'everyone-answers'
  | 'wildcard'
  | 'choose-victim'
  | 'truth-bomb'
  | 'mystery-card'
  | 'second-chance'
  | 'spotlight'
  | 'chaos-round';

export type SpecialCardRarity = 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface SpecialCard {
  id: string;
  type: SpecialCardType;
  title: string;
  rarity: SpecialCardRarity;
  description: string;
  effect: string;
  iconName: string;
  themeColor: string;
  pointsAwarded: number;
  glowClass: string;
  badgeText: string;
}

export type SpecialCardFrequency = 'off' | 'low' | 'normal' | 'high';

