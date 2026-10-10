import { SpecialCard, SpecialCardType, SpecialCardFrequency } from '../types/specialCard';

export const SPECIAL_CARDS: SpecialCard[] = [
  {
    id: 'sc-double-trouble',
    type: 'double-trouble',
    title: 'Double Trouble',
    rarity: 'uncommon',
    description: 'Misery loves company. Two players must complete or answer the exact same challenge.',
    effect: 'The current player picks a partner to complete this round with them simultaneously.',
    iconName: 'Users',
    themeColor: '#10B981', // Emerald
    pointsAwarded: 15,
    glowClass: 'shadow-neon-green/30 border-emerald-500/50',
    badgeText: 'UNCOMMON MODIFIER',
  },
  {
    id: 'sc-reverse-card',
    type: 'reverse-card',
    title: 'Reverse Card',
    rarity: 'uncommon',
    description: 'No you! Deflect the heat and redirect the challenge to someone else.',
    effect: 'You may pass this prompt to the player who went before you, or any player of your choice.',
    iconName: 'RotateCcw',
    themeColor: '#06B6D4', // Cyan
    pointsAwarded: 10,
    glowClass: 'shadow-neon-cyan/30 border-cyan-500/50',
    badgeText: 'UNCOMMON MODIFIER',
  },
  {
    id: 'sc-second-chance',
    type: 'second-chance',
    title: 'Second Chance',
    rarity: 'uncommon',
    description: 'Get out of jail free card. Draw a completely fresh prompt with zero penalty or forfeit.',
    effect: 'Immediately reshuffles the current prompt without drinking or losing points.',
    iconName: 'Sparkles',
    themeColor: '#10B981', // Emerald
    pointsAwarded: 10,
    glowClass: 'shadow-neon-green/30 border-emerald-500/50',
    badgeText: 'UNCOMMON MODIFIER',
  },
  {
    id: 'sc-everyone-answers',
    type: 'everyone-answers',
    title: 'Everyone Answers',
    rarity: 'rare',
    description: 'Nobody escapes. Every single person in the room must take their turn answering.',
    effect: 'All players must provide an answer to this prompt, going in clockwise order.',
    iconName: 'Users',
    themeColor: '#3B82F6', // Blue
    pointsAwarded: 20,
    glowClass: 'shadow-neon-cyan/40 border-blue-500/50',
    badgeText: 'RARE MODIFIER',
  },
  {
    id: 'sc-choose-victim',
    type: 'choose-victim',
    title: 'Choose Your Victim',
    rarity: 'rare',
    description: 'Unleash chaos. Select another player in the room to face this challenge instead of you.',
    effect: 'Point at any player. They must accept this challenge or take a double forfeit penalty!',
    iconName: 'Crosshair',
    themeColor: '#8B5CF6', // Purple
    pointsAwarded: 20,
    glowClass: 'shadow-neon-violet/40 border-purple-500/50',
    badgeText: 'RARE MODIFIER',
  },
  {
    id: 'sc-spotlight',
    type: 'spotlight',
    title: 'Spotlight',
    rarity: 'rare',
    description: 'The room turns on one chosen player. High stakes, maximum attention.',
    effect: 'One random player is chosen to take the hot seat and answer under intense group cross-examination.',
    iconName: 'Zap',
    themeColor: '#06B6D4', // Cyan
    pointsAwarded: 25,
    glowClass: 'shadow-neon-cyan/40 border-cyan-400/50',
    badgeText: 'RARE MODIFIER',
  },
  {
    id: 'sc-truth-bomb',
    type: 'truth-bomb',
    title: 'Truth Bomb',
    rarity: 'epic',
    description: 'Detonate a shocking secret. Everyone in the room must answer an explosive group revelation.',
    effect: 'All players must answer honestly. Whoever gives the boldest confession earns 30 bonus points!',
    iconName: 'Flame',
    themeColor: '#D946EF', // Fuchsia
    pointsAwarded: 35,
    glowClass: 'shadow-neon-pink/50 border-fuchsia-500/60',
    badgeText: 'EPIC EVENT',
  },
  {
    id: 'sc-mystery-card',
    type: 'mystery-card',
    title: 'Mystery Card',
    rarity: 'epic',
    description: 'A sealed cosmic envelope. Reveals a surprise hidden rule or group modifier for the next 3 rounds.',
    effect: 'Draws a secret event card that temporarily alters group rules or drinking penalties!',
    iconName: 'HelpCircle',
    themeColor: '#A855F7', // Violet
    pointsAwarded: 30,
    glowClass: 'shadow-neon-violet/50 border-purple-500/60',
    badgeText: 'EPIC EVENT',
  },
  {
    id: 'sc-chaos-round',
    type: 'chaos-round',
    title: 'Chaos Round',
    rarity: 'epic',
    description: 'Reality shifts. Immediately alters the party game format and inverts scoring for this round!',
    effect: 'The current game instantly shifts to a wild surprise round from another game mode with double stakes.',
    iconName: 'Shuffle',
    themeColor: '#EC4899', // Pink
    pointsAwarded: 35,
    glowClass: 'shadow-neon-pink/50 border-pink-500/60',
    badgeText: 'EPIC EVENT',
  },
  {
    id: 'sc-wildcard',
    type: 'wildcard',
    title: 'Legendary Wildcard',
    rarity: 'legendary',
    description: 'The ultimate party wild card! A chaotic divine intervention that grants game-changing power.',
    effect: 'Rolls a random legendary perk: Triple points, Immunity Pass for 3 rounds, or swap points with first place!',
    iconName: 'Crown',
    themeColor: '#F59E0B', // Radiant Gold
    pointsAwarded: 50,
    glowClass: 'shadow-[0_0_40px_rgba(245,158,11,0.6)] border-amber-400/80 animate-pulse',
    badgeText: '★ LEGENDARY CARD ★',
  },
];

/**
 * Frequency helper: returns chance of drawing a special card based on setting
 */
export function getSpecialCardChance(frequency: SpecialCardFrequency): number {
  switch (frequency) {
    case 'off': return 0;
    case 'low': return 0.08;
    case 'normal': return 0.15;
    case 'high': return 0.25;
    default: return 0.15;
  }
}

/**
 * Randomly draw a special card with weighted rarity:
 * Uncommon: 50%
 * Rare: 30%
 * Epic: 15%
 * Legendary: 5%
 */
export function drawRandomSpecialCard(): SpecialCard {
  const rand = Math.random();
  let rarity: 'uncommon' | 'rare' | 'epic' | 'legendary';

  if (rand < 0.05) {
    rarity = 'legendary';
  } else if (rand < 0.20) {
    rarity = 'epic';
  } else if (rand < 0.50) {
    rarity = 'rare';
  } else {
    rarity = 'uncommon';
  }

  const matching = SPECIAL_CARDS.filter(c => c.rarity === rarity);
  if (matching.length === 0) return SPECIAL_CARDS[0];

  return matching[Math.floor(Math.random() * matching.length)];
}

