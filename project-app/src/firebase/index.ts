import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

function initializeFirebase() {
  try {
    return getApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
}

function getFirebase() {
  const app = initializeFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export { getFirebase, initializeFirebase };

export * from './provider';
export * from './auth/use-user';
