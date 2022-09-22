import { get, ref } from 'firebase/database'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DB } from '../fb-config'
import s from '../styles/MiniProfile.module.css'
import { useAuth } from '../userContext'
import AccountLink from './AccountLink'
import Media from './Media'
import UnfollowModal from './UnfollowModal'

export default function MiniProfile({ username }) {
    const { follows, follow, user } = useAuth()
    const [userProfile, setProfile] = useState()
    const [modal, setModal] = useState(false)
    const [isFollow, setFollow] = useState(false)

    useState(() => {
        if(!username) return
        if(username === user.userProfile){
            setProfile(user)
        }
        get(ref(DB, `users/${username}/`)).then(snapShot => {
            setProfile(snapShot.val())
        })
        setFollow(follows.some(item => item.user === username))
    }, [username])

    if(!userProfile) return null
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
        {username === user.username?
           <></>: 
            <>
                {isFollow? 
                    <button onClick={() => setModal(true)} className={s['unfollow-btn']}>Following</button>:
                    <button onClick={() => {follow(username); setFollow(true)}}>Follow</button>
                }
                {!modal ||
                    <UnfollowModal {...{username}} onUnfollow={() => setFollow(false)} closeModal={() => setModal(false)}/>}
            </>
        }
    </div>
  )
}