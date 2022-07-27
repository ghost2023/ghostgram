import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, DB, SG } from './fb-config'
import { get, ref as dbRef, set } from "firebase/database";
import { ref, getDownloadURL } from "firebase/storage";

const userContext = createContext()

export function useAuth(){
    return useContext(userContext)
}

export default function UserAuthProvider({ children }) {
    const [user, setUser] = useState();

    function login(email, password) {
      return signInWithEmailAndPassword(auth, email, password);
    }
    async function signUp(name, username, email, password) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set(dbRef(DB, 'users/' + userCredential.user.uid), {
        name,
        email,
        username,
        profile: 'default-avatar.jpg',
      })
    }
    function logOut() {
      return signOut(auth);
    }
    function getProfileURL(){
      return getDownloadURL(ref(SG, 'profiles/' + user.profile)) 
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
          if (!currentuser){
            setUser()
            return console.log('no user')
          }
          const userRef  = dbRef(DB, `users/${currentuser?.uid}`)
          get(userRef).then((data) => {
            console.log("Auth", {...currentuser, ...data.val()});
            setUser({...currentuser, ...data.val()});
          })
        });
    
        return () => unsubscribe();
      }, []);

  return (<userContext.Provider value={{ user, login, signUp, logOut, getProfileURL, }}>
      {children}
    </userContext.Provider>)
}