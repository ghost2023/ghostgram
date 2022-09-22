import { get, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { DB } from '../../fb-config'
import s from '../../styles/Modal.module.css'
import MiniProfile from '../MiniProfile'
import Overlay from '../Overlay'
import Cross from '../svgs/Cross'

export default function LikesModal({ PostId, closeModal }) {
    const [likes, setLikes] = useState([])

    useEffect(() => {
      get(ref(DB, `likes/${PostId}/`)).then(snapShot => {
        if(!snapShot.val()) return
        const snapShotData = snapShot.val()
        delete snapShotData.count
        console.log(snapShotData)
        const likesArr = Object.values(snapShotData)
        setLikes(likesArr)
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
