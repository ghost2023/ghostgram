import s from '../../styles/NavBar.module.css'
import Heart from '../svgs/Heart'

export default function ActivityBtn({ isOpen, open }) {
    return (
      <div className={s['panel-btn'] + ' ' + s.activity + (isOpen ? ` ${s.foc}`: '')}>
        <Heart full={isOpen}/>
        <div className={s.dropdown}></div>
      </div>
    )
  }