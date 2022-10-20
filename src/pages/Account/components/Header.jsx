import UnfollowModal from "components/Modals/UnfollowModal";
import useAuth from "hooks/useAuth";
import useModal from "hooks/useModal";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Chevron from "svgs/Chevron";
import Following from "svgs/Following";
import Gear from "svgs/Gear";
import Options from "svgs/Options";
import { getFollowers, getUserProfile } from "utils/services";
import FollowersModal from "./FollowersModal";
import s from './Header.module.css';

export default function Header({ user, isSameUser }) {
    const { follows, follow, profileUrl } = useAuth()
    const [profile, setProfile] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers, setFollowers] = useState([])
    const modalProps = {
        uid: user.uid,
        username: user.username,
        profileUrl: profile,
        onUnfollow:() => setIsFollowing(false)
    }
    const [unFollowModal, openUnfollowModal] = useModal(UnfollowModal, modalProps)
    const [followerModal, openFollowersModal] = useModal(FollowersModal, { followers})
    const [followingModal, openFollowingModal] = useModal(FollowersModal, { uid: user.uid, onUnfollow: () => setIsFollowing(false)})
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
            // getting profile picture
            if(isSameUser) setProfile(profileUrl)
            else getUserProfile(user.profile)
                    .then(setProfile)

            // get followers
            const followersArr = await getFollowers(user.uid)
            setFollowers(followersArr)

            // set where the logged in user is following this user
            if(!isSameUser) setIsFollowing(follows.includes(user.uid))
        })()
    },[user, profileUrl, follows, isSameUser])

    function followUnFollow() {
        if(!isFollowing){
            follow(user.uid)
            .then(setIsFollowing(true))
        } 
        else{
            openUnfollowModal(true)
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
                    <h1>{user.username}</h1>
                </div>
                <div className={s.btns}>
                    {!isSameUser? 
                        <>
                            {Btns.MessageBtn}
                            {Btns.FollowBtn}
                            {Btns.SuggestionBtn}
                        </>:
                        <>{Btns.EditBtn}</>
                    }
                    
                </div>
                {!isSameUser ?
                    <button className={s.optionsbtn}><Options/></button>:
                    <button className={s.optionsbtn}><Gear/></button>
                }
            </div>
            <div className={s.stats}>
                <div className={s.posts}><span>{user.posts}</span> posts</div>
                <div className={s.followers} onClick={openFollowersModal}><span>{followers.length}</span> followers</div>
                <div className={s.following} onClick={openFollowingModal}><span>{user.followings}</span> following</div>
            </div>
            <div className={s.info}>
                <div className={s.name}>{user?.name}</div>
                {!!user?.occupation?.length && 
                <div className={s.occ}>{user?.occupation}</div>}
                {!!user?.bio?.length &&
                <div className={s.bio}>{user?.bio}</div>}
            </div>
        </div>
        {followerModal}
        {followingModal}
        {unFollowModal}
    </main>
  )
}
