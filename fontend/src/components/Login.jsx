import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './style.css'

export default function Login() {
    const history = useNavigate()
    const [showPwd, setShowPwd] = useState(false)
    const [inputValue, setInputValue] = useState({
        email: '',
        password: ''
    })


    const setValue = e => {
        const { name, value } = e.target
        setInputValue(() => {
            return {
                ...inputValue,
                [name]: value
            }
        })
    }

    const login = async (e) => {
        e.preventDefault()
        const { email, password } = inputValue
        if (!email) {
            toast.warning('Email is required')
        } else if (!email.includes('@')) {
            toast.warning('Email is invalid')
        } else if (!password) {
            toast.warning('Password is required')
        } else if (password.length < 6) {
            toast.warning('Password must be more than 6 characters')
        } else {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputValue)
            })

            const data = await res.json()
            console.log(data)

            if (data.code === 200) {
                toast.success('Login successfully!')
                localStorage.setItem('token', data.elements[0])
                setInputValue({
                    ...inputValue,
                    email: '',
                    password: ''
                })
                setTimeout(() => {
                    history('/dashboard')
                }, 1000)
            } else if (data.code === 400) {
                toast.error(`${data.message}`)
            }
        }
    }

    return (
        <>
            <section>
                <div className="container">
                    <div className="header">
                        <h1 className='heading--1'>Welcome Back</h1>
                        <p>Hi, we are glad you are back, Please login.</p>
                    </div>
                    <form className='form' action="">
                        <div className="form-group">
                            <label htmlFor="email" className="form__label">Email</label>
                            <input type="text" className="form__input" id='email' value={inputValue.email} name='email' onChange={setValue} placeholder='Enter Your Email Address' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form__label">Password</label>
                            <div className="input-wrapper">
                                <input type={showPwd ? 'text' : 'password'} className="form__input" id='password' value={inputValue.password} onChange={setValue} name='password' placeholder='Enter Your Password' />
                                <button type='button' className='form__btn-show' onClick={() => setShowPwd(!showPwd)} >{showPwd ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>

                        <button className='form__btn-login' onClick={login}>Login</button>
                        <p>Don't have an Account ? <Link to={'/register'}>Sign Up</Link></p>
                        <p>Forgot Password ? <Link to={'/forgot-password'}>Click Here</Link></p>
                    </form>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}
