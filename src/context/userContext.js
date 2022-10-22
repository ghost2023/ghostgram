import { onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from "react";
import { getFollowing, getUserFullData, getUserProfile } from 'utils/services';
import { auth, db } from '../fb-config';

export const userContext = createContext()

export default function UserAuthProvider({ children }) {
  const [user, setUser] = useState();
  const [follows, setFollows] = useState([]);
  const [favorites, setFavorites] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [profileUrl, setProfileUrl] = useState('')
  const value = {
    user,
    profileUrl,
    isLoading,
    follows,
    favorites,
    follow,
    unFollow,
    setUser,
    updateProfile,
    addToFav,
    removeFav
  }

  async function follow(uid){
    if(follows.includes(uid)) return
    
    const followings = user.followings + 1
    console.log(followings)
    Promise.all([
      setDoc(doc(db, 'users', user.uid, 'follows', uid), {}),
      updateDoc(doc(db, 'users', user.uid), {followings})
    ])
    setFollows(prev => [...prev, uid])
    setUser(prev => {
      return {...prev, followings}
    })
  }

  async function unFollow(uid){
    if(!follows.includes(uid)) return
    
    const followings = user.followings - 1
    await Promise.all([
      deleteDoc(doc(db, 'users', user.uid, 'follows', uid)),
      updateDoc(doc(db, 'users', user.uid), {followings})
    ])
    setFollows(prev => prev.filter(item => item !== uid))
    setUser(prev => {
      return {...prev, followings}
    })
  }

  async function addToFav(postId){
    if(favorites.includes(postId)) return
    await setDoc(doc(db, 'users', user.uid, 'favorites', postId), {})
    setFavorites(prev => [...prev, postId])
  }

  async function removeFav(postId){
    if(!favorites.includes(postId)) return
    await deleteDoc(doc(db, 'users', user.uid, 'favorites', postId))
    setFollows(prev => prev.filter(item => item !== postId))
  }

  async function updateProfile(newProfile){
    const url = await getUserProfile(newProfile) 
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

      const { uid, username, email } = currentuser
      const [userData, favs] = await Promise.all([
        getUserFullData(currentuser.uid),
        getDocs(collection(db, 'users', uid, "favorites"))
      ]) 

      setFavorites(favs.docs.map(item => item.id))

      setUser({
        uid, 
        email,
        ...userData
      })
      console.log("Auth", username);
      
      const promiseArr = await Promise.all([
        getFollowing(uid), 
        updateProfile(userData.profile)
      ])
      
      setFollows(promiseArr[0])
      setLoading(false)
    }, error => {
      console.log(error)
    });
    
    return () => unsubscribe();
  }, []);


  return (<userContext.Provider {...{value}}>
      {children}
    </userContext.Provider>)
}
