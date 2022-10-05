import MiniProfile from 'components/MiniProfile/'
import Overlay from 'components/Overlay'
import { useEffect, useState } from 'react'
import s from 'styles/Modal.module.css'
import Cross from 'svgs/Cross'
import { getUserByUid, getUserProfile } from 'utils/services'

export default function FollowersModal({ closeModal, followers = [] }) {
  const [followersData, setFollowersData] = useState([])

  useEffect(() => {
    (async () => {
      const usersArr = []
      for(const uid of followers){
        const { username, profile } = await getUserByUid(uid)
        const profileUrl = await getUserProfile(profile)
        usersArr.push({uid, username, profileUrl})
      }
      setFollowersData(usersArr)
    })()
  }, [followers])

  return (
    <Overlay onClick={closeModal}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s['modal-header']}>
          <h1>Followers</h1>
          <button className={s['close-btn']} onClick={closeModal}>
            <Cross small/>
          </button>
        </div>
        <div className={s['modal-body']}>
          {followersData.map(user => <MiniProfile key={user.uid} {...user}/>)}
        </div>
      </div>
    </Overlay>
  )
}
