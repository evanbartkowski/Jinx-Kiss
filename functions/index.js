const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const crypto = require('crypto');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Strong password hashing using memory-hard scrypt with unique salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  const keyBuffer = Buffer.from(key, 'hex');
  return crypto.timingSafeEqual(derivedKey, keyBuffer);
}

// In-memory / firestore-backed rate limiter
const rateLimits = new Map();
function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimits.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count += 1;
  }
  rateLimits.set(key, record);
  return record.count <= maxAttempts;
}

/**
 * Register user with username & password (no email required)
 */
exports.registerUser = onCall({ cors: true }, async (request) => {
  const { username, password } = request.data || {};
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw new HttpsError('invalid-argument', 'Username must be at least 3 characters.');
  }
  if (!password || typeof password !== 'string' || password.length < 4) {
    throw new HttpsError('invalid-argument', 'Password must be at least 4 characters.');
  }

  const cleanUsername = username.trim();
  const normalized = cleanUsername.toLowerCase();

  const ip = request.rawRequest?.ip || 'anonymous';
  if (!checkRateLimit(`reg:${ip}`, 5, 60000)) {
    throw new HttpsError('resource-exhausted', 'Too many registration attempts. Please try again shortly.');
  }

  const usernameRef = db.collection('usernames').doc(normalized);
  const userDoc = await usernameRef.get();
  if (userDoc.exists) {
    throw new HttpsError('already-exists', 'This username is already taken.');
  }

  const uid = 'user_' + crypto.randomBytes(12).toString('hex');
  const passwordHash = hashPassword(password);

  const batch = db.batch();
  batch.set(usernameRef, { uid, username: cleanUsername, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  batch.set(db.collection('users').doc(uid), {
    uid,
    username: cleanUsername,
    role: 'user',
    createdAt: Date.now(),
    stats: {
      customDecksCount: 0,
      publishedDecksCount: 0,
      pendingSubmissionsCount: 0,
      approvedSubmissionsCount: 0,
    }
  });
  batch.set(db.collection('credentials').doc(uid), {
    uid,
    username: cleanUsername,
    normalizedUsername: normalized,
    passwordHash,
    role: 'user',
    requiresPasswordChange: false,
    updatedAt: Date.now(),
  });

  await batch.commit();

  // Create custom token for Firebase client login
  const customToken = await admin.auth().createCustomToken(uid, { role: 'user', username: cleanUsername });

  return {
    customToken,
    user: {
      uid,
      username: cleanUsername,
      role: 'user',
      createdAt: Date.now(),
    }
  };
});

/**
 * Login with username and password
 */
exports.loginUser = onCall({ cors: true }, async (request) => {
  const { username, password } = request.data || {};
  if (!username || !password) {
    throw new HttpsError('invalid-argument', 'Username and password are required.');
  }

  const normalized = username.trim().toLowerCase();
  const ip = request.rawRequest?.ip || 'anonymous';
  if (!checkRateLimit(`login:${ip}:${normalized}`, 10, 60000)) {
    throw new HttpsError('resource-exhausted', 'Too many failed attempts. Please wait 1 minute.');
  }

  const usernameDoc = await db.collection('usernames').doc(normalized).get();
  if (!usernameDoc.exists) {
    throw new HttpsError('not-found', 'Invalid username or password.');
  }

  const uid = usernameDoc.data().uid;
  const credDoc = await db.collection('credentials').doc(uid).get();
  if (!credDoc.exists) {
    throw new HttpsError('not-found', 'Invalid username or password.');
  }

  const credData = credDoc.data();
  if (credData.isBanned) {
    throw new HttpsError('permission-denied', `Your account has been suspended: ${credData.banReason || 'Rule violation'}`);
  }

  const isValid = verifyPassword(password, credData.passwordHash);
  if (!isValid) {
    throw new HttpsError('unauthenticated', 'Invalid username or password.');
  }

  const userDoc = await db.collection('users').doc(uid).get();
  const profile = userDoc.exists ? userDoc.data() : { uid, username: credData.username, role: credData.role };

  const customToken = await admin.auth().createCustomToken(uid, {
    role: credData.role,
    username: credData.username,
  });

  return {
    customToken,
    user: {
      ...profile,
      requiresPasswordChange: !!credData.requiresPasswordChange,
    }
  };
});

/**
 * Change password
 */
exports.changePassword = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const uid = request.auth.uid;
  const { oldPassword, newPassword } = request.data || {};
  if (!newPassword || newPassword.length < 4) {
    throw new HttpsError('invalid-argument', 'New password must be at least 4 characters.');
  }

  const credDoc = await db.collection('credentials').doc(uid).get();
  if (!credDoc.exists) {
    throw new HttpsError('not-found', 'User credentials not found.');
  }

  const credData = credDoc.data();
  if (!verifyPassword(oldPassword, credData.passwordHash)) {
    throw new HttpsError('unauthenticated', 'Current password is incorrect.');
  }

  const newHash = hashPassword(newPassword);
  await db.collection('credentials').doc(uid).update({
    passwordHash: newHash,
    requiresPasswordChange: false,
    updatedAt: Date.now(),
  });

  return { success: true };
});

/**
 * Delete account
 */
exports.deleteAccount = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const uid = request.auth.uid;
  const { password } = request.data || {};

  const credDoc = await db.collection('credentials').doc(uid).get();
  if (!credDoc.exists) {
    throw new HttpsError('not-found', 'User credentials not found.');
  }

  const credData = credDoc.data();
  if (!verifyPassword(password, credData.passwordHash)) {
    throw new HttpsError('unauthenticated', 'Incorrect password.');
  }

  const batch = db.batch();
  batch.delete(db.collection('credentials').doc(uid));
  batch.delete(db.collection('users').doc(uid));
  batch.delete(db.collection('usernames').doc(credData.normalizedUsername));

  await batch.commit();

  try {
    await admin.auth().deleteUser(uid);
  } catch (e) {
    // Auth user might not exist in standard Firebase Auth if custom token only
  }

  return { success: true };
});

