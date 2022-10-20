import Slider from 'components/Slider';
import { useEffect, useState } from 'react';
import s from 'styles/Post.module.css';
import { getComments, getPostContents, getUserByUid } from 'utils/services';
import ButtonPanel from '../Post/ButtonPanel';
import Comment from '../Post/Comment';
import CommentForm from '../Post/CommentForm';
import Header from '../Post/Header';

export default function PostModal({ post, content, user, timePosted = "" }) {
  const [comments, setComments] = useState([])
  const [contents, setContent] = useState(content)
  const [postUser, setPostUser] = useState(user)

  useEffect(() => {
    if(!content) getPostContents(post.content).then(setContent)
    if(!user) getUserByUid(post.user).then(setPostUser)

    if(post.noComment) return
    getComments(post.id).then(setComments)
  }, [post, content, user])
  
  if(!contents || !postUser) return null
  return (
    <div className={s['post-extended']} onClick={e => e.stopPropagation()}>
      <div className={s.content}>
        <Slider>
          {contents.map(src => <div key={src} className={s.pic}><img {...{src}} alt=""/></div> )}
        </Slider>
      </div>
      <div className={s.side}>  
        <Header {...{user:postUser, postId: post.id}}/>
        <div className={s.commentsection}>
          {comments.map((comment, i) => <Comment {...{comment}} key={i}/>)}
        </div>
        <ButtonPanel {...{post}}/>
        <div className={s.timestamp}>{timePosted}</div>
        <CommentForm postId={post.id}/>
      </div>
    </div>
  )
}