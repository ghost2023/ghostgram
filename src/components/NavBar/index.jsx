import img from 'assets/logo.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Add from 'svgs/Add'
import Compass from 'svgs/Compass'
import House from 'svgs/House'
import Kite from 'svgs/Kite'
import NewPostModal from '../NewPostModal'
import AccountBtn from './AccountBtn'
import ActivityBtn from './ActivityBtn'
import style from './NavBar.module.css'
import Search from './Search'

export default function NavBar({ page }) {
  const [isNewPostOpen, openNewPost] = useState(false)
  const [isFDOpen, setFDOpen] = useState(false)
  const [isDBOpen, setDBOpen] = useState(false)

  return (
    <div className={style.navbar}>
      <div className={style.container}>
        <div className={style.brand}>
          <Link to='/'>
            <img src={img} alt="" />
          </Link>
        </div>
        <div className={style.search}>
          <Search />
        </div>
        <div className={style.panel}>
          <Link to='/' className={style['panel-btn']}>
            <House full={page === 'home'} />
          </Link>
          <Link to='/direct/inbox' className={style['panel-btn']}>
            <Kite full={page === 'home'} />
          </Link>
          <div className={style['panel-btn']} onClick={() => openNewPost(true)}>
            <Add full={isNewPostOpen} />
          </div>
          <Link to='/explore' className={style['panel-btn']}>
            <Compass full={page === 'explore'} />
          </Link>
          <ActivityBtn isOpen={isFDOpen} open={() => setFDOpen(true)} />
          <AccountBtn isDBOpen={isDBOpen} openDB={() => setDBOpen(true)} />
        </div>
      </div>
      <div className={style.hider + (isDBOpen || isFDOpen ? ` ${style.open}` : '')} onClick={() => { setFDOpen(false); setDBOpen(false) }}></div>
      {isNewPostOpen ? <NewPostModal closeNewPost={() => openNewPost(false)} /> : <></>}
    </div>
  )
}
