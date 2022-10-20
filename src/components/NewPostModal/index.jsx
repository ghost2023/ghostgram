import useModal from "hooks/useModal";
import { useState } from "react";
import Cross from "svgs/Cross";
import Overlay from "../Overlay";
import CropPage from "./CropPage";
import DiscardModal from "./DiscardModal";
import FinalPage from "./FinalPage";
import InitialPage from "./InitialPage";
import style from './style.module.css';

export default function NewPost({ closeModal }) {
  const [step, setStep] = useState(0)
  const [discardModalAction, setDicardModalAction] = useState([closeModal])
  const [discardModal, openDiscardModal] = useModal(DiscardModal, {onClick: discardModalAction[0]})
  const [imgOriginalUrls, setOriginalImgUrls] = useState([])
  const [imgUrls, setImgUrls] = useState([])
  const pages = [
    <InitialPage {...{nextStep, setOriginalImgUrls, setImgUrls }} />, 
    <CropPage {...{ nextStep, prevStep, imgOriginalUrls, imgUrls, setImgUrls }}/>, 
    <FinalPage {...{prevStep, closeModal, imgUrls }}/>
  ]

  function prevStep(){
    if(step > 1) return setStep(prev => prev - 1)
    openDiscardModal()
    setDicardModalAction([
      () => {
        setImgUrls([]);
        setOriginalImgUrls([])
        setStep(0);
        setDicardModalAction([closeModal])
      }
    ])
  }
  function nextStep(){
    setStep(prev => prev + 1)
  }
  
  return (
    <Overlay onClick={step > 0 ?openDiscardModal: closeModal}>
      <div onClick={e => e.stopPropagation()}>
        {pages[step]}
        {discardModal}
      </div>
      <button className={style.closebtn}><Cross/></button>
    </Overlay>
  )
}
