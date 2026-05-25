
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "examnotesaiavnish.firebaseapp.com",
  projectId: "examnotesaiavnish",
  storageBucket: "examnotesaiavnish.firebasestorage.app",
  messagingSenderId: "629399545306",
  appId: "1:629399545306:web:e55c5564fe68b8c69acce3"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}