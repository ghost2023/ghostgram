
import { Link } from 'react-router-dom';
import s from '../../styles/Post.module.css';
import AccountLink from '../AccountLink';
import Media from '../Media';

export default function Comment({ comment }) {
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
