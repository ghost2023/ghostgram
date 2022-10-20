import Media from '../Media'
import style from './style.module.css'

export default function PostPreview({ post }) {
  return (
    <div className={style.post}>
      <Media path={"posts/" + post.content[0]}/>
    </div>
  )
}
