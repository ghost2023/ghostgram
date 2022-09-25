
import AccountLink from 'components/AccountLink';
import Media from 'components/Media';
import { Link } from 'react-router-dom';
import style from 'styles/Post.module.css';

export default function Comment({ comment }) {
  return (
    <div className={style.comment}>
      <div className={style.userpic}>  
        <Link to={`/${comment.username}`}>
          <Media path={`profiles/${comment.userProfile}`}/>
        </Link>
      </div>
      <div className={style["comment-content"]}>
        <span>
          <AccountLink username={comment.username}/> 
        </span>
          {comment.content}
      </div>
    </div>
  )
}
