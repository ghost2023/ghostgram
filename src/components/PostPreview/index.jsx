import Media from '../Media'
import style from './style.module.css'

export default function Post({ post }) {
  return (
    <div className={style.post}>
      <Media path={post.content[0]}/>
    </div>
  )
}
