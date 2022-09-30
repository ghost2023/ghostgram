import NewPost from 'components/NewPostModal/';
import PostPreview from 'components/PostPreview';
import { DB } from 'fb-config';
import { equalTo, get, orderByChild, query, ref } from 'firebase/database';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import Camera from 'svgs/Camera';
import s from '../Account.module.css';

export default function Posts({ username }) {
    const [posts, setPosts] = useState([])
    const { user } = useAuth()
    const [newPost, openNewPost] = useState(false)

    useEffect(() => {
        setPosts([])
        get(query(
            ref(DB, 'posts/'), 
            orderByChild('username'), 
            equalTo(username) 
        )).then(d => {
            if(!d.val()) return
            const postsArr = Object.entries(d.val())
            setPosts(postsArr.map(([id, val]) => {return {
                ...val, id
            }}))
        })
    },[username])


  if(!posts.length)return (
    <article className={s.postsection}>
        <div className={s.noposts}>
            <div className={s.cameraicon}>
                <Camera/>
            </div>
            {username !== user?.username? 
                <h1>No Posts Yet</h1>:
                <>
                    <h1 className={s.self}>Share Photos</h1>
                    <p>When you share photos, they will appear on your profile.</p>
                    <button onClick={() => openNewPost(true)}>Share your first photo</button>
                </>
            }
        </div>
        {newPost ? <NewPost closeNewPost={() => openNewPost(false)} />:<></>}
    </article>
  )
  return(
    <article className={s.postsection}>
        {posts.map(post => <PostPreview {...{post}} key={post.id}/>
        )}
    </article>
  )
}
