import Overlay from 'components/Overlay'
import { db, realDb, SG } from 'fb-config'
import { ref as dbRef, update } from 'firebase/database'
import { doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref, uploadBytes } from 'firebase/storage'
import useAuth from 'hooks/useAuth'
import { useRef } from 'react'
import style from 'styles/Modal.module.css'

export default function ProfileModal({ closeModal }) {
    const {user: { profile, username, uid }, updateProfile } = useAuth()
    const inputRef = useRef()

    const setProfile = async (e) => {
        const newProfile = `${uid}/${username}.jpg`
        await Promise.all([
            uploadBytes(ref(SG, `profiles/${newProfile}`), e.target.files[0]),
            update(dbRef(realDb, 'users/' + uid), {profile: newProfile}),
            updateDoc(doc(db, 'users', uid), {profile: newProfile}),
            updateProfile(newProfile)
        ])
        closeModal()
    }

    const removeProfile = async () => {
        if(profile === 'default-avatar.jpg') return
        await Promise.all([
            deleteObject(ref(SG, 'profiles/' + profile)),
            update(dbRef(realDb, 'users/' + uid), {profile: 'default-avatar.jpg'}),
            updateDoc(doc(db, 'users', uid), {profile: 'default-avatar.jpg'})
            .updateProfile('default-avatar.jpg')
        ])
        closeModal()
    }

  return (
    <Overlay onClick={closeModal}>
        <div className={style.modal} onClick={e => e.stopPropagation()}>
            <div className={style["header"]}>
                <h1>Change Profile Photo</h1>
            </div>
            
            <div className={style.btns}>
                <button 
                    className={`${style.btn} ${style["blue-txt-btn"]}`} 
                    onClick={() => inputRef.current.click()}
                >
                        Upload Photo
                </button>

                {profile === 'default-avatar.jpg' ||
                    <button 
                        className={`${style.warning} ${style.btn}`} 
                        onClick={removeProfile}
                    >
                        Remove Current Photo
                    </button>
                }
                <button onClick={closeModal} className={style.btn}>Cancel</button>
            </div>
            <input type="file" style={{display:'none'}} ref={inputRef} onInput={setProfile}/>
        </div>
    </Overlay>      
  )
}
