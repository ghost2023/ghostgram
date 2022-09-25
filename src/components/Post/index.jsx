import AccountLink from 'components/AccountLink';
import Media from 'components/Media';
import PostModal from 'components/Modals/PostModal';
import Overlay from 'components/Overlay';
import Slider from 'components/Slider';
import { useAuth } from 'context/userContext';
import { DB } from 'fb-config';
import { equalTo, get, orderByChild, query, ref as dbRef } from 'firebase/database';
import { useEffect, useState } from 'react';
import s from 'styles/Post.module.css';
import { formatPostTime } from 'utils/formatTime';
import ButtonPanel from './ButtonPanel';
import CommentForm from './CommentForm';
import Header from './Header';

export default function Post({post}) {
  const { user } = useAuth()
  const [comments, setComments] = useState(0)
  const [timePosted, setTimePosted] = useState('')
  const [userComments, setUserComments] = useState([])
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [content, setContent] = useState(<></>)

  useEffect(() => {
    
    setTimePosted(formatPostTime(post.timeStamp))

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

    if(post.content.length === 1) setContent(
        <div className={s.pic}>{<Media path={post.content[0]}/>}</div>
      )
    else setContent(
      <Slider isInPost>
        {post.content.map(i => <div key={i} className={s.pic}><Media path={i}/></div> )}
      </Slider>
    )
  },[])

  const updateComments = (comment) => setUserComments(p => [ ...p, comment ])

  return (
    <article className={s.post}>
      <Header postId={post.id} userProfile={post.userProfile} username={post.username}/>
      <div className={s.content}>
        {content}
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
      <CommentForm postId={post.id} {...{updateComments}}/>
      {!commentsOpen || 
      <Overlay onClick={() => setCommentsOpen(true)}>

        <PostModal {...{post, timePosted, content}}/>
      </Overlay>}
    </article>
  )
}
