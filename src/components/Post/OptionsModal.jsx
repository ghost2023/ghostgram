import UnfollowModal from 'components/Modals/UnfollowModal';
import Overlay from "components/Overlay";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import style from 'styles/Modal.module.css';

export default function OptionsModal({ postId, closeModal, user }) {
    const { follows } = useAuth()
    const [isFollowing, setFollowing] = useState(false)
    const [unFollowModalOpen, setunFollowModal] = useState(false)
    const isSameLocation = useLocation().pathname === `/p/${postId}`
    const UnFollowbtn = <button onClick={() => setunFollowModal(true)} className={`${style.btn} ${style.warning}`}>Unfollow</button>
    const GoToBtn = <Link to={`/p/${postId}`}>
                        <button className={style.btn}>Go to post</button>
                    </Link>

    useEffect(() => {
        setFollowing(follows.some(follow => follow.user === user))
    }, [postId, user, follows])
    function copyLink(){
        const {ClipboardItem} = window
        const type = "text/plain";
        const blob = new Blob([postId], { type });
        const data = [new ClipboardItem({ [type]: blob })];

        navigator.clipboard.write(data).then(
            () => {
            console.log('/* success */')
            }
        );
        closeModal()
    }

  return (
    <Overlay onClick={closeModal}>
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <div className={style.options}>
            <button className={`${style.btn} ${style.warning}`} onClick={closeModal}>Report</button>
            {isFollowing && <>{UnFollowbtn}</>}
            {isSameLocation || <>{GoToBtn}</>}
            <button className={style.btn} onClick={copyLink}>Copy link</button>
            <button className={style.btn} onClick={closeModal}>Cancel</button>
        </div>
        {unFollowModalOpen && 
        <UnfollowModal username={user} closeModal={() => setunFollowModal(false)}/>}
      </div>
    </Overlay>
  )
}
