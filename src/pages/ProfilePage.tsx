import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { deckService } from '../services/deckService';
import { submissionService } from '../services/submissionService';
import { useToast } from '../context/ToastContext';
import { User, Calendar, Layers, Sparkles, Lock, Trash2, LogOut, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { currentUser, logout, changePassword, deleteAccount } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    decksCreated: 0,
    decksPublished: 0,
    pendingPrompts: 0,
    approvedPrompts: 0,
  });

  // Change password form
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete account form
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const fetchStats = async () => {
      const userDecks = await deckService.getUserDecks(currentUser.uid);
      const userSubs = await submissionService.getUserSubmissions(currentUser.uid);

      setStats({
        decksCreated: userDecks.length,
        decksPublished: userDecks.filter(d => d.visibility === 'public').length,
        pendingPrompts: userSubs.filter(s => s.status === 'pending').length,
        approvedPrompts: userSubs.filter(s => s.status === 'approved').length,
      });
    };
    fetchStats();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-24 text-zinc-400">
        Please sign in to view your profile.
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      showToast('New password must be at least 4 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch {
      // Toast already shown in context
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('This action is irreversible. Are you sure you want to delete your account?')) return;
    try {
      await deleteAccount(deletePassword);
      onNavigate('home');
    } catch {
      // Toast shown in context
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl glass-panel border border-brand-violet/30 shadow-2xl shadow-brand-violet/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        
        {/* Avatar */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-pink via-purple-600 to-brand-violet flex items-center justify-center text-3xl font-black text-white shadow-neon-violet flex-shrink-0">
          {currentUser.username.substring(0, 1).toUpperCase()}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              @{currentUser.username}
            </h2>
            {currentUser.role === 'admin' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-500/40">
                Administrator
              </span>
            )}
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-brand-pink" />
            <span>Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl border border-white/10 hover:border-red-500/30 text-xs font-bold text-zinc-400 hover:text-red-400 bg-zinc-900 transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

      </div>

      {/* User Contribution Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] text-center">
          <Layers className="w-5 h-5 text-brand-pink mx-auto mb-1" />
          <div className="text-2xl font-black text-white">{stats.decksCreated}</div>
          <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Decks Created</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] text-center">
          <Sparkles className="w-5 h-5 text-brand-violet mx-auto mb-1" />
          <div className="text-2xl font-black text-white">{stats.decksPublished}</div>
          <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Public Decks</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-2xl font-black text-white">{stats.approvedPrompts}</div>
          <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Cards Approved</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] text-center">
          <User className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="text-2xl font-black text-white">{stats.pendingPrompts}</div>
          <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Pending Cards</span>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-6">
        
        {/* Change Password Card */}
        <div className="p-6 rounded-3xl glass-panel border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-pink" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h3>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="text-xs font-semibold text-pink-400 hover:text-pink-300"
              >
                Update
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Current password"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 4 characters)"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet text-white font-bold text-xs shadow-neon-pink"
                >
                  Save New Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Account Card */}
        <div className="p-6 rounded-3xl glass-panel border border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-red-300 uppercase tracking-wider">Danger Zone</h3>
            </div>
            {!isDeletingAccount && (
              <button
                onClick={() => setIsDeletingAccount(true)}
                className="text-xs font-semibold text-red-400 hover:text-red-300"
              >
                Delete Account
              </button>
            )}
          </div>

          <p className="text-xs text-zinc-400">
            Deleting your account completely removes your username, profile data, and access to private decks.
          </p>

          {isDeletingAccount && (
            <form onSubmit={handleDeleteAccount} className="mt-4 space-y-3 pt-2">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password to confirm deletion"
                className="w-full bg-zinc-900 border border-red-500/40 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeletingAccount(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-neon-red"
                >
                  Permanently Delete My Account
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

