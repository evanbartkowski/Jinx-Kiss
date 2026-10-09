import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../services/authService';

describe('Authentication & Access Control', () => {
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
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

  it('bootstraps admin account and requires immediate password change', async () => {
    await authService.bootstrapAdmin();
    const admin = await authService.login('admin', '123456789');

    expect(admin.role).toBe('admin');
    expect(admin.requiresPasswordChange).toBe(true);

    // Regular users cannot claim admin role
    const regular = await authService.register('RegularPlayer', 'pass1234');
    expect(regular.role).toBe('user');
  });

  it('allows password changes and clears requiresPasswordChange', async () => {
    await authService.bootstrapAdmin();
    await authService.login('admin', '123456789');

    await authService.changePassword('123456789', 'SuperSecurePass2026!');
    const current = authService.getCurrentUser();
    expect(current?.requiresPasswordChange).toBe(false);

    // Can log in with new password
    await authService.logout();
    const updated = await authService.login('admin', 'SuperSecurePass2026!');
    expect(updated.role).toBe('admin');
    expect(updated.requiresPasswordChange).toBe(false);
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

