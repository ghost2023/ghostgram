import NewPost from 'components/NewPostModal/';
import PostPreview from 'components/PostPreview';
import { db } from 'fb-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Camera from 'svgs/Camera';
import style from '../Account.module.css';

export default function Posts({ uid, isSameUser }) {
    const [posts, setPosts] = useState([])
    const [newPost, openNewPost] = useState(false)

    useEffect(() => {
        setPosts([])
        getDocs(query(
            collection(db, 'posts'),
            where("user", "==", uid)
        )) 
        .then(d => {
            setPosts(d.docs.map(doc => {return {
                ...doc.data(), id: doc.id
            }}))
        })
    },[uid])


  if(!posts.length)return (
    <article className={style.postsection}>
        <div className={style.noposts}>
            <div className={style.cameraicon}>
                <Camera/>
            </div>
            {!isSameUser? 
                <h1>No Posts Yet</h1>:
                <>
                    <h1 className={style.self}>Share Photos</h1>
                    <p>When you share photos, they will appear on your profile.</p>
                    <button onClick={() => openNewPost(true)}>Share your first photo</button>
                </>
            }
        </div>
        {newPost ? <NewPost closeNewPost={() => openNewPost(false)} /> : null}
    </article>
  )
  return(
    <article className={style.postsection}>
        {posts.map(post => <PostPreview {...{post}} key={post.id}/>)}
    </article>
  )
}
