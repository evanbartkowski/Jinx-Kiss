import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../services/authService';
import { auth } from '../config/firebase';
import { getIdTokenResult, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

vi.mock('../config/firebase', () => ({ auth: { currentUser: null }, db: {} }));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), getDoc: vi.fn(async () => ({ exists: () => false, data: () => undefined })), setDoc: vi.fn(), deleteDoc: vi.fn() }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => () => {}),
  getIdTokenResult: vi.fn(async () => ({ claims: { role: 'admin' } })),
  signInWithEmailAndPassword: vi.fn(async (instance, _email, password) => {
    if (password !== 'xyz') throw Object.assign(new Error('Invalid credential'), { code: 'auth/invalid-credential' });
    instance.currentUser = { uid: 'admin_primary', email: 'admin@jinxkiss.com' };
    return { user: instance.currentUser };
  }),
  signOut: vi.fn(async instance => { instance.currentUser = null; }),
  reauthenticateWithCredential: vi.fn(), EmailAuthProvider: { credential: vi.fn() }, updatePassword: vi.fn(),
}));

describe('Authentication & Access Control', () => {
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    (auth as any).currentUser = null;
    vi.mocked(getIdTokenResult).mockResolvedValue({ claims: { role: 'admin' } } as any);
    vi.clearAllMocks();
    authService = new AuthService();
  });

  it('allows guests to play with no account or credentials', () => {
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBe(null);
    expect(authService.isAdmin()).toBe(false);
  });

  it('allows account creation using only username and password (no email required)', async () => {
    const user = await authService.register('PartyLegend', 'pass1234');
    expect(user.username).toBe('PartyLegend');
    expect(user.role).toBe('user');
    expect(user.uid).toBeDefined();
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('enforces minimum 3 characters for username and 4 for password', async () => {
    await expect(authService.register('ab', '1234')).rejects.toThrow('Username must be at least 3 characters.');
    await expect(authService.register('ValidUser', '12')).rejects.toThrow('Password must be at least 4 characters.');
  });

  it('prevents duplicate case-insensitive usernames', async () => {
    await authService.register('CoolGamer', '1234');
    await expect(authService.register('coolgamer', '5678')).rejects.toThrow('This username is already taken.');
  });

  it('supports persistent login and logout', async () => {
    await authService.register('NightOwl', 'pass4321');
    expect(authService.isAuthenticated()).toBe(true);

    await authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBe(null);

    // Can log back in
    const user = await authService.login('nightowl', 'pass4321');
    expect(user.username).toBe('NightOwl');
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('signs the reserved admin into Firebase with a short configured password', async () => {
    const admin = await authService.login(' ADMIN ', 'xyz');

    expect(admin.role).toBe('admin');
    expect(admin.requiresPasswordChange).toBe(false);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'admin@jinxkiss.com', 'xyz');
    await expect(authService.requireAdmin()).resolves.toBeUndefined();

    // Regular users cannot claim admin role
    const regular = await authService.register('RegularPlayer', 'pass1234');
    expect(regular.role).toBe('user');
  });

  it('changes administrator passwords through Firebase', async () => {
    await authService.login('admin', 'xyz');
    await authService.changePassword('xyz', 'ReplacementPassword!');
    expect(updatePassword).toHaveBeenCalledWith(auth.currentUser, 'ReplacementPassword!');
  });

  it('rejects wrong admin credentials without a browser fallback', async () => {
    await expect(authService.login('admin', 'wrong')).rejects.toThrow('Invalid username or password.');
    expect(authService.isAdmin()).toBe(false);
  });

  it('does not trust an admin role in a saved browser session', async () => {
    localStorage.setItem('jinxkiss_session_v1', JSON.stringify({ uid: 'forged', username: 'admin', role: 'admin' }));
    const restored = new AuthService();
    expect(restored.isAdmin()).toBe(false);
    await expect(restored.requireAdmin()).rejects.toThrow('administrator account');
  });

  it('requires a signed admin claim even when Firebase sign-in succeeds', async () => {
    vi.mocked(getIdTokenResult).mockResolvedValue({ claims: { role: 'user' } } as any);
    await expect(authService.login('admin', 'xyz')).rejects.toThrow('does not have administrator permissions');
    expect(auth.currentUser).toBeNull();
  });

  it('reserves the admin username and refuses local account role escalation', async () => {
    await expect(authService.register('Admin', 'test-password')).rejects.toThrow('reserved');
    await authService.register('RegularPlayer', 'test-password');
    const users = JSON.parse(localStorage.getItem('jinxkiss_local_users_v1')!);
    users.regularplayer.role = 'admin';
    localStorage.setItem('jinxkiss_local_users_v1', JSON.stringify(users));
    const profile = await authService.login('RegularPlayer', 'test-password');
    expect(profile.role).toBe('user');
    await expect(authService.requireAdmin()).rejects.toThrow('administrator account');
  });

  it('preserves local user password changes', async () => {
    await authService.register('PasswordPlayer', 'old-password');
    await authService.changePassword('old-password', 'new-password');
    await expect(authService.login('PasswordPlayer', 'old-password')).rejects.toThrow();
    expect((await authService.login('PasswordPlayer', 'new-password')).role).toBe('user');
  });

  it('allows account deletion and removes user records', async () => {
    await authService.register('DeleteMe', 'secret123');
    expect(authService.isAuthenticated()).toBe(true);

    await authService.deleteAccount('secret123');
    expect(authService.isAuthenticated()).toBe(false);

    // Cannot log in anymore
    await expect(authService.login('DeleteMe', 'secret123')).rejects.toThrow('Invalid username or password.');
  });
});

