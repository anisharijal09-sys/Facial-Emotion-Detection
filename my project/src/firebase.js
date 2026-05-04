import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBydluWfaafbPnwMoUIeQQr_4tXp5hQwLk",
  authDomain: "emotion-auth.firebaseapp.com",
  projectId: "emotion-auth",
  storageBucket: "emotion-auth.firebasestorage.app",
  messagingSenderId: "1043684890896",
  appId: "1:1043684890896:web:360c7cdfd7678040d9ed95"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
