import Overlay from 'components/Overlay';
import style from 'styles/Modal.module.css';

export default function DiscardModal({ closeModal, onClick }) {
  return (
    <Overlay onClick={closeModal}>
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <div className={style["header"]}>
          <h1>Discard post?</h1>
          <p>If you leave, your edits won't be saved.</p>
        </div>
        <div className={style.btns}>
          <button className={`${style.btn} ${style.warning}`} onClick={e => {onClick(); closeModal()}}>
            Discard
          </button>
          <button className={style.btn} onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </Overlay>
  )
}
