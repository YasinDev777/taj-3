// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDxHchqIsy4AVo0ZUWnpOQWqU9YpCio7A",
  authDomain: "ahsan-test-e89b1.firebaseapp.com",
  projectId: "ahsan-test-e89b1",
  databaseURL: "https://ahsan-test-e89b1-default-rtdb.firebaseio.com",
  storageBucket: "ahsan-test-e89b1.firebasestorage.app",
  messagingSenderId: "979483744621",
  appId: "1:979483744621:web:3b5959c30086d179396264",
  measurementId: "G-ZKEXWJS0CL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, ref, set };