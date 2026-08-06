import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6bfUSYu6TuV2Pavaan2JQw6WiVk71EGA",
  authDomain: "khmerricehub.firebaseapp.com",
  projectId: "khmerricehub",
  storageBucket: "khmerricehub.firebasestorage.app",
  messagingSenderId: "171074243213",
  appId: "1:171074243213:web:bb4b1e308ee37da711b0c4",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
