import { equalTo, get, orderByChild, query, ref as dbRef } from 'firebase/database';
import { useEffect, useState } from 'react';
import { DB } from '../fb-config';
import s from '../styles/Post.module.css';
import { useAuth } from '../userContext';
import { convertTime } from '../utils';
import AccountLink from './AccountLink';
import Media from './Media';
import PostExtended from './PostExtended';
import ButtonPanel from './post_com/ButtonPanel';
import CommentInput from './post_com/CommentInput';
import Header from './post_com/Header';
import Slider from './Slider';

export default function Post({post}) {
  const { user } = useAuth()
  const [comments, setComments] = useState(0)
  const [timePosted, setTimePosted] = useState('')
  const [userComments, setUserComments] = useState([])
  const [commentsOpen, setCommentsOpen] = useState(false)

  useEffect(() => {
    
    setTimePosted(convertTime(post.timeStamp))

    if(!post.noComment){
      // get number of comments
      get(dbRef(DB, `comments/${post.id}/count`))
        .then(d => {if(!!d.val()) setComments(d.val())})
      
      // get current users comments
      get(query(
        dbRef(DB, `comments/${post.id}`), 
        orderByChild('userId'), 
        equalTo(user.uid)
      ))
        .then((d) => {
          if(!d.val()) return;
          setUserComments(
            Object.values(d.val()).map(i => i.content)
          )
        })
    }
  },[])

  const updateComments = (comment) => setUserComments(p => [ ...p, comment ])

  return (
    <article className={s.post}>
      <Header userProfile={post.userProfile} username={post.username}/>
      <div className={s.content}>
        {post.content.length === 1 ? 
        <div className={s.pic}>{<Media path={post.content[0]}/>}</div>
        :
        <Slider isInPost>
          {post.content.map(i => <div key={i} className={s.pic}><Media path={i}/></div> )}
        </Slider>
        }
      </div>

      <ButtonPanel post={post} viewComments={() => setCommentsOpen(true)}/>

      {!post.caption.length ||
        <section className={s.caption}><span>{post.username}</span> {post.caption}</section>}
      {(post.noComment || !comments) ||
        <div className={s.viewcomment}>View all {} comments</div>
      }
      {!userComments.length ||
        <div className={s['comments-prev']}>
          {userComments.map((val, i) => {
            return <div key={i}><AccountLink username={user.username}/> {val}</div>
          })}
        </div>
      }
      <div className={s.timestamp}>{timePosted}</div>
      <CommentInput postId={post.id} {...{updateComments}}/>
      {!commentsOpen || 
      <PostExtended {...{post}} {...{timePosted}} setOpen={setCommentsOpen}/>}
    </article>
  )
}
