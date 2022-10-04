export default function Chevron({ dxn, isSmall }) {
    let angle = 0;
    const sz = isSmall? "12px" : "16px"
    if(dxn === 'r') angle = 90
    if(dxn === 'd') angle = 180
    if(dxn === 'l') angle = 270
  return (
    <svg aria-label="chevron icon" height={sz} role="img" viewBox="0 0 24 24" width={sz} style={{transform: `rotate(${angle}+ "deg")`}}>
        <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
    </svg>
  )
}
