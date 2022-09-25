import MiniProfile from 'components/MiniProfile/'
import Overlay from 'components/Overlay'
import { DB } from 'fb-config'
import { equalTo, get, orderByChild, query, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import s from 'styles/Modal.module.css'
import Cross from 'svgs/Cross'

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
