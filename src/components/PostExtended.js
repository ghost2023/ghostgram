import { get, query, ref as dbRef } from 'firebase/database';
import { useEffect, useState } from 'react';
import { DB } from '../fb-config';
import s from '../styles/Post.module.css';
import Overlay from './Overlay';
import ButtonPanel from './post_com/ButtonPanel';
import Comment from './post_com/Comment';
import CommentInput from './post_com/CommentInput';
import Header from './post_com/Header';

export default function PostExtended({ post, setOpen, timePosted, content }) {
  const [comments, setComments] = useState([])

  useEffect(() => {
    if(post.noComment) return
    get(query(dbRef(DB, 'comments/'+ post.id)))
    .then(d => {
      const commentsArr = Object.values(d.val()) 
      setComments(commentsArr.filter(item => item.content))
    })
  }, [])
  
  return (
    <Overlay onClick={() => setOpen(false)}>
      <div className={s['post-extended']} onClick={e => e.stopPropagation()}>
        <div className={s.content}>
          {content}
        </div>
        <div className={s.side}>  
          <Header userProfile={post.userProfile} username={post.username}/>
          <div className={s.commentsection}>
            {comments.map((comment, i) => <Comment {...{comment}} key={i}/>)}
          </div>
          <ButtonPanel {...{post}}/>
          <div className={s.timestamp}>{timePosted}</div>
          <CommentInput postId={post.id}/>
        </div>
      </div>
    </Overlay>
  )
}