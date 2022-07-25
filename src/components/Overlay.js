export default function Overlay({ onClick, children }) {
  return (
    <div className='overlay' onClick={onClick}>
      {children.map(child => child)}
    </div>
  )
}
