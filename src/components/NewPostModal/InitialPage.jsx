import { useRef, useState } from 'react';
import style from './style.module.css';
import UploadSVG from "./UploadSvg";

export default function InitialPage({ nextStep, setOriginalImgUrls, setImgUrls }) {
  const fileInput = useRef()
  const [rejectedFile, setRejectedFile] = useState()
  const [err, setErr] = useState(false)

  const onFileInput = e => {
    setErr(false)
    setRejectedFile()
    const files = e.target.files
    for(const file of files){
      if(!file.type.startsWith("image/") && !file.type.startsWith("video/")){
        setErr(true)
        setRejectedFile(file.name)
        return
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImgUrls(prev => [...prev, e.target.result]);
        setImgUrls(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file);
    }
    nextStep()
  }

  return (
    <div className={style.modal}>
      <div className={style.header}>
        <h1>
          Create new post
        </h1>
      </div>
      <div className={`${style.body} ${style.start}`}>
        <div className={style.empty}>
          <UploadSVG {...{err}}/>
          <h2>
            {err?<>This file is not supported
            </>:<>Drag photos and videos here</>}
          </h2>
          {err && 
          <p><span>{rejectedFile}</span> could not be uploaded</p>}
          <div className={style["upload-container"]}>
            <button onClick={() => fileInput.current.click()}>
              {err? <>Select other files</> : <>Select from computer</>}
            </button>
            <input 
              type="file" 
              ref={fileInput} 
              onInput={onFileInput} 
              accept="image/*, videos/*" 
              multiple 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
