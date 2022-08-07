import { push, ref as dbRef, set } from 'firebase/database';
import { ref, uploadBytes } from 'firebase/storage';
import { useRef, useState } from "react";
import { DB, SG } from '../fb-config';
import s from '../styles/NewPost.module.css';
import { useAuth } from '../userContext';
import Overlay from "./Overlay";
import Arrow from './svgs/Arrow';
import Chevron from './svgs/Chevron';

export default function NewPost({ closeNewPost }) {
  const [isFilesValid, setFilesValidity] = useState(true)
  const [firstInValidFile, setFirstInValid] = useState("")
  const [validFiles, setValidFiles] = useState([])
  const [pageNum, setPageNum] = useState(0)
  const [hideStats, setHideStats] = useState(false)
  const [noComment, setNoComment] = useState(false)
  const [caption, setCaption] = useState("")
  const { user } = useAuth()
  const numberOfPage = 2

  function upload(){
    const fileNames = []
    Array.from(validFiles).forEach(f => {
      const fileName = `posts/images/${Date.now()}.jpg`
      fileNames.push(fileName)
      const stRef = ref(SG, fileName)
      uploadBytes(stRef, f)
    });
    const newPostRef = push(dbRef(DB, 'posts/'))
    set(newPostRef, {
      user: user.uid,
      caption,
      content: fileNames,
      hideStats,
      noComment,
      timeStamp: Date.now()
    }).then(() => closeNewPost())
  }

  function fileImport(e, isDrop = false){
    e.preventDefault();
    e.stopPropagation()
    const files = isDrop? e.dataTransfer.files : e.target.files
    console.log(files)
    const isAllfilesValid = Array.from(files).every(i => i.type.split('/')[0] === 'image' || i.type.split('/')[0] === 'video')
    setFilesValidity(isAllfilesValid)
    if(!isAllfilesValid) {
      const firstInvalid = Array.from(files).find(i => i.type.split('/')[0] !== 'image' || i.type.split('/')[0] !== 'video')
      setFirstInValid(firstInvalid.name)
      return
    }
    setValidFiles(files)
  }

  return (
    <Overlay onClick={closeNewPost}>
      <div className={s.portal} onClick={e => e.stopPropagation()}>
          <div className={s.header}>
            {!!validFiles.length && <div className={s.prevbtn}><Arrow/></div>}
            <p>{isFilesValid? "Create new post" : "File couldn't be uploaded"}</p>
            {!!validFiles.length && <div className={s.nextbtn}>
              <button onClick={upload}>Share</button>
            </div>}
          </div>
          {validFiles.length ? 
            <SharePage files={Array.from(validFiles)} {...{setCaption, setHideStats, setNoComment, hideStats, noComment}}/>:
            <InitialPage isValid={isFilesValid} fileImport={fileImport} invalidFile={firstInValidFile}/>
          }
      </div>
      <CloseBtn/>
    </Overlay>
)
}
function InitialPage({ isValid, fileImport, invalidFile}){
  const inpRef = useRef(0)

  return(
    <div className={`${s.body} ${s.empty}`} onDrop={e => fileImport(e, true)} onDragOver={e => {e.preventDefault();e.dataTransfer.dropEffect = 'copy'}}>
      <UploadSVG err={!isValid}/>
      <div className={s.info}>
        <h1>{isValid ? "Drag photos and videos here" : "This file is not supported"}</h1>
        {isValid || <p className={s.errmsg}><span>{invalidFile}</span> could not be uploaded.</p>}
      </div>
      <input type="file" ref={inpRef} name="files" multiple onChange={fileImport}/>
      <button className={s.select} type="file" onClick={() => {inpRef.current.click()}}>Select
{isValid? " from computer" : " other files"}</button>
    </div>
  )
}
function SharePage({ files, setCaption, setNoComment, setHideStats, hideStats, noComment }){
  const [isAccessExpanded, setAccessExpanded] = useState(false)
  const [isAdvanceExpanded, setAdvanceExpanded] = useState(false)
  const { user } = useAuth();


  return(
    <div className={s.share}>
      <div className={s.preview}>
        {files.length === 1 ? <div className={s.image}><img src={URL.createObjectURL(files[0])} alt="" /></div>:<></>}
      </div>
      <div className={s.settings}>
        <div className={s.profile}>
          <div className={s.profileicon}><img src={user.profile} alt="" /></div>
          <div className={s.profilename}>{user.username}</div>
        </div>
        <textarea name="" id="" cols="30" rows="10" className={s.caption} placeholder="Write a caption..." onInput={e => setCaption(e.target.value)}></textarea>
        <div className={s["location-wrapper"]}></div>
        <div className={s["accessibility-wrapper"]}>
          <div className={`${s.expander} ${isAccessExpanded && s.expanded}`} onClick={() => setAccessExpanded(prev => !prev)}>
            <h2>Accessibility</h2>
            <Chevron />
          </div>
          {isAccessExpanded && <div className={`${s.accessibilty} ${s.expand}`}>
            <p>Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can choose to write your own.</p>
            {files.map(i => {
              return (<p key={i.lastModified}>{i.name}</p>)
            })}
          </div>}
        </div>
        <div className={s["advance-wrapper"]}>
          <div className={`${s.expander} ${isAdvanceExpanded && s.expanded}`} onClick={() => setAdvanceExpanded(prev => !prev)}>
            <h2>Advanced settings</h2>
            <Chevron/>
          </div>
          {isAdvanceExpanded && <div className={`${s.advance} ${s.expand}`}>
            <div className={s['advance-setting']}>
              <div className={s['setting-wrapper']}>
                <h1>Hide like and view counts on this post</h1>
                <div className={s['toggle-wrapper']}>
                  <div className={`${s.toggle} ${hideStats? s.checked : ''}`} onClick={() => setHideStats(p => !p)}><span></span></div>
                </div>
              </div>
              <p>Only you will see the total number of likes and views on this post. You can change this later by going to the ··· menu at the top of the post. To hide like counts on other people's posts, go to your account settings.</p>
            </div>
            <div className={s['advance-setting']}>
              <div className={s['setting-wrapper']}>
                <h1>Turn off commenting</h1>
                <div className={s['toggle-wrapper']}>
                  <div className={`${s.toggle} ${noComment? s.checked : ''}`} onClick={() => setNoComment(p => !p)}><span></span></div>
                </div>
              </div>
              <p>You can change this later by going to the ··· menu at the top of your post.</p>
            </div>
            
          </div>}
        </div>
      </div>
    </div>
  )

}
function UploadSVG({ err }){
  if (err) return (
    <svg aria-label="Icon to represent media such as images or videos" height="96" role="img" viewBox="0 0 96 96" width="96">
      <path d="M48 0c26.5 0 48 21.5 48 48S74.5 96 48 96 0 74.5 0 48 21.5 0 48 0zm0 2C22.6 2 2 22.6 2 48s20.6 46 46 46 46-20.6 46-46S73.4 2 48 2zm0 57.8c3.4 0 6.1 2.7 6.1 6.1 0 3.4-2.7 6.1-6.1 6.1s-6.1-2.7-6.1-6.1c0-3.3 2.7-6.1 6.1-6.1zm0 2c-2.3 0-4.1 1.8-4.1 4.1S45.7 70 48 70s4.1-1.8 4.1-4.1c0-2.2-1.8-4.1-4.1-4.1zM48 23c3.5 0 6.4 2.8 6.1 6.2l-1.6 22.5c-.2 2.3-2.2 4-4.5 4-2.4 0-4.4-1.7-4.5-4l-1.6-22.5c-.3-3.4 2.6-6.2 6.1-6.2zm0 2c-2.4 0-4.3 1.9-4.1 4l1.6 22.5c.1 1.2 1.2 2.1 2.5 2.1s2.4-.9 2.5-2.1L52.1 29c.2-2.1-1.7-4-4.1-4z"></path>
    </svg>)
  return (
    <svg aria-label="Icon to represent media such as images or videos" height="77" role="img" viewBox="0 0 97.6 77.3" width="96">
      <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path>
      <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
      <path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
  </svg>)
}
function CloseBtn(){
  return (
    <svg className={s.close} viewBox="0 0 48 48" width="48" height="48" >
      <title>Close</title>
      <path clipRule="evenodd" d="M41.8 9.8L27.5 24l14.2 14.2c.6.6.6 1.5 0 2.1l-1.4 1.4c-.6.6-1.5.6-2.1 0L24 27.5 9.8 41.8c-.6.6-1.5.6-2.1 0l-1.4-1.4c-.6-.6-.6-1.5 0-2.1L20.5 24 6.2 9.8c-.6-.6-.6-1.5 0-2.1l1.4-1.4c.6-.6 1.5-.6 2.1 0L24 20.5 38.3 6.2c.6-.6 1.5-.6 2.1 0l1.4 1.4c.6.6.6 1.6 0 2.2z" fillRule="evenodd"></path>
    </svg>
  )
}