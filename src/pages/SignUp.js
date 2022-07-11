import s from '../styles/SignUp.module.css'
import img from '../assets/logo.png';
import { Link } from 'react-router-dom'
import { useState } from 'react';

export default function SignUp() {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [uName, setUName] = useState('')
    const [pw, setPW] = useState('')

    function submitForm(){

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
        <form action="" method='POST'>
            <input type="text" placeholder='Mobile Number or Email' onInput={e => {setEmail(e.target.value)}} />
            <input type="text" placeholder='Full Name' onInput={e => {setName(e.target.value)}} />
            <input type="text" placeholder='Username' onInput={e => {setUName(e.target.value)}} />
            <input type="password" placeholder='Password' onInput={e => {setPW(e.target.value)}} />
        <p>
            People who use our service may have uploaded your contact information to Instagram. Learn More
        </p>
        <p>
            By signing up, you agree to our Terms , Data Policy and Cookies Policy .
        </p>
            <button type="submit" disabled={(email == '' || name == '' || uName == '' || pw == '')} onSubmit={e => console.log(e)} >Sign up</button>
        </form>
      </div>
      <div className={s.new}>
        <span>Have an account? </span>
        <Link to='/login'>Log in</Link>
      </div>
    </div>
  )
}
