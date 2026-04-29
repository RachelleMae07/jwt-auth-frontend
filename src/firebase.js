// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase config (replace with your real values)
const firebaseConfig = {
  apiKey: "AIzaSyCQVTbt0OIARm9N8bQiPkNEqqEKqjZCPiQ",
  authDomain: "salon-system-42d8c.firebaseapp.com",
  projectId: "salon-system-42d8c",
  storageBucket: "salon-system-42d8c.firebasestorage.app",
  messagingSenderId: "1068410599199",
  appId: "1:1068410599199:web:3f24a4fc61d073ec4fa22a",
  measurementId: "G-RD63VG92EY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);