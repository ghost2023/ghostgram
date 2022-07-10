import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

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
const auth = getAuth(app)
const SG = getStorage(app)