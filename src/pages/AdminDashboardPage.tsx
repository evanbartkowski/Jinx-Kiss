import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService, AdminStats } from '../services/adminService';
import { AdminOverview } from '../components/admin/AdminOverview';
import { PromptModeration } from '../components/admin/PromptModeration';
import { GameContentManager } from '../components/admin/GameContentManager';
import { CommunityDeckManager } from '../components/admin/CommunityDeckManager';
import { UserManagement } from '../components/admin/UserManagement';
import { CardReportModeration } from '../components/admin/CardReportModeration';
import { CollectionBrowser } from '../components/admin/CollectionBrowser';
import { Shield, LayoutDashboard, Clock, FileText, Layers, Users, Lock, Flag } from 'lucide-react';

export const AdminDashboardPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { isAdmin, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'reports' | 'content' | 'decks' | 'users' | 'collections'>('content');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDecks: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
  });

  const loadStats = async () => {
    try {
      const data = await adminService.getOverviewStats();
      setStats(data);
    } catch (e) {
      console.warn('Failed to load admin stats', e);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin, activeTab]);

  // If not admin, access denied screen
  if (!isAdmin) {
    return (
      <div className="w-full max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-4 shadow-neon-red">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Restricted Access</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6">
          The Jinx Kiss Administrator Dashboard requires authorized server-side administrative credentials.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-bold text-xs transition-all"
        >
          Sign in as admin
        </button>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'moderation', label: 'Submissions', icon: Clock, badge: stats.pendingSubmissions > 0 ? stats.pendingSubmissions : undefined },
    { id: 'reports', label: 'Card Reports', icon: Flag },
    { id: 'content', label: 'Game Content Manager', icon: FileText },
    { id: 'decks', label: 'All decks', icon: Layers },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-pink to-brand-violet text-white shadow-neon-violet">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Admin Command Center</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-500/40">
                Live Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Platform moderation, game card library controls, and community oversight
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          Back to Website
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-white/[0.06]">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all select-none cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-brand-pink/20 to-brand-violet/20 border border-brand-pink text-white shadow-neon-pink'
                  : 'bg-zinc-900/60 border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4 text-brand-pink" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-black">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            onNavigateTab={(tab) => {
              if (tab === 'moderation') setActiveTab('moderation');
              else if (tab === 'content') setActiveTab('content');
              else if (tab === 'decks') setActiveTab('decks');
              else if (tab === 'users') setActiveTab('users');
            }}
          />
        )}

        {activeTab === 'moderation' && <PromptModeration />}
        {activeTab === 'reports' && <CardReportModeration />}
        {activeTab === 'content' && <GameContentManager />}
        {activeTab === 'decks' && <CommunityDeckManager />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'collections' && <CollectionBrowser />}
      </div>

    </div>
  );
};

