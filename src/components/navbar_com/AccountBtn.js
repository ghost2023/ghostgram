import s from '../../styles/NavBar.module.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useAuth } from '../../userContext'
import Profile from '../svgs/Profile'
import Gear from '../svgs/Gear'
import Mark from '../svgs/Mark'

export default function AccountBtn({ isDBOpen, openDB }) {
  const { user, logOut, getProfileURL } = useAuth()
  const [profile, setProfile] = useState('')

  useEffect(() => {
    getProfileURL().then(url => setProfile(url)).catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div className={s.account + (isDBOpen ? ' ' + s.foc: '')}>
            <div className={s.icon} onClick={openDB}>
              <img src={profile} alt="" />
            </div>
            <div className={s.dropdown}>
              <Link to={"/" + user?.username}>
                <div className={s.tab}>
                  <Profile isSmall />
                  <div className={s.label}>
                    Profile
                  </div>
                </div>
              </Link>
              <Link to={`/${user?.username}/saved`}>
                <div className={s.tab}>
                  <Mark isSmall />
                  <div className={s.label}>
                    Saved
                  </div>
                </div>
              </Link>
              <Link to={`/${user?.username}/accounts/edit`}>
                <div className={s.tab}>
                  <Gear isSmall />
                  <div className={s.label}>
                    Settings
                  </div>
                </div>
              </Link>
              <div className={s.logout} onClick={logOut}>Log Out</div>
            </div>
    </div>
  )
}
