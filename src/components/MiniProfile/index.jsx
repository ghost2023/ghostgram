import { useAuth } from 'context/userContext'
import { DB } from 'fb-config'
import { get, ref } from 'firebase/database'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AccountLink from '../AccountLink'
import Media from '../Media'
import UnfollowModal from '../Modals/UnfollowModal'
import style from './style.module.css'

export default function MiniProfile({ username, userData }) {
    const { follows, follow, user } = useAuth()
    const [userProfile, setProfile] = useState()
    const [modal, setModal] = useState(false)
    const [isFollow, setFollow] = useState(false)

    useState(() => {
        if(!username && !userData) return
        if(username === user.userProfile){
            setProfile(user)
        }
        else if(userData){
            setProfile(userData)
            setFollow(follows.some(item => item.user === username))
        }
        else{
            get(ref(DB, `users/${username}/`)).then(snapShot => {
                setProfile(snapShot.val())
            })
            setFollow(follows.some(item => item.user === username))
        }
    }, [username])

    if(!userProfile) return null
  return (
    <div className={style.account}>
        <Link to={`/${username}`}>
            <div className={style.icon}>
                <Media path={`profiles/${userProfile.profile || ''}`}/>
            </div>
        </Link>
        <div className={style["account-name"]}>
            <AccountLink {...{username}} />
            <span>
                {userProfile.name}
            </span>
        </div>
        {username === user.username?
           <></>: 
            <>
                {isFollow? 
                    <button onClick={() => setModal(true)} className={style['unfollow-btn']}>Following</button>:
                    <button onClick={() => {follow(username); setFollow(true)}}>Follow</button>
                }
                {!modal ||
                    <UnfollowModal {...{username}} onUnfollow={() => setFollow(false)} closeModal={() => setModal(false)}/>}
            </>
        }
    </div>
  )
}