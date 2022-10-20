import { useRef, useState } from "react";
import { Cropper, getCroppedImg } from "react-cropper-custom";
import "react-cropper-custom/dist/index.css";
import style from '../style.module.css';

export default function CropImage({ src, appendUrl ,initialZoom = 1, aspect = 1 }) {
    const [zoom, setZoom] = useState(initialZoom)
    const container = useRef()

    const onCropComplete = async ({x, y, width, height}) => {
      if(isNaN(y)) y = 0
      const newUrl = await getCroppedImg(src, {x, y, width, height}, {width, height})
      appendUrl(newUrl)
    }
    
  return (
    <div className={style.slide} ref={container}>
      <Cropper 
        {...{src,aspect, zoom, onCropComplete }}
        onZoomChange={setZoom}
        maxZoom={2}
        minZoom={1}
        width={container.current?.offsetWidth}
        height={container.current?.offsetHeight}
      />
    </div>
  )
}
