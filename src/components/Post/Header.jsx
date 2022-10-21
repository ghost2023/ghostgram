import AccountLink from 'components/AccountLink';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from 'styles/Post.module.css';
import Options from 'svgs/Options';
import { getUserProfile } from 'utils/services';
import OptionsModal from './OptionsModal';

export default function Header({ postId, user:{ uid, username, profile } }) {
  const { follows, follow } = useAuth()
  const [profileUrl, setUserProfile] = useState("")
  const [optionModal, openOptionModal] = useModal(OptionsModal, {...{postId}, uid, username, profileUrl} )

  useEffect(() => {
    getUserProfile(profile).then(setUserProfile)
  }, [uid, username, profile, postId])

  return (
    <div className={style.header}>
      <Link to={`/${username}`}>
        <div className={style.userpic}>
          <img src={profileUrl} alt=""/>
        </div>
      </Link>
      <div className={style.username}>
        <AccountLink username={username} />
        {follows.includes(uid) ||
        <div className={style.followbtn}>
          <span>•</span>
          <button onClick={() => follow(uid)}>Follow</button>
        </div>
        }
      </div>
      <button className={style.options} onClick={openOptionModal}>
        <Options isSmall/>
      </button>
      {optionModal}
    </div>
  )
}
