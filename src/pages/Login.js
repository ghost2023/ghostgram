import s from '../styles/Login.SignUp.module.css'
import bannerImg from '../assets/banner.png'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../userContext'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  function loginSub(e){
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className={s.login}>
      <div className={s.showcase}>
        <img src={bannerImg} alt="" />
      </div>
      <div className={s.ver}>
        <div className={s.container}>
          <img src={logo} alt="" />
          <form action="" onSubmit={e => loginSub(e)}>
            <input type="text" placeholder='Phone number, username, or email' onInput={e => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' onInput={e => setPassword(e.target.value)} />
            <button type="submit" disabled={!email || !password}>Log In</button>
          </form>
          <div className={s.dividor}>
              <div className={s.line}></div>
              <span>OR</span>
              <div className={s.line}></div>
          </div>
          <div className={s.fbbtn}>Log in with Facebook</div>
          <Link to='/reset-password' className={s.reset}>
            <div>Forgot password?</div>
          </Link>
        </div>
        <div className={s.new}>
          <span>Don't have an account?</span>
          <Link to='/signup'>Sign Up</Link>
        </div>
      </div>
    </div>
  )
}
