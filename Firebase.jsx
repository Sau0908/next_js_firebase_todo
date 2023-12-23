import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-VCjQ8gjGAio5RifMr-k2h7jfdld_VI0",
  authDomain: "todo-firebase-e3c6b.firebaseapp.com",
  projectId: "todo-firebase-e3c6b",
  storageBucket: "todo-firebase-e3c6b.appspot.com",
  messagingSenderId: "339563509118",
  appId: "1:339563509118:web:6e29708c29cc2b8ebf6f2f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
