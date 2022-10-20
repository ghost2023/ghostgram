import NavBar from 'components/NavBar';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getUserDataByUsername } from 'utils/services';
import s from './Account.module.css';
import Header from "./components/Header";
import Posts from "./components/Posts";
import Tabs from './components/Tabs';

export default function Account() {
  const { user } = useAuth()
  const { username } = useParams()
  const [isSameUser, setIsSameUser] = useState(false)
  const [userAcc, setUserAcc] = useState()
  const [tab, setTab] = useState(0)

  useEffect(() => {
    if(username === user.username){
      setUserAcc(user)
      setIsSameUser(true)
      return
    }
    getUserDataByUsername(username).then(setUserAcc)
  }, [username, user])

  if(!userAcc) return null
  return (
    <>
      <NavBar page={'account'}/>
      <div className={s.page}>
          <Header user={userAcc} {...{isSameUser}}/>
          <Tabs {...{setTab, tab}}/>
          <Posts uid={userAcc.uid} {...{isSameUser}}/>
          <div className={s.stories}></div>
      </div>
    </>
  )
}
