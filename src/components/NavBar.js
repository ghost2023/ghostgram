import s from '../styles/NavBar.module.css'
import Search from './Search'
import NewPost from './NewPost'
import { Link, useNavigate } from 'react-router-dom'
import img from '../assets/logo.png'
import PP from '../assets/default_profile.png';
import { useEffect, useState } from 'react'
import { getAuth, signOut } from 'firebase/auth';
import { get, ref as dbRef } from 'firebase/database';
import { DB } from '../fb-config'

export default function NavBar({ page }) {
  let [isNewPostOpen, openNewPost ]= useState(false)

  const nav = useNavigate()
  const user = getAuth()
  const [pPic, setPPic] = useState(PP)
  const [profile, setProfile] = useState({})
  console.log(user)
  useEffect(() => {
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
          <HomeBtn page={page}/> 
          <DMBtn page={page}/> 
          <PostBtn open={() => openNewPost(true)}/> 
          <ExploreBtn page={page}/> 
          <ActivityBtn/> 
          <div className={s.account}>
            <div className={s.icon}>
              <img src={pPic} alt="" />
            </div>
            <div className={s.dropdown}>
              <Link to={'profile?.username'}>
                <div className={s.tab}>
                  <svg viewBox='0 0 24 24'>
                    <circle cx="12.004" cy="12.004" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></circle>
                    <path d="M18.793 20.014a6.08 6.08 0 00-1.778-2.447 3.991 3.991 0 00-2.386-.791H9.38a3.994 3.994 0 00-2.386.791 6.09 6.09 0 00-1.779 2.447" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></path>
                    <circle cx="12.006" cy="9.718" fill="none" r="4.109" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></circle>
                  </svg>
                  <div className={s.label}>
                    Profile
                  </div>
                </div>
              </Link>
              <Link to={'profile?.username' + '/saved'}>
                <div className={s.tab}>
                  <svg viewBox='0 0 24 24'>
                    <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
                  </svg>
                  <div className={s.label}>
                    Saved
                  </div>
                </div>
              </Link>
              <Link to={'profile?.username' + '/accounts/edit'}>
                <div className={s.tab}>
                  <svg viewBox='0 0 24 24'>
                    <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                    <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <div className={s.label}>
                    Settings
                  </div>
                </div>
              </Link>
              <div className={s.logout} onClick={() => signOut(user).then(() => nav('/login'))}>Log Out</div>
            </div>
          </div> 
        </div>
      </div>
      {isNewPostOpen?<NewPost closeNewPost={() => openNewPost(false)}/>:<></>}
    </div>
  )
}

function HomeBtn({ page }) {
  let svgPath = page == "Home"? <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z"></path> : <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
  
  return (
    <Link to='/' className={s['panel-btn']}>
      <svg>{svgPath}</svg>
    </Link>
  )
}

function DMBtn({ page }) {
  let svgPath = page == "DM"? <path d="M22.91 2.388a.69.69 0 00-.597-.347l-20.625.002a.687.687 0 00-.482 1.178L7.26 9.16a.686.686 0 00.778.128l7.612-3.657a.723.723 0 01.937.248.688.688 0 01-.225.932l-7.144 4.52a.69.69 0 00-.3.743l2.102 8.692a.687.687 0 00.566.518.655.655 0 00.103.008.686.686 0 00.59-.337L22.903 3.08a.688.688 0 00.007-.692" fill-rule="evenodd"></path> : <><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
  <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></>
  return (
    <Link to='/direct/inbox' className={s['panel-btn']}>
      <svg>
          {svgPath}
      </svg>
    </Link>
  )
}

function PostBtn({ open }) {
  return (
    <div className={s['panel-btn']} onClick={open}>
    <svg>
      <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
      <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
      <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
      </svg>
    </div>
  )
}

function ExploreBtn({page}) {
  let svgPath = page == 'Explore'? <path d="M13.173 13.164l1.491-3.829-3.83 1.49zM12.001.5a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012.001.5zm5.35 7.443l-2.478 6.369a1 1 0 01-.57.569l-6.36 2.47a1 1 0 01-1.294-1.294l2.48-6.369a1 1 0 01.57-.569l6.359-2.47a1 1 0 011.294 1.294z"></path> : <><polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
  <polygon fill-rule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon>
  <circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle></>
  
  return (
    <Link to='/explore' className={s['panel-btn']}>      
      <svg >
        {svgPath}
      </svg>
    </Link>
  )
}

function ActivityBtn() {
  return (
    <div className={s['panel-btn']}>

    <svg>
      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
    </svg>
    </div>
  )
}