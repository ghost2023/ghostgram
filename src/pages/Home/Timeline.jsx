import Post from 'components/Post'
import { db } from 'fb-config'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import useAuth from 'hooks/useAuth'
import { useEffect, useState } from 'react'
import style from './Home.module.css'

export default function Timeline() {
  const { follows } = useAuth()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if(!follows.length) return
    getFeed().then(setPosts)
  }, [follows])

  async function getFeed(start = 0, end = 7){
    const snap = await getDocs(query(
      collection(db, 'posts'),
      where("user", "in" , follows),
      limit(7)
    ))
    return snap.docs.map(item => {
      return {...item.data(), id: item.id}
    })
  }

  return (
    <div className={style.container}>
      {posts.map(post => <Post key={post.id} {...{post}}/> )}
    </div> 
  )
}
