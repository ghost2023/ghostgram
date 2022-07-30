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
    const { userName } = useParams()
    const [userAcc, setUserAcc] = useState()
    const [profile, setProfile] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersNum, setFollowersNum] = useState(0)

    useEffect(() => {
        // if(!userAcc) return
        setUpProfile()
        setIsFollowing(follows.some(i => i[1] === userAcc.uid))
    },[])

    function followUnFollow() {
        if(!isFollowing) follow(userAcc.uid)
        else unFollow(userAcc.uid)
        console.log(1234,follows ,isFollowing)
        setIsFollowing(p => !p)
    }

    async function setUpProfile(){
        const userQuery = query(dbRef(DB, 'users/'), orderByChild('username'), equalTo(userName))
        const data = await get(userQuery);
        const uid = Object.keys(data.val())[0]
        const val = Object.values(data.val())[0]
        setUserAcc({...val, uid})
        console.log({...val, uid})
        getDownloadURL(ref(SG, 'profiles/' + val.profile)).then(url => setProfile(url))
        const followersQuery = query(dbRef(DB, 'follows/'), orderByChild('followe'), equalTo(uid))
        const followersData = await get(followersQuery)
        setFollowersNum(Object.keys(followersData.val())?.length || 0)
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
                            <h1>{userName}</h1>
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
