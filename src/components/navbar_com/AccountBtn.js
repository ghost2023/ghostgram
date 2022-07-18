import s from '../../styles/NavBar.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import PP from '../../assets/default_profile.png';
import { useState } from 'react';

export default function AccountBtn({ user, profile, isDBOpen, openDB }) {
    const nav = useNavigate()
    const [pPic, setPPic] = useState(PP)


  return (
    <div className={s.account + (isDBOpen ? ' ' + s.foc: '')}>
            <div className={s.icon} onClick={openDB}>
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
  )
}
