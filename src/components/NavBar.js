import s from '../styles/NavBar.module.css'
import Search from './Search'
import NewPost from './NewPost'
import { Link } from 'react-router-dom'
import img from '../assets/logo.png'
import { useState } from 'react'
import AccountBtn from './navbar_com/AccountBtn'
import House from './svgs/House'
import Kite from './svgs/Kite'
import Compass from './svgs/Compass'
import ActivityBtn from './navbar_com/ActivityBtn'
import Add from './svgs/Add'

export default function NavBar({ page }) {
  
  const [isNewPostOpen, openNewPost ]= useState(false)
  const [isFDOpen, setFDOpen] = useState(false)
  const [isDBOpen, setDBOpen] = useState(false)

  return (
    <div className={s.navbar}>
      <div className={s.container}>
        <div className={s.brand}>
          <Link to='/'>
            <img src={img} alt="" />
          </Link>
        </div>
        <div className={s.search}>
          <Search/> 
        </div>
        <div className={s.panel}>
          <Link to='/' className={s['panel-btn']}>
            <House full={page == 'home'}/>
          </Link>
          <Link to='/direct/inbox' className={s['panel-btn']}>
            <Kite full={page == 'home'}/>
          </Link>
          <div className={s['panel-btn']} onClick={() => openNewPost(true)}>
            <Add full={isNewPostOpen}/>
          </div>
          <Link to='/explore' className={s['panel-btn']}>      
            <Compass full={page == 'explore'} />
          </Link>
          <ActivityBtn isOpen={isFDOpen} open={() => setFDOpen(true)}/> 
          <AccountBtn isDBOpen={isDBOpen} openDB={() => setDBOpen(true)} />
        </div>
      </div>
      <div className={s.hider + (isDBOpen || isFDOpen ? ` ${s.open}` : '' )} onClick={() => {setFDOpen(false);setDBOpen(false)}}></div>
      {isNewPostOpen? <NewPost closeNewPost={() => openNewPost(false)} />:<></>}
    </div>
  )
}
