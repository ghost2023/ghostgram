import Heart from 'svgs/Heart'
import Spinner from 'svgs/Spinner'
import style from './NavBar.module.css'

export default function ActivityBtn({ isOpen, open }) {
    return (
      <div className={style['panel-btn']} onClick={open}>
        <Heart full={isOpen}/>
        {isOpen &&
          <div className={style["notification-container"]}>
            <div className={style.arrow}></div>
            <Spinner/>
          </div>
        }
      </div>
    )
  }