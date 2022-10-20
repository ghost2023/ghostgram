import PostModal from 'components/Modals/PostModal'
import Navbar from 'components/NavBar'
import { db } from 'fb-config'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import style from 'styles/Post.module.css'
import { formatPostTime } from 'utils/formatTime'

export default function Post() {
    const { postId } = useParams()
    const [post, setPost] = useState()
    const [timePosted, setTimePosted] = useState('')

    useEffect(() => {
      getDoc(doc(db, 'posts', postId))
      .then(item => {
        setPost({...item.data(), id:postId})
        setTimePosted(formatPostTime(item.data().timeStamp))
      })
    }, [postId])
    
  if(!post) return null
  return (
    <div className={style.page}>
     <Navbar /> 
     <main>
        <PostModal {...{ post, timePosted}} />
        <div className={style.separator}></div>
     </main>
    </div>
  )
}
