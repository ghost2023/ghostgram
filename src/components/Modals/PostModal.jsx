import { DB } from 'fb-config';
import { get, query, ref as dbRef } from 'firebase/database';
import { useEffect, useState } from 'react';
import s from 'styles/Post.module.css';
import ButtonPanel from '../Post/ButtonPanel';
import Comment from '../Post/Comment';
import CommentForm from '../Post/CommentForm';
import Header from '../Post/Header';

export default function PostModal({ post, timePosted, content }) {
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
          <CommentForm postId={post.id}/>
        </div>
      </div>
  )
}