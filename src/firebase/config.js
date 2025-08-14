import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Using Firebase demo project for local development
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-smart-parking.firebaseapp.com",
  projectId: "demo-smart-parking",
  storageBucket: "demo-smart-parking.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
