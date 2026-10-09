import React from 'react';
import { AdminStats } from '../../services/adminService';
import { Users, Layers, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface AdminOverviewProps {
  stats: AdminStats;
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ stats, onNavigateTab }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: '#3B82F6',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/10',
      tab: 'users',
    },
    {
      title: 'Custom Decks',
      value: stats.totalDecks,
      icon: Layers,
      color: '#06B6D4',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/10',
      tab: 'decks',
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: Send,
      color: '#A855F7',
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/10',
      tab: 'prompts',
    },
    {
      title: 'Pending Submissions',
      value: stats.pendingSubmissions,
      icon: Clock,
      color: '#F59E0B',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/10',
      tab: 'moderation',
      badge: 'Action Needed',
    },
    {
      title: 'Approved Prompts',
      value: stats.approvedSubmissions,
      icon: CheckCircle2,
      color: '#10B981',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/10',
      tab: 'prompts',
    },
    {
      title: 'Rejected Submissions',
      value: stats.rejectedSubmissions,
      icon: XCircle,
      color: '#EF4444',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/10',
      tab: 'moderation',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(c.tab)}
              className={`p-6 rounded-3xl glass-panel border ${c.border} hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {c.title}
                </span>
                <div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: `${c.color}20`, color: c.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {c.value}
                </span>
                {c.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
                    {c.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

