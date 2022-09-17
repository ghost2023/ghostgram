import s from '../../styles/Account.module.css'
import Media from '../Media'

export default function Post({ post }) {
  return (
    <div className={s.post}>
      <Media path={post.content[0]}/>
    </div>
  )
}
