import MiniProfile from 'components/MiniProfile/'
import Overlay from 'components/Overlay'
import { DB } from 'fb-config'
import { get, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import s from 'styles/Modal.module.css'
import Cross from 'svgs/Cross'
import { getUserByUid } from 'utils/services'

export default function LikesModal({ PostId, closeModal }) {
    const [likes, setLikes] = useState([])

    useEffect(() => {
      get(ref(DB, `likes/${PostId}/`))
      .then(async snapShot => {
        if(!snapShot.val()) return
        if(!snapShot.val().count) return
        const snapShotData = snapShot.val()
        delete snapShotData.count
        const usersIds = Object.keys(snapShotData)
        const usersArr = []
        for(let uid of usersIds){
          usersArr.append(await getUserByUid(uid))
        }

        setLikes(usersArr)
      })
    }, [PostId])

  return (
    <Overlay onClick={closeModal}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s['modal-header']}>
          <h1>Likes</h1>
          <button className={s['close-btn']} onClick={closeModal}>
            <Cross small/>
          </button>
        </div>
        <div className={s['modal-body']}>
          {likes.map(userData => <MiniProfile key={userData.username} {...{userData}} username={userData.username}/>)}
        </div>
      </div>
    </Overlay>
  )
}
