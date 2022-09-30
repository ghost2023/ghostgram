import UnfollowModal from "components/Modals/UnfollowModal";
import { DB, SG } from "fb-config";
import { equalTo, get, orderByChild, query, ref as dbRef } from "firebase/database";
import { getDownloadURL, ref } from "firebase/storage";
import useAuth from "hooks/useAuth";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Chevron from "svgs/Chevron";
import Following from "svgs/Following";
import Gear from "svgs/Gear";
import Options from "svgs/Options";
import Followers from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import s from './Header.module.css';

export default function Header({ username }) {
    const { follows, follow, user, profileUrl} = useAuth()
    const [userAcc, setUserAcc] = useState()
    const [profile, setProfile] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers, setFollowers] = useState([])
    const [followersModal, setFollowersModal] = useState(false)
    const [followingModal, setFollowingModal] = useState(false)
    const [unFollowModal, setUnFollowModal] = useState(false)
    const Btns = {
        MessageBtn : <button className={s.msgbtn}>Message</button>,
        FollowBtn : <button className={`${s.followbtn} ${!isFollowing && s.b }`} onClick={followUnFollow}>
            {isFollowing? <Following/> : "Follow"}
        </button>,
        SuggestionBtn : <button className={`${s.suggestbtn} ${!isFollowing && s.b }`}>
            <Chevron isSmall dxn='d'/>
        </button>,
        EditBtn : <Link to="accounts/edit/"><button>Edit profile</button></Link>
}

    useEffect(() => {
        (async () => {
            if(username === user.username){
                setUserAcc(user)
                setProfile(profileUrl)
                return
            }
            const data = await get(dbRef(DB, 'users/' + username));
            const val = data.val()
            setUserAcc({...val, username})

            // getting profile picture
            getDownloadURL(ref(SG, 'profiles/' + val.profile)).then(u => setProfile(u))

            // get followers
            const followersQuery = query(dbRef(DB, 'follows/'), orderByChild('followe'), equalTo(username))
            const followersData = await get(followersQuery)
            const followersArr = Object.values(followersData.val()).map(item => item.follower)
            setFollowers(followersArr)

            // set where the logged in user is following this user
            setIsFollowing(follows.some(i => i.user === username))
        })()
    },[username, profileUrl, user, follows])

    function followUnFollow() {
        if(!isFollowing){
            follow(userAcc.username)
            setIsFollowing(true)
        } 
        else{
            setUnFollowModal(true)
        }
    }

  return (
    <main className={s.profile}>
        <div className={s['profilepic-wrapper']}>
            <div className={s.profilepic}>
                <img src={profile} alt="" />
            </div>
        </div>
        <div className={s.detail}>
            <div className={s['username-wrapper']}>
                <div className={s.username}>
                    <h1>{username}</h1>
                </div>
                <div className={s.btns}>
                    {username !== user.username? 
                        <>
                            {Btns.MessageBtn}
                            {Btns.FollowBtn}
                            {Btns.SuggestionBtn}
                        </>:
                        <>
                            {Btns.EditBtn}
                        </>
                    }
                    
                </div>
                {username !== user.username ?
                <button className={s.optionsbtn}><Options/></button>:
                <button className={s.optionsbtn}><Gear/></button>
                }
            </div>
            <div className={s.stats}>
                <div className={s.posts}><span>{userAcc?.posts || 0}</span> posts</div>
                <div className={s.followers} onClick={() => setFollowersModal(true)}><span>{followers.length}</span> followers</div>
                <div className={s.following} onClick={() => setFollowingModal(true)}><span>{userAcc?.followings || 0}</span> following</div>
            </div>
            <div className={s.info}>
                <div className={s.name}>{userAcc?.name}</div>
                {!!userAcc?.occupation?.length && 
                <div className={s.occ}>{userAcc?.occupation}</div>}
                {!!userAcc?.bio?.length &&
                <div className={s.bio}>{userAcc?.bio}</div>}
            </div>
        </div>
        {!followersModal || 
        <Followers {...{username}} {...{followers}} closeModal={() => setFollowersModal(false)} />}
        {!followingModal || 
        <FollowingModal {...{username}} closeModal={() => setFollowingModal(false)} />}
        {!unFollowModal ||
        <UnfollowModal {...{username}} onUnfollow={() => setIsFollowing(false)} closeModal={() => setUnFollowModal(false)}/>}
    </main>
  )
}
