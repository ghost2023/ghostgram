import { Link } from 'react-router-dom';
import s from '../../styles/Post.module.css';
import AccountLink from '../AccountLink';
import Media from '../Media';
import Options from '../svgs/Options';

export default function Header({ username, userProfile }) {
  return (
    <div className={s.header}>
        <Link to={`/${username}`}>
        <div className={s.userpic}>
            <Media path={`profiles/${userProfile}`}/>
        </div>
        </Link>
        <div className={s.username}>
        <AccountLink username={username} />
        </div>
        <button><Options isSmall/></button>
    </div>
  )
}
