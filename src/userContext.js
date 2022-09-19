import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { equalTo, get, orderByChild, push, query, ref as dbRef, remove, set } from "firebase/database";
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
    const [profileUrl, setProfileUrl] = useState('')
    
    function login(email, password) {
      return signInWithEmailAndPassword(auth, email, password);
    }
    async function signUp(name, username, email, password) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set(dbRef(DB, 'users/' + username), {
        name,
        email,
        uid : userCredential.user.uid,
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
    async function follow(username){
      if(follows.some(i => i[1] === username)) return
      const followRef = push(dbRef(DB, 'follows/'))
      await set(followRef, {
        follower: user.username,
        followe: username
      })
      updateFollow()
    }
    async function unFollow(username){
      const followOb = follows.find(i => i[1] === username) 
      if(!followOb) return
      const followRef = dbRef(DB, 'follows/' + followOb[0])
      await remove(followRef)
      updateFollow()
    }
    async function updateFollow(username = user.username){
      const followsQuery = query(dbRef(DB, 'follows/'), orderByChild('follower'), equalTo(username))
      const followsData = (await get(followsQuery)).val()
      if(!followsData){
        setFollows([])
        return
      }
      const followsArr = Object.entries(followsData).map(([id, body]) => [id, body.followe])
      setFollows(followsArr)
    }

    useEffect(() => {
        // watch for any user changes
        const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
          if (!currentuser){
            setLoading(false)
            return console.log('no user')
          }
          const userQuery  = query(dbRef(DB, `users/`), orderByChild('uid'), equalTo(currentuser.uid))
          const u = await get(userQuery)
          const username = Object.keys(u.val())[0]

          const userObj = {
            ...currentuser,
            username,
            ...Object.values(u.val())[0]
          }
          console.log("Auth", username);
          setUser(userObj)

          // get and store profile image Url
          await updateFollow(username)
                      
          const url = await getDownloadURL(ref(SG, `profiles/${userObj.profile}`)) 
          setProfileUrl(url)
          setLoading(false)
        });
        
        return () => unsubscribe();
      }, []);


  return (<userContext.Provider value={{ user, isLoading, follows, login, signUp, logOut, follow, unFollow, profileUrl }}>
      {children}
    </userContext.Provider>)
}
