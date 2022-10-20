import AccountLink from 'components/AccountLink';
import PostModal from 'components/Modals/PostModal';
import Overlay from 'components/Overlay';
import Slider from 'components/Slider';
import { db } from 'fb-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import s from 'styles/Post.module.css';
import { formatPostTime } from 'utils/formatTime';
import { getComments, getPostContents, getUserByUid } from 'utils/services';
import ButtonPanel from './ButtonPanel';
import CommentForm from './CommentForm';
import Header from './Header';

export default function Post({ post }) {
  const { user:{username, uid} } = useAuth()
  const [postUser, setPostUser] = useState()
  const [comments, setComments] = useState(0)
  const [timePosted, setTimePosted] = useState('')
  const [userComments, setUserComments] = useState([])
  const [content, setContent] = useState([])
  const [commentModal, setCommentModal] = useState(false)
  const updateComments = (comment) => setUserComments(p => [ ...p, comment ])

  useEffect(() => {
    setTimePosted(formatPostTime(post.timeStamp))
    getUserByUid(post.user).then(setPostUser)
    getPostContents(post.content).then(setContent)

    if(post.noComment) return
    // get number of comments'
    getComments(post.id).then(data => setComments(data.length))
    
    // get current users comments
    getDocs(query(
      collection(db, 'posts', post.id, 'comments'),
      where('user', '==', uid)
    )).then(com => {
        setUserComments(
          com.docs.map(i => i.data().content)
        )
      })
    
  },[post, uid])

  const openModal = () => setCommentModal(true)
  const closeModal = () => setCommentModal(false)

  if(!content.length || !postUser) return null
  return (
    <article className={s.post}>
      <Header postId={post.id} user={postUser}/>

      <div className={s.content}>
        <Slider isInPost>
          {content.map(src => <div key={src} className={s.pic}><img {...{src}} alt=""/></div> )}
        </Slider>  
      </div>

      <ButtonPanel {...{post, openModal} }/>

      {!post.caption.length ||
        <section className={s.caption}><span>{postUser.username}</span> {post.caption}</section>}
        
      {(post.noComment || !comments) ||
        <div className={s.viewcomment} onClick={openModal}>View all {comments} comments</div>
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

      {commentModal && 
        <Overlay onClick={closeModal}>
          <PostModal {...{content, post, timePosted, user: postUser}}/>
        </Overlay>
      }
      
    </article>
  )
}
