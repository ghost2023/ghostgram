import { useRef, useState } from 'react'
import CircleChevron from 'svgs/CircleChevron'
import style from './Slider.module.css'

export default function Slider({ children, isInPost }) {
  const len = children.length
  const [page, setPage] = useState(0)
  const container = useRef()
  let width = container.current?.offsetWidth / len

  function goLeft(){
    if(page === 0) return
    setPage(p => p - 1)    
  }
  function goRight(){
    if(page === len - 1) return
    setPage(p => p + 1)    
  }
  return (
    <div className={style.slider}>
      <div className={style.hider}>
        <div className={style.container} ref={container} style={{width: `${len * 100}%`, transform: `translateX(-${width * page}px)`}}>

          {children.map((child, i) => (
            <div className={style.slide} key={i}>{child}</div>
            ))}
        </div>
      </div>
      {page === 0 || <div onClick={goLeft} className={`${style.left} ${style.btn}`}><CircleChevron/></div>}
      {page === len - 1 || <div onClick={goRight} className={`${style.right} ${style.btn}`}><CircleChevron/></div>}
      {children.length === 1 ||
        <div className={style.indicators + (isInPost ? ` ${style.bottom}` : '')}>
          {[...Array(len)].map((_, i) =>
            <div key={i}  className={style.indicator + (i === page ? ` ${style.current}` : '')}/>
          )}
        </div>
      }
    </div>
  )
}