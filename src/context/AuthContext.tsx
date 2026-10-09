import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  requiresPasswordChange: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<UserProfile>;
  register: (username: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;
  deleteAccount: (pw: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { showToast } = useToast();

  useEffect(() => {
    return authService.onProfileChange((profile) => {
      setCurrentUser(profile);
    });
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const user = await authService.login(username, password);
      showToast(`Welcome back, ${user.username}!`, 'success');
      closeAuthModal();
      return user;
    } catch (e: any) {
      showToast(e.message || 'Login failed', 'error');
      throw e;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const user = await authService.register(username, password);
      showToast(`Account created! Welcome, ${user.username}!`, 'success');
      closeAuthModal();
      return user;
    } catch (e: any) {
      showToast(e.message || 'Registration failed', 'error');
      throw e;
    }
  };

  const logout = async () => {
    await authService.logout();
    showToast('Signed out successfully.', 'info');
  };

  const changePassword = async (oldPw: string, newPw: string) => {
    try {
      await authService.changePassword(oldPw, newPw);
      showToast('Password updated successfully!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to update password', 'error');
      throw e;
    }
  };

  const deleteAccount = async (pw: string) => {
    try {
      await authService.deleteAccount(pw);
      showToast('Account has been deleted.', 'info');
    } catch (e: any) {
      showToast(e.message || 'Failed to delete account', 'error');
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        requiresPasswordChange: !!currentUser?.requiresPasswordChange,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
