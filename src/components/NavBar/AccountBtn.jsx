import { useAuth } from 'context/userContext'
import { Link } from 'react-router-dom'
import Gear from 'svgs/Gear'
import Mark from 'svgs/Mark'
import Profile from 'svgs/Profile'
import style from './NavBar.module.css'

export default function AccountBtn({ isDBOpen, openDB }) {
  const { user, logOut, profileUrl } = useAuth()

  return (
    <div className={style.account + (isDBOpen ? ' ' + style.foc: '')}>
            <div className={style.icon} onClick={openDB}>
              <img src={profileUrl} alt="" />
            </div>
            <div className={style.dropdown}>
              <Link to={"/" + user?.username}>
                <div className={style.tab}>
                  <Profile isSmall />
                  <div className={style.label}>
                    Profile
                  </div>
                </div>
              </Link>
              <Link to={`/${user?.username}/saved`}>
                <div className={style.tab}>
                  <Mark isSmall />
                  <div className={style.label}>
                    Saved
                  </div>
                </div>
              </Link>
              <Link to={`/${user?.username}/accounts/edit`}>
                <div className={style.tab}>
                  <Gear isSmall />
                  <div className={style.label}>
                    Settings
                  </div>
                </div>
              </Link>
              <div className={style.logout} onClick={logOut}>Log Out</div>
            </div>
    </div>
  )
}
