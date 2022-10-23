import { useState } from 'react'
import Cross from 'svgs/Cross'
import Lens from 'svgs/Lens'
import style from './NavBar.module.css'

export default function Search() {
  const [text, setText] = useState("")
  const [focused, setFocused] = useState(false)
  const [history, setHistory] = useState([])

  return (
    <div className={style["search-container"]}>
      {focused?
        <>
          <div className={style["searchbar-container"]}>

            <div className={style["searchbar"]}>
              <input type="text" placeholder='Search' value={text} onChange={e => setText(e.target.value)}/>
              <span onClick={() => {setText(""); setFocused(false)}}><Cross xsmall/></span>
            </div>
            
            <div className={style["suggestions-container"]}>
              <div className={style.arrow}></div>
              <div className={style.suggestionsbox}>
                <header className={style["suggestion-header"]}>
                  <h3>Recent</h3>
                  {!history.length ||
                    <button onClick={() => setHistory([])}>Clear all</button>
                  }
                </header>
                <div className={style["suggestion-body"]}>
                  {!history.length &&
                    <div className={style["suggestion-empty"]}>
                      <p>No recent searches.</p>
                    </div>
                  }
                  {/* <Spinner/> */}
                </div>
              </div>
            </div>
          </div>
          <div className={style.hider} open onClick={() => setFocused(false)}></div>
        </>

        :
        <div onClick={() => setFocused(true)} className={style.searchcover}>
          <Lens/>
          <span>{text || "Search"}</span>
        </div>
      }
    </div>
    )
}
