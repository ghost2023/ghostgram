import PostPreview from "components/PostPreview"
import { db } from "fb-config"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import style from './explore.module.css'
import PostsCarousel from "./PostsCarousel"

export default function PostsList() {
    const [posts, setPosts] = useState([])
    const [isLoading, setLoadingStatus] = useState(true)
    const [index, setIndex] = useState(-1)
    
    useEffect(() => {

      getDocs(query(collection(db, 'posts'), limit(30)))
      .then(snap => {
        
        const PostsArray = snap.docs.map(item => {
          return { id: item.id, ...item.data()}
        })
        console.log(PostsArray)
        setPosts(PostsArray)
        setLoadingStatus(false)
      })
    }, [])

    if(isLoading) return <></>
  return (
    <div className={style.postlist}>
      {posts.map((post, i) => {
          return (
            <div key={post.id} onClick={() => setIndex(i)} className={style.postpreview}>
              <PostPreview {...{post}} />
            </div>
          )
      })}
      <PostsCarousel closeCarousel={() => setIndex(-1)} {...{index, setIndex, posts}}/>
    </div>
  )
}
