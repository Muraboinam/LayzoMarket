// Firebase configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyDuFtqDlXSDaaQacZHCUKrWKlhMMN0seXk",
  authDomain: "layzomarket-dae46.firebaseapp.com",
  projectId: "layzomarket-dae46",
  storageBucket: "layzomarket-dae46.firebasestorage.app",
  messagingSenderId: "371380445401",
  appId: "1:371380445401:web:18ad3f0e44289a5bc99ec8",
  measurementId: "G-0SJ55PWKPE"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;