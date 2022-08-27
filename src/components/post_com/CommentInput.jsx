import { useState } from 'react';
import s from '../../styles/Post.module.css';
import { useAuth } from '../../userContext';
import { commentPost } from '../../utils';
import Emoji from '../svgs/Emoji';

export default function CommentInput({ postId ,updateComments }) {
    const [comment, setComment] = useState('')
    const { user } = useAuth()

    function submitComment(e){
        e.preventDefault();
        commentPost(postId, user, comment)
          .then(() => {
            e.target.querySelector('textarea').value = ''
            setComment('')
            updateComments(comment)
          })
      }

  return (
    <section className={s.commentsection}>
        <form onSubmit={submitComment}>
            <button className={s.emojibtn}>
            <Emoji/>
            </button>
            <textarea aria-label="Add a comment…" placeholder="Add a comment…" autoComplete="off" autoCorrect="off" onInput={(e) => setComment(e.target.value)}></textarea>
            <button disabled={!comment} type="submit">Post</button>
        </form>
    </section>
  )
}
