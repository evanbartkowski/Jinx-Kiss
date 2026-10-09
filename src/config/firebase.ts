import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "jinxkiss-cfbaf",
  appId: "1:1044843832410:web:97cf361b4767a5c56c6463",
  storageBucket: "jinxkiss-cfbaf.firebasestorage.app",
  apiKey: "AIzaSyAFW1y8_fpLjTb4hv8w5_RsbYe4igCqteM",
  authDomain: "jinxkiss-cfbaf.firebaseapp.com",
  messagingSenderId: "1044843832410",
  measurementId: "G-D8X88WG3WH",
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
