import AccountLink from 'components/AccountLink';
import Media from 'components/Media';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from 'styles/Post.module.css';
import Options from 'svgs/Options';
import OptionsModal from './OptionsModal';

export default function Header({ postId, username, userProfile }) {
  const [optionsModalOpen, setOptionModalOpen] = useState(false)

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
        <button className={style.options} onClick={() => setOptionModalOpen(true)}><Options isSmall/></button>
        {optionsModalOpen &&
        <OptionsModal {...{postId}} closeModal={() => setOptionModalOpen(false)} user={username}/>}
    </div>
  )
}
