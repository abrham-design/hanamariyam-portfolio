// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

// Services App.jsx imports: `import { db, auth } from "./firebase"`
//
// db uses a persistent local cache (stored in the browser's IndexedDB) so
// that on reload, the site shows the real last-saved content immediately
// from that local copy instead of briefly flashing old/default content
// while waiting on a fresh network response. persistentMultipleTabManager
// keeps this working correctly if the site is open in more than one tab.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
export const auth = getAuth(app);
