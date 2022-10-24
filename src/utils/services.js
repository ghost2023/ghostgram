import { auth, db, realDb, SG } from "fb-config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { equalTo, get, orderByChild, query as realQuery, ref as dbRef, set } from "firebase/database"
import { addDoc, collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"

export async function signUp(name, username, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const promiseArr = [
        setDoc(doc(db, 'users', userCredential.user.uid), {
            name,
            username,
            profile: 'default-avatar.jpg',
            occupation: '',
            bio: '',
            followings: 0,
            posts: 0,
            isVerified: false,
        }),
        set(dbRef(realDb, `users/${userCredential.user.uid}`),{
            name,
            username,
            profile: 'default-avatar.jpg',
        })
    ]
    return await Promise.all(promiseArr)
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function logOut() {
    return signOut(auth);
}

export async function getUserFullData(uid) {
    const snap = await getDoc(doc(db, 'users', uid))
    return {...snap.data(), uid}
}
export async function getUserDataByUsername(username){
    const userData = await getDocs(query(
        collection(db, "users"),
        where("username", "==", username)
    ))
    if(userData.empty) return undefined
    return {...userData.docs[0].data(), uid: userData.docs[0].id}
}
export async function getUserByUsername(username){
    const snap = await get(realQuery(
        dbRef(realDb, "users/"),
        orderByChild("username"),
        equalTo(username)
    ))
    return {...snap[0].val(), uid: snap[0].key}
}

export async function getUserByUid(uid){
    const snap = await get(dbRef(realDb, 'users/' + uid))
    return {...snap.val(), uid}
}

export async function getUserWithProfileUrl(uid){
    const user = await getUserByUid(uid)
    const profileUrl = await getUserProfile(user.profile)
    return {...user, profileUrl}
}

export async function getFollowing(uid){
   const list = await getDocs(collection(db, 'users', uid, 'follows'))
   return list.docs.map(item => item.id)
}

export async function getFollowers(uid){
    const usersData = await getDocs(query(
        collectionGroup(db, 'follows'),
        where('uid', '==', uid)
    ))
    return usersData.docs.map(item => item.data().uid)
}

export function getUserProfile(profilePath){
    return getDownloadURL(ref(SG, `profiles/${profilePath}`)) 
}

export async function getComments(postId) {
    const comments = await getDocs(collection(db, 'posts', postId, 'comments'))
    return comments.docs.map(item => item.data())
}

export async function getLikes(postId){
    const likes = await getDocs(collection(db, 'posts', postId, 'likes'))
    return likes.docs.map(item => item.id)
}

export async function likePost(postId, uid){
    await setDoc(doc(db, 'posts', postId, 'likes', uid),{timeStamp: Date.now()})
}

export async function disLikePost(postId, uid){
    await deleteDoc(doc(db, 'posts', postId, 'likes', uid))
}

export async function commentPost(postId, uid, comment){
    await addDoc(collection(db, 'posts', postId, 'comments'), {
        user: uid,
        content: comment,
        timeStamp: Date.now()
    })
}

export function getPostContents(paths){
    const promiseArr = paths.map(path => {
        return getDownloadURL(ref(SG, `posts/${path}`))
    })
    return Promise.all(promiseArr)
}