import { equalTo, get, orderByChild, query, ref as dbRef } from "firebase/database";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import Chevron from "../components/svgs/Chevron";
import Following from "../components/svgs/Following";
import Options from "../components/svgs/Options";
import { DB, SG } from "../fb-config";
import s from '../styles/Account.module.css';
import { useAuth } from "../userContext";

export default function Account() {
    const { follows, follow, unFollow } = useAuth()
    const { username } = useParams()
    const [userAcc, setUserAcc] = useState()
    const [profile, setProfile] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersNum, setFollowersNum] = useState(0)

    useEffect(() => {
        // if(!userAcc) return
        setUpProfile()
    },[])
    
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
        const data = await get(dbRef(DB, 'users/' + username));
        const val = data.val()
        setUserAcc({...val, username})
        console.log(data, username)

        // getting profile picture
        getDownloadURL(ref(SG, 'profiles/' + val.profile)).then(u => setProfile(u))

        // get followers
        const followersQuery = query(dbRef(DB, 'follows/'), orderByChild('followe'), equalTo(username))
        const followersData = await get(followersQuery)
        setFollowersNum(Object.keys(followersData.val())?.length || 0)
        setIsFollowing(follows.some(i => i[1] === username))
    }

  return (
    <>
        <NavBar page={'account'}/>
        <div className={s.page}>
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
                            <button className={s.msgbtn}>Message</button>
                            <button className={`${s.followbtn} ${!isFollowing && s.b }`} onClick={followUnFollow}>{isFollowing? <Following/> : "Follow"}</button>
                            <button className={`${s.suggestbtn} ${!isFollowing && s.b }`}><Chevron isSmall dxn='d'/></button>
                        </div>
                        <button className={s.optionsbtn}><Options/></button>
                    </div>
                    <div className={s.stats}>
                        <div className={s.posts}><span>{userAcc?.posts || 0}</span> posts</div>
                        <div className={s.followers}><span>{followersNum}</span> followers</div>
                        <div className={s.following}><span>{userAcc?.followings || 0}</span> following</div>
                    </div>
                    <div className={s.info}>

                    </div>
                </div>
            </main>
            <div className={s.stories}></div>
        </div>
    </>
  )
}
