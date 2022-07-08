import ReactDOM from "react-dom"
import s from '../styles/NewPost.module.css'

export default function NewPost({ closeNewPost }) {
  return ReactDOM.createPortal(
    <>
    <div className='overlay' onClick={closeNewPost}>

    <div className={s.portal} onClick={e => e.stopPropagation()}>
        <div className={s.header}>Create new post</div>
    </div>
    <svg className={s.close} viewBox="0 0 48 48">
        <title>Close</title>
        <path clip-rule="evenodd" d="M41.8 9.8L27.5 24l14.2 14.2c.6.6.6 1.5 0 2.1l-1.4 1.4c-.6.6-1.5.6-2.1 0L24 27.5 9.8 41.8c-.6.6-1.5.6-2.1 0l-1.4-1.4c-.6-.6-.6-1.5 0-2.1L20.5 24 6.2 9.8c-.6-.6-.6-1.5 0-2.1l1.4-1.4c.6-.6 1.5-.6 2.1 0L24 20.5 38.3 6.2c.6-.6 1.5-.6 2.1 0l1.4 1.4c.6.6.6 1.6 0 2.2z" fill-rule="evenodd"></path></svg>
    </div>
    </>,
    document.getElementById('portal')
  )
}
