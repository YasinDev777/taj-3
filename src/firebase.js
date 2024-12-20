import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firestore

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAXivWRoFPKFGiwaYhglPooEm5rG72bJXg",
//   authDomain: "screener-2b456.firebaseapp.com",
//   projectId: "screener-2b456",
//   storageBucket: "screener-2b456.firebasestorage.app",
//   messagingSenderId: "860474515607",
//   appId: "1:860474515607:web:0b0cc8f4d3d5d757aa49d2"
// };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, getDocs };
