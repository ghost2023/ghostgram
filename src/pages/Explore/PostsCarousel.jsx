import PostModal from 'components/Modals/PostModal'
import { useEffect, useState } from 'react'
import Chevron from 'svgs/Chevron'
import Cross from 'svgs/Cross'
import { formatPostTime } from 'utils/formatTime'
import style from './explore.module.css'

export default function PostsCarousel({ closeCarousel, index, setIndex, posts }) {
    const prevBtn = <button onClick={() => setIndex(index - 1)} className={style.prevbtn}><Chevron dxn="l"/></button>
    const nextBtn = <button onClick={() => setIndex(index + 1)} className={style.nextbtn}><Chevron dxn="r"/></button>
    const [timePosted, setTimePosted] = useState("")
    const post = posts[index]
    console.log(post, index)

    useEffect(() => {
        if(index === -1) return
        setTimePosted(formatPostTime(post.timeStamp))
    }, [index, posts])

    if(index === -1) return null

  return ( 
    <div className={style.carousel} onClick={closeCarousel}>
      <div onClick={e => e.stopPropagation()}>
        <div className="">
            <PostModal {...{post, timePosted}}/>
        </div>
        {index > 0? <>{prevBtn}</>: null}
        {index < posts.length - 1? <>{nextBtn}</>: null}
      </div>
      <button className={style.closebtn}><Cross small/></button>
    </div>
  )
}
