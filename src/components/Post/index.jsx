import AccountLink from 'components/AccountLink';
import Media from 'components/Media';
import PostModal from 'components/Modals/PostModal';
import Slider from 'components/Slider';
import { DB } from 'fb-config';
import { equalTo, get, orderByChild, query, ref as dbRef } from 'firebase/database';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import { useEffect, useState } from 'react';
import s from 'styles/Post.module.css';
import { formatPostTime } from 'utils/formatTime';
import ButtonPanel from './ButtonPanel';
import CommentForm from './CommentForm';
import Header from './Header';

export default function Post({post}) {
  const { user:{username, uid} } = useAuth()
  const [comments, setComments] = useState(0)
  const [timePosted, setTimePosted] = useState('')
  const [userComments, setUserComments] = useState([])
  const [content, setContent] = useState(<></>)
  const [commentModal, openCommentModal] = useModal(PostModal, {post, timePosted, content})
  const updateComments = (comment) => setUserComments(p => [ ...p, comment ])

  useEffect(() => {
    setTimePosted(formatPostTime(post.timeStamp))

    if(post.content.length === 1) setContent(
      <div className={s.pic}>{<Media path={post.content[0]}/>}</div>
    )
    else setContent(
      <Slider isInPost>
        {post.content.map(i => <div key={i} className={s.pic}><Media path={i}/></div> )}
      </Slider>
    )

    if(post.noComment) return
    // get number of comments
    get(dbRef(DB, `comments/${post.id}/count`))
      .then(d => {if(!!d.val()) setComments(d.val())})
    
    // get current users comments
    get(query(
      dbRef(DB, `comments/${post.id}`), 
      orderByChild('userId'), 
      equalTo(uid)
    )).then((d) => {
        if(!d.val()) return;
        setUserComments(
          Object.values(d.val()).map(i => i.content)
        )
      })
    
  },[post, uid])

  return (
    <article className={s.post}>
      <Header postId={post.id} userProfile={post.userProfile} username={post.username}/>
      <div className={s.content}>{content}</div>

      <ButtonPanel {...{post, openCommentModal} }/>

      {!post.caption.length ||
        <section className={s.caption}><span>{post.username}</span> {post.caption}</section>}
      {(post.noComment || !comments) ||
        <div className={s.viewcomment} onClick={openCommentModal}>View all {comments} comments</div>
      }
      {!userComments.length ||
        <div className={s['comments-prev']}>
          {userComments.map((val, i) => {
            return <div key={i}><AccountLink {...{username}}/> {val}</div>
          })}
        </div>
      }
      <div className={s.timestamp}>{timePosted}</div>
      <CommentForm postId={post.id} {...{updateComments}}/>
      {commentModal}
    </article>
  )
}
