import NavBar from 'components/NavBar';
import { useState } from 'react';
import { useParams } from "react-router-dom";
import s from './Account.module.css';
import Header from "./components/Header";
import Posts from "./components/Posts";
import Tabs from './components/Tabs';

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
