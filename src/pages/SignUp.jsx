import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from 'utils/services';
import img from '../assets/logo.png';
import s from '../styles/Login.SignUp.module.css';

export default function SignUp() {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [userName, setUserName] = useState('')
    const [pw, setPW] = useState('')
    const nav = useNavigate()

    function submitForm(e){
      e.preventDefault()
      signUp(name, userName, email, pw).then(() => nav('/')).catch(err => {
        console.log(err)
      })
    }

  return (
    <div className={s.signup}>
      <div className={s.container}>
        <img src={img} alt="" />
        <p className={s.dis}>Sign up to see photos and videos from your friends.</p>
        <button>Log in with Facebook</button>
        <div className={s.dividor}>
            <div className={s.line}></div>
            <span>OR</span>
            <div className={s.line}></div>
        </div>
        <form onSubmit={e => submitForm(e)} >
            <input type="text" placeholder='Email' onInput={e => {setEmail(e.target.value)}} />
            <input type="text" placeholder='Full Name' onInput={e => {setName(e.target.value)}} />
            <input type="text" placeholder='Username' onInput={e => {setUserName(e.target.value)}} />
            <input type="password" placeholder='Password' onInput={e => {setPW(e.target.value)}} />
        <p>
            People who use our service may have uploaded your contact information to Instagram. Learn More
        </p>
        <p>
            By signing up, you agree to our Terms , Data Policy and Cookies Policy .
        </p>
            <button type="submit" className={s.signbtn} disabled={(!email || !name || !userName || !pw)}>Sign up</button>
        </form>
      </div>
      <div className={s.new}>
        <span>Have an account? </span>
        <Link to='/'>Log in</Link>
      </div>
    </div>
  )
}
