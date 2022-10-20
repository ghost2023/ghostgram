import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAgWpK6-6Bz-KAkdwUMjKn3rgFySe2Ps8U",
  authDomain: "ghostgram-g.firebaseapp.com",
  databaseURL: "https://ghostgram-g-default-rtdb.firebaseio.com",
  projectId: "ghostgram-g",
  storageBucket: "ghostgram-g.appspot.com",
  messagingSenderId: "261920882529",
  appId: "1:261920882529:web:ab7b4021ba5dec75060f20"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const SG = getStorage(app)
export const db = getFirestore(app)
export const realDb = getDatabase(app)

export default app