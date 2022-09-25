import { auth, DB } from "fb-config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { get, push, ref as dbRef, remove, set } from "firebase/database"

export async function likePost(postId, user){
    const likeref = dbRef(DB, `likes/${postId}/${user.username}`)

    await set(likeref, {
        username : user.username,
        profile : user.profile,
        timestamp: Date.now(),
        name: user.name
    })
    const prevLikeCount = (await get(dbRef(DB, `likes/${postId}/count`))).val()
    await set(dbRef(DB, `likes/${postId}/count`), prevLikeCount + 1)
}

export async function disLikePost(postId, username){
    await remove(dbRef(DB, `likes/${postId}/${username}`))

    const prevLikeCount = (await get(dbRef(DB, `likes/${postId}/count`))).val()
    await set(dbRef(DB, `likes/${postId}/count`), prevLikeCount - 1)
}

export async function commentPost(postId, user, content){
    const commentRef = push(dbRef(DB,  `comments/${postId}/`))
    
    await set(commentRef, {
        content,
        userId: user.uid,
        username: user.username,
        userProfile: user.profile,
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
export function logOut() {
    return signOut(auth);
}