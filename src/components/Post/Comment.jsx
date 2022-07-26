
import AccountLink from 'components/AccountLink';
import Media from 'components/Media';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from 'styles/Post.module.css';
import { formatCommentTime } from 'utils/formatTime';
import { getUserByUid } from 'utils/services';

export default function Comment({ comment }) {
  const [user, setUser] = useState()

  useEffect(() => {
    if(!comment) return
    getUserByUid(comment.user)
    .then(data => setUser(data))
  }, [comment])

  if(!user) return null
  return (
    <div className={style.comment}>
      <div className={style.userpic}>  
        <Link to={`/${user.username}`}>
          <Media path={`profiles/${user.profile}`}/>
        </Link>
      </div>
      <div className={style.commentbody}>
        <div className={style["comment-content"]}>
          <span>
            <AccountLink username={user.username}/> 
          </span>
          <p>{comment.content}</p>
        </div>
        <time className={style.commenttime}>
          {formatCommentTime(comment.timeStamp)}
        </time>
      </div>
    </div>
  )
}
