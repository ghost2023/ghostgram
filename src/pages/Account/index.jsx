import NavBar from 'components/NavBar';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getUserByUsername } from 'utils/services';
import s from './Account.module.css';
import Header from "./components/Header";
import Posts from "./components/Posts";
import Tabs from './components/Tabs';

export default function Account() {
    const { username } = useParams()
    const [userAcc, setUserAcc] = useState()
    const [tab, setTab] = useState(0)
  
    useEffect(() => {
      getUserByUsername(username).then(setUserAcc)
    }, [username])

  if(!userAcc) return null
  return (
    <>
      <NavBar page={'account'}/>
      <div className={s.page}>
          <Header {...{userAcc}}/>
          <Tabs {...{setTab, tab}}/>
          <Posts uid={userAcc.uid}/>
          <div className={s.stories}></div>
      </div>
    </>
  )
}
