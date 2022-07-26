import { auth, db, realDb } from 'fb-config'
import { updateEmail } from 'firebase/auth'
import { ref, update } from 'firebase/database'
import { doc, updateDoc } from 'firebase/firestore'
import useAuth from 'hooks/useAuth'
import useModal from 'hooks/useModal'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import style from './AccountSettings.module.css'
import ProfileModal from './ProfileModal'

export default function Edit() {
  const [Modal, openProfileModal] = useModal(ProfileModal)
  const { user, profileUrl, setUser } = useAuth()
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [isValid, setValid] = useState(false)

  const onUsernameChange = e => {
    const val = e.target.value
    if(val === user.username) return
    setValid(true)
    setUsername(val)
  }
  const onNameChange = e => {
    const val = e.target.value
    if(val === user.name) return
    setValid(true)
  }
  const onEmailChange = e => {
    const val = e.target.value
    if(val === user.Email) return
    // eslint-disable-next-line no-useless-escape
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!filter.test(val)) return 
    setValid(true)
    setEmail(val)
  }
  const onBioChange = e => {
    const val = e.target.value
    if(val === user.bio) return setValid(false)
    setValid(true)
  }

  const formChange = e => {
    const form = e.target.closest("form")
  }
 
  const formSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const bio = form.bio.value

    if(email !== user.email){
      await updateEmail(auth.currentUser, email)
    }

    const newUserObj = {
      name,
      username,
    }
    await Promise.all([
      update(ref(realDb, 'users/' + user.uid), newUserObj),
      updateDoc(doc(db, 'users', user.uid), {...newUserObj, bio})
    ])
    setUser(prev => {
      return {...prev, newUserObj}
    })
  }

  return (
    <main>
      <div className={style.tabs}>
        <Link to='/accounts/edit'>
          <div className={style.tab + " " + style.active}>Edit Profile</div>
        </Link>
        <Link  to='/accounts/password/change/'>
          <div className={style.tab}>Change Password</div>
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
            <h1>{user.username}</h1>
            <button onClick={openProfileModal}>Change profile photo</button>
            {Modal}
          </div>
        </div>
        <form onSubmit={formSubmit}>
          <div className={style.row}>
            <aside>
              <label htmlFor="name">
                Name
              </label>
            </aside>
            <div className={style.main}>
              <input type="text" placeholder='Name' id='name' defaultValue={user.name} onInput={onNameChange} />
              <div className={style['name-help']}>
                <p>
                  Help people discover your account by using the name you're known by: either your full name, nickname, or business name.
                </p>
              </div>
            </div>
          </div>
          <div className={style.row}>
            <aside>
              <label htmlFor="username">
                Username
              </label>
            </aside>
            <div className={style.main}>
              <input type="text" placeholder='Username' id='username' defaultValue={user.username} onInput={onUsernameChange} />
            </div>
          </div>
          <div className={style.row}>
            <aside>
              <label htmlFor="bio">
                Bio
              </label>
            </aside>
            <div className={style.main}>
              <textarea type="text" placeholder='Bio' id='bio' defaultValue={user.bio} onChange={onBioChange}>
              </textarea>
            </div>
          </div>
          <div className={style.row}>
            <aside>
              <label htmlFor="email">
                Email
              </label>
            </aside>
            <div className={style.main}>
              <input type="text" placeholder='Email' id='email' defaultValue={user.email} onChange={onEmailChange} />
            </div>
          </div>
          <div className={style.row}>
            <aside></aside>
            <div className={style.submit}>
              <button type="submit" disabled={!isValid}>Submit</button>
            </div>
          </div>
        </form>
      </article>
    </main>
  )
}
