
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ייבוא Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAOiENDZlxyM6i03rO9CWakEK_whSZdiL4",
  authDomain: "tzvibelstore.firebaseapp.com",
  projectId: "tzvibelstore",
  storageBucket: "tzvibelstore.appspot.com", // תיקון השגיאה
  messagingSenderId: "161819348981",
  appId: "1:161819348981:web:fda88d2a2efcc367d59abc",
  measurementId: "G-8DCFRVH612"
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);

// חיבור ל-Firestore
const db = getFirestore(app);

export { db };
