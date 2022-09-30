import { onAuthStateChanged } from 'firebase/auth';
import { equalTo, get, orderByChild, push, query, ref as dbRef, remove, set, update } from "firebase/database";
import { getDownloadURL, ref } from "firebase/storage";
import { createContext, useEffect, useState } from "react";
import { auth, DB, SG } from '../fb-config';

export const userContext = createContext()

export default function UserAuthProvider({ children }) {
    const [user, setUser] = useState();
    const [follows, setFollows] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [profileUrl, setProfileUrl] = useState('')
    
    async function follow(username){
      if(follows.some(i => i.user === username)) return
      const followRef = push(dbRef(DB, 'follows/'))
      await set(followRef, {
        follower: user.username,
        followe: username
      })
      const newFollowingCount = user.followings + 1
      await update(dbRef(DB, `users/${user.username}/`), {followings: newFollowingCount})
      setFollows(prev => [...prev, {id:followRef.key, user:username}])
      setUser(prev => {
        return { ...prev, followings: newFollowingCount}
      })
    }
    
    async function unFollow(username){
      const followOb = follows.find(i => i.user === username) 
      if(!followOb) return
      const followRef = dbRef(DB, 'follows/' + followOb.id)
      await remove(followRef)
      const newFollowingCount = user.followings - 1
      await update(dbRef(DB, `users/${user.username}/`), {followings: newFollowingCount})
      setFollows(prev => {
        const newArr = prev.filter(item => item.username === username)
        return newArr
      })
      setUser(prev => {
        return {...prev, followings: newFollowingCount}
      })
    }

    async function getFollowing(username){
      const followsQuery = query(dbRef(DB, 'follows/'), orderByChild('follower'), equalTo(username))
      const followsData = (await get(followsQuery)).val()
      if(!followsData){
        setFollows([])
        return
      }
      const followsArr = Object.entries(followsData).map(([id, body]) => {return {id,user:body.followe}})
      setFollows(followsArr)
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

          await getFollowing(username)
          await updateProfile(userObj.profile)
          
          setLoading(false)
        });
        
        return () => unsubscribe();
      }, []);


  return (<userContext.Provider value={{ user, isLoading, follows, follow, unFollow, profileUrl, setUser, updateProfile }}>
      {children}
    </userContext.Provider>)
}
