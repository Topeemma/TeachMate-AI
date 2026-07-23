import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBafwdVCqdRpPQ_oM3pV-IgdU_4R3lc4vw",
  authDomain: "gen-lang-client-0657497814.firebaseapp.com",
  projectId: "gen-lang-client-0657497814",
  storageBucket: "gen-lang-client-0657497814.firebasestorage.app",
  messagingSenderId: "508347770645",
  appId: "1:508347770645:web:88d69b5aa256c23be9eb1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
};
