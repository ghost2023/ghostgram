import Overlay from './Overlay'

export default function Warning({ close, msg, btn }) {
  return (
    <Overlay onClick={close}>
        <p>{msg}</p>
        {btn}
      <button className="">Cancel</button>
    </Overlay>
  )
}
