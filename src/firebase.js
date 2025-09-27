// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA_jWl28aq5umyqxDBKEfgh9KVV8adpOE",
  authDomain: "bike-showroom-app-d74fe.firebaseapp.com",
  projectId: "bike-showroom-app-d74fe",
  storageBucket: "bike-showroom-app-d74fe.appspot.com",
  messagingSenderId: "974534398147",
  appId: "1:974534398147:web:8104d86439274e8b5e9276",
  measurementId: "G-VN8KLBJMP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

export { db, auth, analytics };
