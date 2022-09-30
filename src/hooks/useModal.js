import { useState } from "react"

export default function useModal(Modal, defaultState = false, otherProps = {}){
    const [isOpen, setIsOpen] = useState(defaultState)
    
    const returnJXS = isOpen ?
                    <Modal closeModal={() => setIsOpen(false)} {...otherProps}/>
                    :null
    
    return[() => setIsOpen(true), () => setIsOpen(false) ,returnJXS]
}