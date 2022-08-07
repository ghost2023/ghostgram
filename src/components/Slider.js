import { useRef, useState } from 'react'
import s from '../styles/Slider.module.css'
import CircleChevron from './svgs/CircleChevron'

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
    <div className={s.slider}>
      <div className={s.hider}>
        <div className={s.container} ref={container} style={{width: `${len * 100}%`, transform: `translateX(-${width * page}px)`}}>

          {children.map((child, i) => (
            <div className={s.slide} key={i}>{child}</div>
            ))}
        </div>
      </div>
      {page === 0 || <div onClick={goLeft} className={`${s.left} ${s.btn}`}><CircleChevron/></div>}
      {page === len - 1 || <div onClick={goRight} className={`${s.right} ${s.btn}`}><CircleChevron/></div>}
      <div className={s.indicators + (isInPost ? ` ${s.bottom}` : '')}>
        {[...Array(len)].map((_, i) =>
          <div key={i}  className={s.indicator + (i === page ? ` ${s.current}` : '')}/>
        )}</div>
    </div>
  )
}