import { useEffect, useState } from 'react'
import s from '../styles/Slider.module.css'
import CircleChevron from './svgs/CircleChevron'

export default function slider({ children }) {
  const len = children.length
  const [page, setPage] = useState(0)
  let indicators = []
  useEffect(() => {
    indicators = []
    for(let i = 0; i < len; i++){
      let style = s.indicator
      if(i === page) style += ` ${s.current}`
      indicators.push(<div className={style}></div>)
    }
  }, [page])
  return (
    <div className={s.slider}>
      <div className={s.container} style={{width: `${len * 100}%` }}>

        {children.map(child => (
          <div className={s.slide}>{child}</div>
        ))}
      </div>
      <div className={`${s.left} ${s.btn}`}><CircleChevron/></div>
      <div className={`${s.right} ${s.btn}`}><CircleChevron/></div>
      <div className={s.indicators}>{indicators}</div>
    </div>
  )
}