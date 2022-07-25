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
      const uid = userCredential.user.uid
      set(ref(DB, 'users/' + uid), {
        name,
        email,
        username,
        profile: 'default-avatar.jpg',
      })
    }
    function logOut() {
      return signOut(auth);
    }
    async function getProfileURL(){
      const imgRef = ref(SG, 'profiles/' + user.profile)
      return await getDownloadURL(SG, imgRef)
    }
    function getFollowers(){

    }
    function getFollowing(){

    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
          const userRef  = dbRef(DB, `users/${currentuser?.uid}`)
          get(userRef).then((data) => {
            console.log(data.val()) 
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
