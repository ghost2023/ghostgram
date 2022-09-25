import Media from 'components/Media'
import PostExtended from 'components/Modals/PostModal'
import Navbar from 'components/NavBar'
import Slider from 'components/Slider'
import { DB } from 'fb-config'
import { get, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import style from 'styles/Post.module.css'
import { formatPostTime } from 'utils/formatTime'

export default function Post() {
    const { postId } = useParams()
    const [post, setPost] = useState({})
    const [content, setContent] = useState([])
    const [timePosted, setTimePosted] = useState('')

    useEffect(() => {
        get(ref(DB, 'posts/' + postId)).then(snapShot => {
            const postData = snapShot.val()
            setPost(postData)
            setTimePosted(formatPostTime(postData.timeStamp))
            if(postData.content.length === 1) setContent(
                <div className={style.pic}>{<Media path={postData.content[0]}/>}</div>
              )
            else setContent(
              <Slider isInPost>
                {postData.content.map(i => <div key={i} className={style.pic}><Media path={i}/></div> )}
              </Slider>
            )
        })
    })
  return (
    <div className={style.page}>
     <Navbar /> 
     <main>
        <PostExtended {...{content, post, timePosted}} />
        <div className={style.separator}></div>
     </main>
    </div>
  )
}
