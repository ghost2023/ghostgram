import { get, query, ref as dbRef } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DB } from '../fb-config';
import s from '../styles/Post.module.css';
import AccountLink from './AccountLink';
import Media from './Media';
import Overlay from './Overlay';
import ButtonPanel from './post_com/ButtonPanel';
import CommentInput from './post_com/CommentInput';
import Header from './post_com/Header';
import Slider from './Slider';

export default function PostExtended({ post, setOpen, timePosted }) {
  const [comments, setComments] = useState([])

  useEffect(() => {
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
          {post.content.length === 1 ? 
          <div className={s.pic}>{<Media path={post.content[0]}/>}</div>
          :
          <Slider isInPost>
            {post.content.map(i => <div key={i} className={s.pic}><Media path={i}/></div> )}
          </Slider>
          }
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

function Comment({ comment }) {
  return (
    <div className={s.comment}>
      <div className={s.userpic}>  
        <Link to={`/${comment.username}`}>
          <Media path={`profiles/${comment.userProfile}`}/>
        </Link>
      </div>
      <div className={s["comment-content"]}>
        <span>
          <AccountLink username={comment.username}/> 
        </span>
          {comment.content}
      </div>
    </div>
  )
}
