import useAuth from 'hooks/useAuth'
import { Link } from 'react-router-dom'
import Gear from 'svgs/Gear'
import Mark from 'svgs/Mark'
import Profile from 'svgs/Profile'
import { logOut } from 'utils/services'
import style from './NavBar.module.css'

export default function AccountBtn({ isDBOpen, openDB }) {
  const { user: { username }, profileUrl } = useAuth()

  return (
    <div className={style.account} open={isDBOpen}>
      <div className={style.icon} onClick={openDB}>
        <img src={profileUrl} alt="" />
      </div>
      {isDBOpen &&
        <div className={style.dropdown}>
          <div className={style.arrow}></div>
          <Link to={"/" + username}>
            <div className={style.tab}>
              <Profile isSmall />
              <div className={style.label}>
                Profile
              </div>
            </div>
          </Link>
          <Link to={`/${username}/saved`}>
            <div className={style.tab}>
              <Mark isSmall />
              <div className={style.label}>
                Saved
              </div>
            </div>
          </Link>
          <Link to={`/accounts/edit`}>
            <div className={style.tab}>
              <Gear isSmall />
              <div className={style.label}>
                Settings
              </div>
            </div>
          </Link>
          <div className={style.logout} onClick={logOut}>Log Out</div>
        </div>
      }
    </div>
  )
}
