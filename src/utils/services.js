import { auth, DB, SG } from "fb-config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { equalTo, get, orderByChild, push, query, ref as dbRef, remove, set } from "firebase/database"
import { getDownloadURL, ref } from "firebase/storage"

export async function likePost(postId, uid){
    const likeref = dbRef(DB, `likes/${postId}/${uid}`)

    await set(likeref, {
        timestamp: Date.now(),
    })
    const prevLikeCount = (await get(dbRef(DB, `likes/${postId}/count`))).val()
    await set(dbRef(DB, `likes/${postId}/count`), prevLikeCount + 1)
}

export async function disLikePost(postId, uid){
    await remove(dbRef(DB, `likes/${postId}/${uid}`))

    const prevLikeCount = (await get(dbRef(DB, `likes/${postId}/count`))).val()
    await set(dbRef(DB, `likes/${postId}/count`), prevLikeCount - 1)
}

export async function commentPost(postId, user, content){
    const commentRef = push(dbRef(DB,  `comments/${postId}/`))
    
    await set(commentRef, {
        content,
        user: user.uid,
        timestamp: Date.now(),
    })
    
    const prevCommentCount = (await get(dbRef(DB, `comments/${postId}/count`))).val()
    await set(dbRef(DB, `comments/${postId}/count`), prevCommentCount + 1)
}
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}
export async function signUp(name, username, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await set(dbRef(DB, 'users/' + userCredential.user.uid), {
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
export function logOut() {
    return signOut(auth);
}

export async function getUserByUsername(username){
    const snapShot = await get(query(
        dbRef(DB, 'users/'),
        orderByChild("username"),
        equalTo(username)
        ))
    const userArr = Object.entries(snapShot.val())[0]
    return {...userArr[1], uid: userArr[0]}
}

export async function getUserByUid(uid){
    const snapShot = await get(dbRef(DB, `users/${uid}`))
    return {...snapShot.val(), uid}
}

export async function getFollowing(uid){
    const followQuery = query(dbRef(DB, 'follows/'), orderByChild('follower'), equalTo(uid))
    const snapShot = await get(followQuery)
    if(!snapShot.val()) return []
    return Object.entries(snapShot.val())
    .map(([id, body]) => {return {id, user: body.user}})
}

export async function getFollowers(uid){
    const followQuery = query(dbRef(DB, 'follows/'), orderByChild('user'), equalTo(uid))
    const snapShot = await get(followQuery)
    if(!snapShot.val()) return []
    return Object.entries(snapShot.val())
    .map(([id, body]) => {return {id, user: body.user}})
}

export async function getUserProfile(profilePath){
    return await getDownloadURL(ref(SG, `profiles/${profilePath}`)) 
}

export async function getUserwithProfileUrl(uid){
    const user = await getUserByUid(uid)
    const profileUrl = await getUserProfile(user.profile)
    return {...user, profileUrl}
}