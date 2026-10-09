import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/user';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Users, Search, ShieldAlert, ShieldCheck, Ban, CheckCircle } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [banningUser, setBanningUser] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');

  const loadUsers = () => {
    const list = adminService.getLocalUsersList();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBan = async () => {
    if (!banningUser) return;
    try {
      await adminService.banUser(banningUser, banReason || 'Violation of community guidelines');
      showToast(`User @${banningUser} suspended.`, 'info');
      setBanningUser(null);
      setBanReason('');
      loadUsers();
    } catch (e: any) {
      showToast(e.message || 'Failed to ban user', 'error');
    }
  };

  const handleUnban = async (username: string) => {
    try {
      await adminService.unbanUser(username);
      showToast(`User @${username} unsuspended.`, 'success');
      loadUsers();
    } catch (e: any) {
      showToast(e.message || 'Failed to unban user', 'error');
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">User Management</h3>
          <p className="text-xs text-zinc-400">View accounts and moderate user behavior (passwords are cryptographically salted and never exposed)</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username..."
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(u => (
          <div
            key={u.uid}
            className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-pink to-brand-violet flex items-center justify-center text-xs font-black text-white shadow-sm">
                {u.username.substring(0, 1).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">@{u.username}</span>
                  {u.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-500/40">
                      Admin
                    </span>
                  )}
                  {u.isBanned && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-500/40">
                      Suspended
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-500">
                  Registered {new Date(u.createdAt).toLocaleDateString()}
                  {u.banReason && ` • Reason: ${u.banReason}`}
                </span>
              </div>
            </div>

            {u.role !== 'admin' && (
              <div>
                {u.isBanned ? (
                  <button
                    onClick={() => handleUnban(u.username)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-neon-green transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Unban</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setBanningUser(u.username)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Suspend</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ban Reason Modal */}
      {banningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-red-500/30">
            <h4 className="text-base font-bold text-white mb-2">Suspend User @{banningUser}</h4>
            <p className="text-xs text-zinc-400 mb-4">Provide a clear note why this account is being suspended.</p>
            <input
              type="text"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g. Inappropriate submissions or harassment"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBanningUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-neon-red"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
