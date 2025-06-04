import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Replace with your Firebase config (get this from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBkOG5kQYCr0UCuWvSnlthJNAtrklgJtFY",
  authDomain: "codefusion-99239.firebaseapp.com",
  projectId: "codefusion-99239",
  storageBucket: "codefusion-99239.firebasestorage.app",
  messagingSenderId: "342530872436",
  appId: "1:342530872436:web:b9b720d5f5b30c960ded21",
  measurementId: "G-GL36RJJ45B"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;