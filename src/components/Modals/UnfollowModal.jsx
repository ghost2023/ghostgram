import useAuth from 'hooks/useAuth'
import { Link } from 'react-router-dom'
import style from 'styles/Modal.module.css'
import Overlay from '../Overlay'

export default function UnfollowModal({ uid, username, profileUrl, onUnfollow, closeModal }) {
  const { unFollow } = useAuth()

  const unFollowHandler = () => {
    unFollow(uid);
    onUnfollow();
  }

  if(!username || !uid || !profileUrl ) return null
  return (
    <Overlay onClick={closeModal}>
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <div className={style.profile}>
          <Link to={`/${username}`}>
            <img src={profileUrl} alt="" />
          </Link>
        </div>
        <div className={style.username}>
            Leave {username}?
        </div>
        <div className={style.btns}>
          <button onClick={unFollowHandler} className={`${style.warning} ${style.btn}`}>Unfollow</button>
          <button onClick={closeModal} className={style.btn}>Cancel</button>
        </div>
      </div>
    </Overlay>
  )
}
