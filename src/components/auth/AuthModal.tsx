import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Sparkles, X, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const isRegister = authModalMode === 'register';

  // Weak password evaluation (warn without blocking min 4)
  const isWeakPassword = password.length >= 4 && password.length < 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        await register(cleanUsername, password);
      } else {
        await login(cleanUsername, password);
      }
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl glass-panel border border-brand-pink/30 shadow-2xl shadow-brand-pink/15 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-violet text-white shadow-neon-pink">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isRegister ? 'Join Jinx Kiss' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isRegister ? 'No email required. Just choose a username.' : 'Sign in to access your decks & community cards'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Pick a unique username"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink transition-all"
                minLength={3}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink transition-all"
                minLength={4}
                required
              />
            </div>

            {/* Weak password warning */}
            {isWeakPassword && (
              <div className="mt-1.5 text-[11px] text-amber-400/90 flex items-center gap-1">
                <span>⚠️ Note: Short passwords are easy to guess, but accepted.</span>
              </div>
            )}
          </div>

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-pink transition-all"
                  minLength={4}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-sm text-white shadow-neon-pink flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

        </form>

        {/* Toggle Mode */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] text-center text-xs text-zinc-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => openAuthModal('login')}
                className="text-pink-400 hover:text-pink-300 font-semibold underline underline-offset-2 ml-1"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                onClick={() => openAuthModal('register')}
                className="text-pink-400 hover:text-pink-300 font-semibold underline underline-offset-2 ml-1"
              >
                Create one now
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

