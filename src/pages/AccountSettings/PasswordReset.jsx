import { useAuth } from 'context/userContext'
import useModal from 'hooks/useModal'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import style from './AccountSettings.module.css'

export default function PasswordReset() {
  const { user:{ username, email }, profileUrl } = useAuth()
  const [] = useModal()
  const [valid, setValid] = useState()

  const formChange = e => {
    const form = e.target.closest("form")
    const password = form.pw.value
    const newPassword = form["new-pw"].value
    const passwordConfirm = form["confirm-pw"].value
    console.log(password, newPassword, passwordConfirm)
    if(!password || !newPassword || !passwordConfirm){
      setValid(false)
      return
    }
    setValid(true)
  }


  const handelForm = (e) => {
    e.preventDefault()

    const form = e.target
    const password = form.pw.value
    const newPassword = form["new-pw"].value
    const passwordConfirm = form["confirm-pw"].value

    // sendPasswordResetEmail(auth, email,)

  }

  return (
    <main>
      <div className={style.tabs}>
        <Link to='/accounts/edit'>
          <div className={style.tab}>Edit Profile</div>
        </Link>
        <Link  to='/accounts/password/change/'>
          <div className={style.tab + " " + style.active}>Change Password</div>
        </Link>
      </div>
      <article className={style.content}>
        <div className={style.profile}>
          <div className={style["profile-pic"]}>
            <button>
              <img src={profileUrl} alt="" />
            </button>
          </div>
          <div className={style["profile-name"]}>
            <h1>{username}</h1>
          </div>

        </div>
        <form action="" onSubmit={handelForm} className={style.passwordForm} onChange={formChange}>
          <div className={style.row}>
            <aside>
              <label htmlFor="pw">Old Password</label>
            </aside>
            <div className={style.main}>
              <input type="password" name="" id="pw" />
            </div>
          </div>
          <div className={style.row}>
            <aside>
              <label htmlFor="new-pw">New Password</label>
            </aside>
            <div className={style.main}>
              <input type="password" name="" id="new-pw" />
            </div>
          </div>
          <div className={style.row}>
            <aside>
              <label htmlFor="confirm-pw">Confirm New Password</label>
            </aside>
            <div className={style.main}>
              <input type="password" name="" id="confirm-pw" />
            </div>
          </div>
          <div className={style.row}>
            <aside></aside>
            <div className={style.submit}>
              <button type="submit" disabled={!valid}>Change Password</button>
            </div>
          </div>
        </form>
      </article>
    </main>
  )
}
