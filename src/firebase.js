// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2Uzn5VhwjDupUHUGD84BYbNaD_djXOxE",
  authDomain: "hanamariyam-portfolio-56b6d.firebaseapp.com",
  projectId: "hanamariyam-portfolio-56b6d",
  storageBucket: "hanamariyam-portfolio-56b6d.firebasestorage.app",
  messagingSenderId: "71521695474",
  appId: "1:71521695474:web:cfd29f1e025ae91ce1c26b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services App.jsx imports: `import { db, auth, storage } from "./firebase"`
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
