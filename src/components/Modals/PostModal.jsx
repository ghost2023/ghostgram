import AccountLink from 'components/AccountLink';
import Slider from 'components/Slider';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from 'styles/Post.module.css';
import { formatCommentTime } from 'utils/formatTime';
import { getComments, getPostContents, getUserByUid, getUserProfile } from 'utils/services';
import ButtonPanel from '../Post/ButtonPanel';
import Comment from '../Post/Comment';
import CommentForm from '../Post/CommentForm';
import Header from '../Post/Header';

export default function PostModal({ post, content, user, timePosted = "" }) {
  const [comments, setComments] = useState([])
  const [contents, setContent] = useState(content)
  const [postUser, setPostUser] = useState(user)
  const [profile, setProfile] = useState("")

  useEffect(() => {
    if(!content) getPostContents(post.content).then(setContent)
    if(!user) getUserByUid(post.user).then(userData => {
      setPostUser(userData)
      getUserProfile(userData.profile).then(setProfile)
    })

    if(post.noComment) return
    getComments(post.id).then(setComments)
  }, [post, content, user])
  
  if(!contents || !postUser) return null
  return (
    <div className={style['post-extended']} onClick={e => e.stopPropagation()}>
      <div className={style.content}>
        <Slider>
          {contents.map(src => <div key={src} className={style.pic}><img {...{src}} alt=""/></div> )}
        </Slider>
      </div>
      <div className={style.side}>  
        <Header {...{user:postUser, postId: post.id}}/>
        <div className={style.commentsection}>
          {!post.caption || 
            <div className={style.comment}>
              <div className={style.userpic}>  
                <Link to={`/${user.username}`}>
                  <img src={profile} alt=""/>
                </Link>
              </div>
              <div className={style.commentbody}>
                <div className={style["comment-content"]}>
                  <span>
                    <AccountLink username={user.username}/> 
                  </span>
                  <p>{post.caption}</p>
                </div>
                <time className={style.commenttime}>
                  {formatCommentTime(post.timeStamp)}
                </time>
              </div>
            </div>
          }
          {comments.map((comment, i) => <Comment {...{comment}} key={i}/>)}
        </div>
        <ButtonPanel {...{post}}/>
        <div className={style.timestamp}>{timePosted}</div>
        <CommentForm postId={post.id}/>
      </div>
    </div>
  )
}