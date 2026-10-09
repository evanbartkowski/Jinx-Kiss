import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "starlight-fishing",
  appId: "1:1092703473317:web:bd339b3915feb05633c74c",
  storageBucket: "starlight-fishing.firebasestorage.app",
  apiKey: "AIzaSyAshP_PJhPYe_8Ug6eDRV_gUDw0LdEQ8bU",
  authDomain: "starlight-fishing.firebaseapp.com",
  messagingSenderId: "1092703473317",
  measurementId: "G-8ED6NF7DNC",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);

  // Set persistence
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // Ignored if persistence fails (e.g. private browsing or test environment)
    });
  }
} catch (error) {
  console.warn('Firebase initialization error, fallback mode active:', error);
}

export { app, auth, db };

