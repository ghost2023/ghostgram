import Media from 'components/Media';
import Slider from 'components/Slider';
import { DB } from 'fb-config';
import { get, query, ref as dbRef } from 'firebase/database';
import { useEffect, useState } from 'react';
import s from 'styles/Post.module.css';
import ButtonPanel from '../Post/ButtonPanel';
import Comment from '../Post/Comment';
import CommentForm from '../Post/CommentForm';
import Header from '../Post/Header';

export default function PostModal({ post, content, timePosted = "" }) {
  const [comments, setComments] = useState([])
  const [contents, setContent] = useState(content)
  console.log(post)

  useEffect(() => {
    if(!content){

      if(post.content.length === 1) setContent(
        <div className={s.pic}>{<Media path={post.content[0]}/>}</div>
        )
        else setContent(
          <Slider>
          {post.content.map(i => <div key={i} className={s.pic}><Media path={i}/></div> )}
        </Slider>
      )
    }

    if(post.noComment) return
    get(query(dbRef(DB, 'comments/'+ post.id)))
    .then(snapShot => {
      if(!snapShot.val()) return
      const commentsArr = Object.values(snapShot.val()) 
      setComments(commentsArr.filter(item => item.content))
    })
  }, [post, content])
  
  return (
    <div className={s['post-extended']} onClick={e => e.stopPropagation()}>
      <div className={s.content}>
        {contents}
      </div>
      <div className={s.side}>  
        <Header username={post.username}/>
        <div className={s.commentsection}>
          {comments.map((comment, i) => <Comment {...{comment}} key={i}/>)}
        </div>
        <ButtonPanel {...{post}}/>
        <div className={s.timestamp}>{timePosted}</div>
        <CommentForm postId={post.id}/>
      </div>
    </div>
  )
}