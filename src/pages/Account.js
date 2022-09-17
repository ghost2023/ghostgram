import { useState } from 'react';
import { useParams } from "react-router-dom";
import Header from "../components/AccountComp/Header";
import Posts from "../components/AccountComp/Posts";
import Tabs from '../components/AccountComp/Tabs';
import NavBar from '../components/NavBar';
import s from '../styles/Account.module.css';

export default function Account() {
    const { username } = useParams()
    const [tab, setTab] = useState(0)
    
  return (
    <>
        <NavBar page={'account'}/>
        <div className={s.page}>
            <Header username={username}/>
            <Tabs {...{setTab, tab}}/>
            <Posts {...{username}}/>
            <div className={s.stories}></div>
        </div>
    </>
  )
}
