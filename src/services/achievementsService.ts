import { Achievement } from '../types/game';

const LOCAL_ACHIEVEMENTS_KEY = 'jinx_unlocked_achievements';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'truth-teller',
    title: 'Truth Teller',
    description: 'Faced 5 unfiltered truth confessions without using a skip pass.',
    icon: 'Sparkles',
    badgeColor: 'border-pink-500/50 text-pink-300 bg-pink-950/40',
  },
  {
    id: 'daredevil',
    title: 'Daredevil',
    description: 'Completed 5 bold dares without backing down.',
    icon: 'Flame',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
  },
  {
    id: 'chaos-magnet',
    title: 'Chaos Magnet',
    description: 'Spun the Chaos Wheel 3 or more times in a single party.',
    icon: 'Disc3',
    badgeColor: 'border-purple-500/50 text-purple-300 bg-purple-950/40',
  },
  {
    id: 'master-manipulator',
    title: 'Master Manipulator',
    description: 'Successfully bluffed and escaped detection as the Imposter.',
    icon: 'UserX',
    badgeColor: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
  },
  {
    id: 'party-animal',
    title: 'Party Animal',
    description: 'Survived 20 continuous rounds of Party Mode.',
    icon: 'PartyPopper',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
  },
  {
    id: 'crowd-favorite',
    title: 'Crowd Favorite',
    description: 'Won the unanimous vote in Most Likely To or Confessions.',
    icon: 'Trophy',
    badgeColor: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40',
  },
  {
    id: 'undercover-agent',
    title: 'Undercover Agent',
    description: 'Successfully carried out a Secret Mission undetected.',
    icon: 'ShieldAlert',
    badgeColor: 'border-teal-500/50 text-teal-300 bg-teal-950/40',
  },
  {
    id: 'iron-stomach',
    title: 'Iron Stomach',
    description: 'Surfaced victorious through an Extreme category gauntlet.',
    icon: 'Zap',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/40',
  },
];

export const achievementsService = {
  getUnlocked(): Achievement[] {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_ACHIEVEMENTS_KEY) || '[]');
      return stored;
    } catch {
      return [];
    }
  },

  unlock(id: string): Achievement | null {
    const list = this.getUnlocked();
    if (list.some(a => a.id === id)) return null; // already unlocked

    const target = ALL_ACHIEVEMENTS.find(a => a.id === id);
    if (!target) return null;

    const unlockedAchievement: Achievement = {
      ...target,
      unlockedAt: Date.now(),
    };

    list.push(unlockedAchievement);
    try {
      localStorage.setItem(LOCAL_ACHIEVEMENTS_KEY, JSON.stringify(list));
    } catch {
      // storage limit
    }

    return unlockedAchievement;
  },

  isUnlocked(id: string): boolean {
    const list = this.getUnlocked();
    return list.some(a => a.id === id);
  },

  getAll(): Achievement[] {
    const unlocked = this.getUnlocked();
    const unlockedMap = new Map(unlocked.map(u => [u.id, u]));

    return ALL_ACHIEVEMENTS.map(a => ({
      ...a,
      unlockedAt: unlockedMap.get(a.id)?.unlockedAt,
    }));
  },
};
