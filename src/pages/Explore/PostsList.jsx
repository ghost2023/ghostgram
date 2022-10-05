import PostPreview from "components/PostPreview"
import { DB } from "fb-config"
import { get, limitToFirst, query, ref } from "firebase/database"
import { useEffect, useState } from "react"
import style from './explore.module.css'
import PostsCarousel from "./PostsCarousel"

export default function PostsList() {
    const [posts, setPosts] = useState([])
    const [isLoading, setLoadingStatus] = useState(true)
    const [index, setIndex] = useState(-1)
    
    useEffect(() => {
      get( query(
        ref(DB, 'posts/'),
        limitToFirst(30)
        )).then(snapShot => {
          const PostsArray = Object.entries(snapShot.val()).map(([id, body]) => {
            return {id, ...body}
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
