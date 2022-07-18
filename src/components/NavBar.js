import s from '../styles/NavBar.module.css'
import Search from './Search'
import NewPost from './NewPost'
import { Link, useNavigate } from 'react-router-dom'
import img from '../assets/logo.png'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth';
import { get, ref as dbRef } from 'firebase/database';
import { DB } from '../fb-config'
import AccountBtn from './navbar_com/AccountBtn'
import HomeBtn from './navbar_com/HomeBtn'
import DMBtn from './navbar_com/DMBtn'
import ExploreBtn from './navbar_com/ExploreBtn'
import ActivityBtn from './navbar_com/ActivityBtn'
import PostBtn from './navbar_com/PostBtn'

export default function NavBar({ page }) {
  
  const [isNewPostOpen, openNewPost ]= useState(false)
  const nav = useNavigate()
  const user = getAuth()
  const [profile, setProfile] = useState({})
  const [isFDOpen, setFDOpen] = useState(false)
  const [isDBOpen, setDBOpen] = useState(false)
  
  useEffect(() => {
    console.log(user)
    if(!user.currentUser) nav('/login')
    get(dbRef(DB, 'users/' + user.uid)).then(dat => {
      const data = dat.val()
      setProfile(data)
      if(data?.pic) {}
    })
  },[])

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
          <HomeBtn page={page} isOpen={isDBOpen || isFDOpen}/> 
          <DMBtn page={page}/> 
          <PostBtn open={() => openNewPost(true)} isOpen = {isNewPostOpen}/> 
          <ExploreBtn page={page}/> 
          <ActivityBtn isOpen={isFDOpen} open={() => setFDOpen(true)}/> 
          <AccountBtn isDBOpen={isDBOpen} openDB={() => setDBOpen(true)} user={user} profile={profile} />
        </div>
      </div>
      <div className={s.hider + (isDBOpen || isFDOpen ? ` ${s.open}` : '' )} onClick={() => {setFDOpen(false);setDBOpen(false)}}></div>
      {isNewPostOpen? <NewPost closeNewPost={() => openNewPost(false)}/>:<></>}
    </div>
  )
}
