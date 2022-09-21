import { get, ref } from 'firebase/database'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DB } from '../../fb-config'
import s from '../../styles/Account.module.css'
import { useAuth } from '../../userContext'
import AccountLink from '../AccountLink'
import Media from '../Media'

export default function MiniProfile({ username }) {
    const { user, follows } = useAuth()
    const [userProfile, setUser] = useState()

    useState(() => {
        get(ref(DB, `users/${username}/`)).then(snapShot => {
            setUser(snapShot.val())
        })
    }, [username])

    if(!userProfile) return <></>
  return (
    <div className={s.account}>
        <Link to={`/${username}`}>
            <div className={s.icon}>
                <Media path={`profiles/${userProfile.profile || ''}`}/>
            </div>
        </Link>
        <div className={s["account-name"]}>
            <AccountLink {...{username}} />
            <span>
                {userProfile?.name}
            </span>
        </div>
        <button>Follow</button>
    </div>
  )
}
