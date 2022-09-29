import NavBar from 'components/NavBar'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import style from './AccountSettings.module.css'
import Edit from './Edit'
import PasswordReset from './PasswordReset'

export default function AccountSettings() {
  const {pathname} = useLocation()

  useEffect(() => {
    
  }, [pathname])

  return (
    <div className={style.page}>
      <NavBar/>
      {pathname === '/accounts/edit' ?
        <Edit />:
        <PasswordReset/>  
      }
    </div>
  )
}
