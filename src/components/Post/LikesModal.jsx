import MiniProfile from 'components/MiniProfile/'
import Overlay from 'components/Overlay'
import { useEffect, useState } from 'react'
import style from 'styles/Modal.module.css'
import Cross from 'svgs/Cross'
import { getLikes, getUserWithProfileUrl } from 'utils/services'

export default function LikesModal({ postId, closeModal }) {
    const [likes, setLikes] = useState([])

    useEffect(() => {
      getLikes(postId)
      .then(async snap => {
        if(!snap.length) return
        const usersArr = []
        for(let uid of snap){
          usersArr.push(await getUserWithProfileUrl(uid))
        }
        setLikes(usersArr)
      })
    }, [postId])

  return (
    <Overlay onClick={closeModal}>
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <div className={style['modal-header']}>
          <h1>Likes</h1>
          <button className={style['close-btn']} onClick={closeModal}>
            <Cross small/>
          </button>
        </div>
        <div className={style['modal-body']}>
          {likes.map(user => <MiniProfile key={user.uid} {...user}/>)}
        </div>
      </div>
    </Overlay>
  )
}
