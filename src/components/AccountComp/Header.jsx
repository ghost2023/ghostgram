import { equalTo, get, orderByChild, query, ref as dbRef } from "firebase/database";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Chevron from "../../components/svgs/Chevron";
import Following from "../../components/svgs/Following";
import Options from "../../components/svgs/Options";
import { DB, SG } from "../../fb-config";
import s from '../../styles/Account.module.css';
import { useAuth } from "../../userContext";
import Gear from "../svgs/Gear";

export default function Header({ username }) {
    const { follows, follow, unFollow, user, profileUrl} = useAuth()
    const [userAcc, setUserAcc] = useState()
    const [profile, setProfile] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersNum, setFollowersNum] = useState(0)
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
        setUpProfile()
    },[username])

    function followUnFollow() {
        if(!isFollowing){
            follow(userAcc.username)
            setFollowersNum(p => p + 1)
        } 
        else{
            unFollow(userAcc.username)
            setFollowersNum(p => p - 1)
        }
        setIsFollowing(p => !p)
    }

    async function setUpProfile(){
        if(username === user.username){
            setUserAcc(user)
            console.log(user)
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
        setFollowersNum(Object.keys(followersData.val())?.length || 0)

        // set where the logged in user is following this user
        setIsFollowing(follows.some(i => i[1] === username))

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
                <div className={s.followers}><span>{followersNum}</span> followers</div>
                <div className={s.following}><span>{userAcc?.followings || 0}</span> following</div>
            </div>
            <div className={s.info}>
                <div className={s.name}>{userAcc?.name}</div>
                {!!userAcc?.occupation?.length && 
                <div className={s.occ}>{userAcc?.occupation}</div>}
                {!!userAcc?.bio?.length &&
                <div className={s.bio}>{userAcc?.bio}</div>}
            </div>
        </div>
    </main>
  )
}
