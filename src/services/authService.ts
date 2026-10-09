import { auth, db } from '../config/firebase';
import { signInWithCustomToken, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types/user';

const LOCAL_SESSION_KEY = 'jinxkiss_session_v1';
const LOCAL_USERS_KEY = 'jinxkiss_local_users_v1';

// WebCrypto helper for robust client-side hashing fallback
async function hashPasswordWebCrypto(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const rawKey = await crypto.subtle.exportKey('raw', derivedKey);
  return Array.from(new Uint8Array(rawKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export class AuthService {
  private currentUserProfile: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        this.currentUserProfile = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse local session', e);
    }
  }

  private saveSession(profile: UserProfile | null) {
    this.currentUserProfile = profile;
    if (profile) {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
    this.notifyListeners();
  }

  public onProfileChange(callback: (user: UserProfile | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUserProfile);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUserProfile));
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUserProfile;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserProfile;
  }

  public isAdmin(): boolean {
    return this.currentUserProfile?.role === 'admin';
  }

  /**
   * Register with username and password
   */
  async register(username: string, password: string): Promise<UserProfile> {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    const normalized = cleanUsername.toLowerCase();

    // Check if user exists in local storage store
    const localUsers = this.getLocalUsers();
    if (localUsers[normalized]) {
      throw new Error('This username is already taken.');
    }

    const salt = crypto.randomUUID();
    const hash = await hashPasswordWebCrypto(password, salt);
    const uid = 'user_' + Math.random().toString(36).substring(2, 10);

    const profile: UserProfile = {
      uid,
      username: cleanUsername,
      role: 'user',
      createdAt: Date.now(),
      stats: {
        customDecksCount: 0,
        publishedDecksCount: 0,
        pendingSubmissionsCount: 0,
        approvedSubmissionsCount: 0,
      },
    };

    // Save in local users store
    localUsers[normalized] = {
      uid,
      username: cleanUsername,
      salt,
      hash,
      role: 'user',
      createdAt: Date.now(),
      requiresPasswordChange: false,
    };
    this.saveLocalUsers(localUsers);

    // Also persist profile to Firestore if db is active
    try {
      if (db) {
        await setDoc(doc(db, 'users', uid), profile);
      }
    } catch (e) {
      console.warn('Firestore write fallback:', e);
    }

    this.saveSession(profile);
    return profile;
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<UserProfile> {
    const normalized = username.trim().toLowerCase();
    const localUsers = this.getLocalUsers();

    // Check for automatic bootstrap of admin if logging in as admin for first time
    if (normalized === 'admin' && !localUsers['admin']) {
      await this.bootstrapAdmin();
    }

    const storedUser = localUsers[normalized];
    if (!storedUser) {
      throw new Error('Invalid username or password.');
    }

    if (storedUser.isBanned) {
      throw new Error(`Your account has been suspended: ${storedUser.banReason || 'Rule violation'}`);
    }

    const computedHash = await hashPasswordWebCrypto(password, storedUser.salt);
    if (computedHash !== storedUser.hash) {
      throw new Error('Invalid username or password.');
    }

    const profile: UserProfile = {
      uid: storedUser.uid,
      username: storedUser.username,
      role: storedUser.role,
      requiresPasswordChange: storedUser.requiresPasswordChange,
      createdAt: storedUser.createdAt,
      stats: {
        customDecksCount: 0,
        publishedDecksCount: 0,
        pendingSubmissionsCount: 0,
        approvedSubmissionsCount: 0,
      },
    };

    // Sync from Firestore if available
    try {
      if (db) {
        const docSnap = await getDoc(doc(db, 'users', storedUser.uid));
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as UserProfile;
          profile.stats = cloudData.stats || profile.stats;
          if (cloudData.role) profile.role = cloudData.role;
        }
      }
    } catch (e) {
      // Offline fallback
    }

    this.saveSession(profile);
    return profile;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      // Ignore
    }
    this.saveSession(null);
  }

  /**
   * Change Password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (!this.currentUserProfile) {
      throw new Error('You must be signed in.');
    }
    if (newPassword.length < 4) {
      throw new Error('New password must be at least 4 characters.');
    }

    const normalized = this.currentUserProfile.username.toLowerCase();
    const localUsers = this.getLocalUsers();
    const storedUser = localUsers[normalized];
    if (!storedUser) {
      throw new Error('Account record not found.');
    }

    const oldHash = await hashPasswordWebCrypto(oldPassword, storedUser.salt);
    if (oldHash !== storedUser.hash) {
      throw new Error('Current password is incorrect.');
    }

    const newSalt = crypto.randomUUID();
    const newHash = await hashPasswordWebCrypto(newPassword, newSalt);

    storedUser.salt = newSalt;
    storedUser.hash = newHash;
    storedUser.requiresPasswordChange = false;
    localUsers[normalized] = storedUser;
    this.saveLocalUsers(localUsers);

    // Update session
    const updatedProfile: UserProfile = {
      ...this.currentUserProfile,
      requiresPasswordChange: false,
    };
    this.saveSession(updatedProfile);
  }

  /**
   * Delete Account
   */
  async deleteAccount(password: string): Promise<void> {
    if (!this.currentUserProfile) {
      throw new Error('You must be signed in.');
    }

    const normalized = this.currentUserProfile.username.toLowerCase();
    const localUsers = this.getLocalUsers();
    const storedUser = localUsers[normalized];
    if (!storedUser) {
      throw new Error('Account record not found.');
    }

    const computedHash = await hashPasswordWebCrypto(password, storedUser.salt);
    if (computedHash !== storedUser.hash) {
      throw new Error('Incorrect password.');
    }

    delete localUsers[normalized];
    this.saveLocalUsers(localUsers);

    try {
      if (db) {
        await deleteDoc(doc(db, 'users', this.currentUserProfile.uid));
      }
    } catch (e) {
      // Fallback
    }

    this.saveSession(null);
  }

  /**
   * Bootstrap Admin account (one-time setup)
   * Username: admin
   * Initial password: 123456789
   * requiresPasswordChange: true
   */
  async bootstrapAdmin(): Promise<void> {
    const localUsers = this.getLocalUsers();
    if (localUsers['admin']) {
      return; // Already bootstrapped
    }

    const salt = 'jinx_admin_bootstrap_salt';
    const hash = await hashPasswordWebCrypto('123456789', salt);
    const uid = 'admin_primary';

    localUsers['admin'] = {
      uid,
      username: 'admin',
      salt,
      hash,
      role: 'admin',
      requiresPasswordChange: true, // Forces immediate password change before permissions unlocked!
      createdAt: Date.now(),
    };
    this.saveLocalUsers(localUsers);

    try {
      if (db) {
        await setDoc(doc(db, 'users', uid), {
          uid,
          username: 'admin',
          role: 'admin',
          createdAt: Date.now(),
        });
      }
    } catch (e) {
      // Fallback
    }
  }

  private getLocalUsers(): Record<string, any> {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveLocalUsers(users: Record<string, any>) {
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save local users', e);
    }
  }
}

export const authService = new AuthService();

