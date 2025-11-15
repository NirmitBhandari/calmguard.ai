import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrdvMgQSU0x-DXiEJygMyQayL_CdJCN6w",
  authDomain: "hackathon-5575c.firebaseapp.com",
  projectId: "hackathon-5575c",
  storageBucket: "hackathon-5575c.appspot.com",
  messagingSenderId: "734773639320",
  appId: "1:734773639320:web:0e8b76f5d6aea117d1b8ed",
  measurementId: "G-NB736RBKSN"
};

// initialize only ONCE
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
