import Overlay from 'components/Overlay'
import { useAuth } from 'context/userContext'
import { DB, SG } from 'fb-config'
import { ref as dbRef, update } from 'firebase/database'
import { deleteObject, ref, uploadBytes } from 'firebase/storage'
import { useRef } from 'react'
import style from 'styles/Modal.module.css'

export default function ProfileModal({ closeModal }) {
    const {user: { profile, username }, updateProfile } = useAuth()
    const inputRef = useRef()

    const setProfile = async (e) => {
        const newProfile = username + ".jpg"
        await uploadBytes(ref(SG, 'profiles/' +  newProfile), e.target.files[0])
        updateProfile(newProfile)
        await update(dbRef(DB, 'users/' + username), {profile: newProfile})
        return closeModal()
        
    }

    const removeProfile = async () => {
        await deleteObject(ref(SG, 'profiles/' + profile))
        await update(dbRef(DB, 'users/' + username ), {profile: 'default-avatar.jpg'})
        closeModal()
    }

  return (
    <Overlay onClick={closeModal}>
        <div className={style.modal} onClick={e => e.stopPropagation()}>
            <div className={style["header"]}>
                <h1>Change Profile Photo</h1>
            </div>
            
            <div className={style.btns}>
                <button className={`${style.btn} ${style["blue-txt-btn"]}`} onClick={() => inputRef.current.click()}>Upload Photo</button>
                {profile === 'default-avatar.jpg' ||
                    <button className={`${style.warning} ${style.btn}`} onClick={removeProfile}>Remove Current Photo</button>
                }
                <button onClick={closeModal} className={style.btn}>Cancel</button>
            </div>
            <input type="file" style={{display:'none'}} ref={inputRef} onInput={setProfile}/>
        </div>
    </Overlay>      
  )
}
