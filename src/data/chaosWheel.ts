import { ChaosWheelSegment } from '../types/game';

export const CHAOS_WHEEL_SEGMENTS: ChaosWheelSegment[] = [
  {
    id: 'random-truth',
    label: 'Random Truth',
    description: 'Active player must answer an unavoidable, high-stakes truth from the crowd.',
    color: '#FF4DA6', // Neon Pink
    iconName: 'HelpCircle',
  },
  {
    id: 'random-dare',
    label: 'Random Dare',
    description: 'Fate has spoken: complete a wild physical dare or take the round penalty!',
    color: '#EF4444', // Red
    iconName: 'Flame',
  },
  {
    id: 'mystery-card',
    label: 'Mystery Card',
    description: 'A shadowy card appears from the vault with unexpected consequences.',
    color: '#A855F7', // Electric Violet
    iconName: 'Sparkles',
  },
  {
    id: 'double-points',
    label: 'Double Points',
    description: 'The stakes are doubled! The next challenge grants 2x points for completion.',
    color: '#F59E0B', // Golden Amber
    iconName: 'Zap',
  },
  {
    id: 'player-swap',
    label: 'Player Swap',
    description: 'Swap current turn with another player of your choice. They must perform your task!',
    color: '#06B6D4', // Cyan
    iconName: 'RefreshCw',
  },
  {
    id: 'everyone-votes',
    label: 'Everyone Votes',
    description: 'All players must submit a vote on the active dilemma or confession immediately.',
    color: '#10B981', // Green
    iconName: 'Users',
  },
  {
    id: 'group-challenge',
    label: 'Group Challenge',
    description: 'Nobody escapes! The entire room must partake in a synchronized dare.',
    color: '#EC4899', // Hot Pink
    iconName: 'Users2',
  },
  {
    id: 'choose-player',
    label: 'Pick A Target',
    description: 'Select any friend in the room to take a penalty shot or reveal a secret.',
    color: '#8B5CF6', // Purple
    iconName: 'Crosshair',
  },
  {
    id: 'bonus-round',
    label: 'Bonus Round',
    description: 'Trigger a rapid-fire bonus mini-game with instant point rewards!',
    color: '#F97316', // Orange
    iconName: 'Award',
  },
  {
    id: 'reverse-turn',
    label: 'Reverse Turn',
    description: 'Turn order reverses instantly! The previous player is thrust back into the spotlight.',
    color: '#3B82F6', // Blue
    iconName: 'RotateCcw',
  },
  {
    id: 'wildcard',
    label: 'Wildcard',
    description: 'Active player invents any rule or dare for the room that lasts for 3 full rounds.',
    color: '#E11D48', // Crimson
    iconName: 'Sparkle',
  },
  {
    id: 'secret-mission',
    label: 'Secret Mission',
    description: 'Active player receives a private undercover objective to fulfill without being spotted.',
    color: '#14B8A6', // Teal
    iconName: 'ShieldAlert',
  },
];
