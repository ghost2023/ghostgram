import { equalTo, get, limitToFirst, orderByChild, query, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import { DB } from '../fb-config'
import s from '../styles/Home.module.css'
import { useAuth } from '../userContext'

export default function Timeline() {
    const { follows } = useAuth()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPosts().then(p => setPosts(p))
    }, [])

    async function getPosts(start = 0, end = 7){
        let postsObj = {};
        for(let {id, user} of follows){
        const postsData = await get(query(
            ref(DB, 'posts/'), 
            orderByChild('username'), 
            equalTo(user),
            limitToFirst(end)
            ))
        if(!postsData.val()) continue
        postsObj = {...postsObj, ...postsData.val()}
        }
        const postsArr = Object.entries(postsObj).map(([id, body]) => {return {...body, id}})
        return postsArr
    }

  return (
    <div className={s.container}>
        {posts.map(post => <Post key={post.id} post={post}/> )}
    </div> 
  )
}
