import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCDxHchqIsy4AVo0ZUWnpOQWqU9YpCio7A",
  authDomain: "ahsan-test-e89b1.firebaseapp.com",
  projectId: "ahsan-test-e89b1",
  storageBucket: "ahsan-test-e89b1.firebasestorage.app",
  messagingSenderId: "979483744621",
  appId: "1:979483744621:web:3b5959c30086d179396264",
  measurementId: "G-ZKEXWJS0CL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, getDocs };
