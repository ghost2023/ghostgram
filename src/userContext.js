import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { equalTo, get, orderByChild, push, query, ref as dbRef, remove, set, update } from "firebase/database";
import { getDownloadURL, ref } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, DB, SG } from './fb-config';

const userContext = createContext()

export function useAuth(){
    return useContext(userContext)
}

export default function UserAuthProvider({ children }) {
    const [user, setUser] = useState();
    const [follows, setFollows] = useState([]);
    const [isLoading, setLoading] = useState(true);

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
        occupation: '',
        bio: '',
        followings: 0,
        posts: 0,
        isVerified: false,
      })
    }
    function logOut() {
      return signOut(auth);
    }
    async function follow(uid){
      if(follows.some(i => i[1] === uid)) return
      const followRef = push(dbRef(DB, 'follows/'))
      await set(followRef, {
        follower: user.uid,
        followe: uid
      })
      updateFollow()
    }
    async function unFollow(uid){
      const followOb = follows.find(i => i[1] === uid) 
      if(!followOb) return
      const followRef = dbRef(DB, 'follows/' + followOb[0])
      await remove(followRef)
      updateFollow()
    }
    async function updateFollow(uid = user.uid){
      const followsQuery = query(dbRef(DB, 'follows/'), orderByChild('follower'), equalTo(uid))
      const followsData = (await get(followsQuery)).val()
      if(!followsData){
        await update(dbRef(DB, `users/${uid}`), {followings: 0})
        setUser(p => {return {...p, followings: 0}})
        setFollows([])
        return
      }
      const followsArr = Object.entries(followsData).map(([id, body]) => [id, body.followe])
      await update(dbRef(DB, `users/${uid}`), {followings: followsArr.length})
      setUser(p => {return {...p, followings: followsArr.length}})
      setFollows(followsArr)
    }

    useEffect(() => {
        // watch for any user changes
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
          if (!currentuser){
            setLoading(false)
            return console.log('no user')
          }
          const userRef  = dbRef(DB, `users/${currentuser?.uid}`)
          get(userRef).then(async (data) => {
            console.log("Auth", {...currentuser, ...data.val()});

            // get and store profile image Url
            await updateFollow(currentuser.uid)

            getDownloadURL(ref(SG, `profiles/${data.val().profile}`)).then(url => {
              setUser({...currentuser, ...data.val(), profile: url});
              setLoading(false)
            })
          })
        });
        
        return () => unsubscribe();
      }, []);


  return (<userContext.Provider value={{ user, isLoading, follows, login, signUp, logOut, follow, unFollow }}>
      {children}
    </userContext.Provider>)
}
