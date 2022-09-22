import { equalTo, get, orderByChild, query, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { DB } from '../../fb-config'
import s from '../../styles/FollowModal.module.css'
import Overlay from '../Overlay'
import Cross from '../svgs/Cross'
import MiniProfile from './MiniProfile'

export default function FollowingModal({ username, closeModal }) {
  const [following, setFollowing] = useState([])

  useEffect(() => {
    get(query(
      ref(DB, 'follows/'), 
      orderByChild('follower'), 
      equalTo(username)
    )).then(snapShot => {
      if(!snapShot.val()) return
      const followingArr = Object.values(snapShot.val()).map(item => item.followe)
      setFollowing(followingArr)
    })
  }, [username])

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
          {following.map(un => <MiniProfile key={un} username={un}/>)}
        </div>
      </div>
    </Overlay>
  )
}
