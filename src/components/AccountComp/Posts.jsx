import { equalTo, get, orderByChild, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { DB } from '../../fb-config';
import s from '../../styles/Account.module.css';
import Camera from '../svgs/Camera';
import Post from './Post';

export default function Posts({ username }) {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        get(query(
            ref(DB, 'posts/'), 
            orderByChild('username'), 
            equalTo(username) 
        )).then(d => {
            const postsArr = Object.entries(d.val())
            setPosts(postsArr.map(([id, val]) => {return {
                ...val, id
            }}))
        })
    },[])

  if(!posts.length)return (
    <article className={s.postsection}>
        <div className={s.noposts}>
            <div className={s.cameraicon}>
                <Camera/>
            </div>
            <h1>No Posts Yet</h1>
        </div>
    </article>
  )
  return(
    <article className={s.postsection}>
        {posts.map(post => <Post {...{post}} key={post.id}/>
        )}
    </article>
  )
}
