import MiniProfile from 'components/MiniProfile/'
import Overlay from 'components/Overlay'
import { useEffect, useState } from 'react'
import s from 'styles/Modal.module.css'
import Cross from 'svgs/Cross'
import { getFollowing } from 'utils/services'

export default function FollowingModal({ uid, closeModal }) {
  const [following, setFollowing] = useState([])

  useEffect(() => {
    getFollowing(uid)
    .then(users => {
      if(!users.length) return
      const followingArr = Object.values(users).map(item => item.user)
      setFollowing(followingArr)
    })
  }, [uid])

  return (
    <Overlay onClick={closeModal}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s['modal-header']}>
          <h1>Following</h1>
          <button className={s['close-btn']} onClick={closeModal}>
            <Cross small/>
          </button>
        </div>
        <div className={s['modal-body']}>
          {following.map(uid => <MiniProfile key={uid} {...{uid}}/>)}
        </div>
      </div>
    </Overlay>
  )
}
