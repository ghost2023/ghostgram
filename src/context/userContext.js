import { onAuthStateChanged } from 'firebase/auth';
import { push, ref as dbRef, remove, set, update } from "firebase/database";
import { getDownloadURL, ref } from "firebase/storage";
import { createContext, useEffect, useState } from "react";
import { getFollowing, getUserByUid } from 'utils/services';
import { auth, DB, SG } from '../fb-config';

export const userContext = createContext()

export default function UserAuthProvider({ children }) {
    const [user, setUser] = useState();
    const [follows, setFollows] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [profileUrl, setProfileUrl] = useState('')
    const value = {
      user,
      profileUrl,
      isLoading,
      follows,
      follow,
      unFollow,
      setUser,
      updateProfile
    }
    
    async function follow(uid){
      if(follows.some(i => i.user === uid)) return
      const followRef = push(dbRef(DB, 'follows/'))
      await set(followRef, {
        follower: user.uid,
        user: uid
      })
      const followings = user.followings + 1
      await update(dbRef(DB, `users/${user.uid}/`), { followings })
      setFollows(prev => [...prev, {id:followRef.key, user: uid}])
      setUser(prev => {
        return { ...prev, followings}
      })
    }
    
    async function unFollow(uid){
      const followObj = follows.find(i => i.user === uid) 
      if(!followObj) return
      await remove(dbRef(DB, 'follows/' + followObj.id))
      const followings = user.followings - 1
      await update(dbRef(DB, `users/${user.uid}/`), { followings })
      setFollows(prev => {
        return prev.filter(item => item.user === uid)
      })
      setUser(prev => {
        return {...prev, followings}
      })
    }

    async function updateProfile(newProfile){
      const url = await getDownloadURL(ref(SG, `profiles/${newProfile}`)) 
      setProfileUrl(url)
    }

    useEffect(() => {
      // watch for any user changes
      const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
        if (!currentuser){
          setUser()
          setLoading(false)
          return console.log('no user')
        }
        const data = await getUserByUid(currentuser.uid)

        const userObj = {
          ...currentuser,
          ...data
        }
        console.log("Auth", data.uid, data);
        setUser(userObj)

        const following = await getFollowing(currentuser.uid)
        setFollows(following)

        await updateProfile(userObj.profile)
        
        setLoading(false)
      });
      
      return () => unsubscribe();
      }, []);


  return (<userContext.Provider {...{value}}>
      {children}
    </userContext.Provider>)
}
