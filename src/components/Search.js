import s from '../styles/Search.module.css'

export default function Search() {
  return (
    <div className={s.container}>
      <input type="text" placeholder='Search'/>
    </div>
  )
}
