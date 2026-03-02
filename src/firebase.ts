// src/firebase.ts

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF_XiKBdibLdH62PZItF5S_2AhzHU2ET0",
  authDomain: "trip-craft-varunnn9.firebaseapp.com",
  projectId: "trip-craft-varunnn9",
  storageBucket: "trip-craft-varunnn9.firebasestorage.app",
  messagingSenderId: "10989688213",
  appId: "1:10989688213:web:90e8bf19ac8fbea6ff929c"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Google login provider
export const googleProvider = new GoogleAuthProvider()

export default app