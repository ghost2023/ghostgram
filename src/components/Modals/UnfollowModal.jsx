import { useAuth } from 'context/userContext'
import { DB } from 'fb-config'
import { get, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import style from 'styles/Modal.module.css'
import Media from '../Media'
import Overlay from '../Overlay'

export default function UnfollowModal({ username, onUnfollow, closeModal }) {
  const { unFollow } = useAuth()
  const [profile, setProfile] = useState('')

  useEffect(() => {
    get(ref(DB, `users/${username}/profile`))
      .then(snapShot => {
        setProfile(snapShot.val())
      })
  }, [username])

  if(!profile) return null
  return (
    <Overlay onClick={closeModal}>
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <div className={style.profile}>
          <Link to={`/${username}`}>
            <Media path={`profiles/${profile}`}/>
          </Link>
        </div>
        
        <div className={style.username}>
            Leave {username}?
        </div>

        <div className={style.btns}>
          <button onClick={() => {unFollow(username);onUnfollow()}} className={`${style.warning} ${style.btn}`}>Unfollow</button>
          <button onClick={closeModal} className={style.btn}>Cancel</button>
        </div>
      </div>
    </Overlay>
  )
}
