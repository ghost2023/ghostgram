import { useState } from "react"

export default function useModal(Modal, otherProps = {}, defaultState = false){
    const [isOpen, setIsOpen] = useState(defaultState)
    
    const returnJXS = isOpen ?
                    <Modal closeModal={() => setIsOpen(false)} {...otherProps}/>
                    :null
    
    return[returnJXS, () => setIsOpen(true), () => setIsOpen(false)]
}