import useAuth from 'hooks/useAuth'
import useModal from 'hooks/useModal'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserWithProfileUrl } from 'utils/services'
import AccountLink from '../AccountLink'
import UnfollowModal from '../Modals/UnfollowModal'
import style from './style.module.css'

export default function MiniProfile({ uid, username, name, profileUrl }) {
    const { follows, follow, user, profileUrl: loggedProfile } = useAuth()
    const isLoggedUser = uid === user.uid
    const [isFollow, setFollow] = useState(false)
    const [account, setAccount] = useState({ uid, username, name, profileUrl })
    const [unFollowModal, openUnfollowModal] = useModal(UnfollowModal, {
        uid,
        username: account.username, 
        profileUrl: account.profileUrl, 
        onUnfollow: () => setFollow(false)
    })

    useEffect(() => {
        if(isLoggedUser){
            setAccount(user)
            return
        }
        setFollow(follows.includes(uid))
        if(!username){
            getUserWithProfileUrl(uid)
            .then(setAccount)
        }

    }, [uid, username, follows, user, isLoggedUser])

    if(!account.username) return null
  return (
    <div className={style.account}>
        <Link to={`/${username}`}>
            <div className={style.icon}>
                <img src={isLoggedUser? loggedProfile : account.profileUrl } alt="" />
            </div>
        </Link>
        <div className={style["account-name"]}>
            <AccountLink username={account.username} />
            <span>{name}</span>
        </div>
        {isLoggedUser||
            <>
                {isFollow? 
                    <button onClick={openUnfollowModal} className={style['unfollow-btn']}>Following</button>:
                    <button onClick={() => {follow(uid); setFollow(true)}}>Follow</button>
                }
                {unFollowModal}
            </>
        }
    </div>
  )
}