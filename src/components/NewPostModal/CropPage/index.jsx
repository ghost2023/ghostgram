import { useRef, useState } from 'react';
import Arrow from 'svgs/Arrow';
import Chevron from 'svgs/Chevron';
import style from '../style.module.css';
import CropImage from './CropImage';

export default function CropPage({ nextStep, prevStep, imgOriginalUrls, setImgUrls }) {
    const [fileIndex, setFileIndex] = useState(0)
    const [zoomArr, setZoomArr] = useState(1)
    const container = useRef()

    const doneCroping = () => {nextStep()}
    const changeUrl = url => {
        setImgUrls(prev => prev.map((item, ind) => {
            if(ind !== fileIndex) return item
            return url
        }))
    }

    const changeZoom = (zoom) => {
        setZoomArr(prev => prev.map((item, ind) => {
            if(ind !== fileIndex) return item
            return zoom
        }))
    }

  return (
    <div className={style.modal}>
        <div className={style.header}>
            <button onClick={prevStep}><Arrow/></button>
            <h1>Crop</h1>
            <button onClick={doneCroping}>Next</button>
        </div>
        <div className={style.body}>
            <div className={style.crop} ref={container}>
                <div className={style["slider-container"]}>
                    <div className={style.slider} style={{width:`${imgOriginalUrls.length * 100}%`, transform:`translateX(-${container.current?.offsetWidth * fileIndex}px)`}}>
                        {imgOriginalUrls.map((item, i) =>
                            (<CropImage src={item} key={item} alt="" appendUrl={changeUrl} {...{changeZoom}} zoom={zoomArr[i]} />)
                            )}
                    </div>
                </div>
                <div className={style.navbtn}>
                    {fileIndex > 0 &&
                        <button className={style.leftbtn} onClick={e => setFileIndex(p => p - 1)}>
                            <Chevron dxn={'l'}/>
                        </button>
                    }
                    {fileIndex < imgOriginalUrls.length - 1 &&
                        <button className={style.rightbtn} onClick={e => setFileIndex(p => p + 1)}>
                            <Chevron dxn={'r'}/>
                        </button>
                    }
                </div>
                <div className={style.panel}>
                    
                </div>
            </div>
        </div>
    </div>
  )
}
