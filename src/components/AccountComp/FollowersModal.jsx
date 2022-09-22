import s from '../../styles/Modal.module.css'
import MiniProfile from '../MiniProfile'
import Overlay from '../Overlay'
import Cross from '../svgs/Cross'

export default function FollowersModal({ closeModal, followers = [] }) {

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
          {followers.map(un => <MiniProfile key={un} username={un}/>)}
        </div>
      </div>
    </Overlay>
  )
}
