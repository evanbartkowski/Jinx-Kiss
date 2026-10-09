import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

export const AdminChangePasswordModal: React.FC = () => {
  const { currentUser, requiresPasswordChange, changePassword } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentUser || !requiresPasswordChange) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters.');
      return;
    }

    if (newPassword === '123456789') {
      setError('You must choose a new password different from the initial temporary password.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      showToast('Admin password changed! All administrative features are now unlocked.', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Verify your current temporary password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl glass-panel border border-red-500/40 shadow-2xl shadow-red-950/60 animate-scale-in">
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 shadow-neon-red">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            Mandatory Administrator Setup
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            You are logged in with the temporary setup password. For system security, you must update your password immediately before privileged admin tools can be accessed.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Current Temporary Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password (123456789)"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              New Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Choose a new password"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-xl font-bold text-sm text-white shadow-neon-red flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Updating...' : 'Set New Password & Unlock Admin'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};

