import Heart from 'svgs/Heart'
import s from './NavBar.module.css'

export default function ActivityBtn({ isOpen, open }) {
    return (
      <div className={s['panel-btn'] + ' ' + s.activity + (isOpen ? ` ${s.foc}`: '')}>
        <Heart full={isOpen}/>
        <div className={s.dropdown}></div>
      </div>
    )
  }