import AccountLink from 'components/AccountLink';
import Media from 'components/Media';
import { DB } from 'fb-config';
import { get, ref } from 'firebase/database';
import useModal from 'hooks/useModal';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from 'styles/Post.module.css';
import Options from 'svgs/Options';
import OptionsModal from './OptionsModal';

export default function Header({ postId, username }) {
  const [optionModal, openOptionModal] = useModal(OptionsModal, {...{postId}, user:username} )
  const [userProfile, setUserProfile] = useState("")

  useEffect(() => {
    get(ref(DB, `users/${username}/profile`))
    .then(snapShot => setUserProfile(snapShot.val()))
  }, [postId, username])

  if(!userProfile) return <></>
  return (
    <div className={style.header}>
      <Link to={`/${username}`}>
        <div className={style.userpic}>
            <Media path={`profiles/${userProfile}`}/>
        </div>
      </Link>
      <div className={style.username}>
          <AccountLink username={username} />
      </div>
      <button className={style.options} onClick={openOptionModal}><Options isSmall/></button>
      {optionModal}
    </div>
  )
}
