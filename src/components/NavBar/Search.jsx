import { useState } from 'react'
import Cross from 'svgs/Cross'
import style from './NavBar.module.css'

export default function Search() {
  const [text, setText] = useState("")
  const [focused, setFocused] = useState(false)

  return (
    <div className={style["search-container"]}>
      <div className={style["searchbar"]}>
        <input type="text" placeholder='Search' value={text} onChange={e => setText(e.target.value)}/>
        <span onClick={() => setText("")}><Cross xsmall/></span>
      </div>
    </div>
  )
}
