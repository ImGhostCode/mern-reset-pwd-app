import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [showPwd, setShowPwd] = useState(false)
    const [inputValue, setInputValue] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: ''
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

    const register = async (e) => {
        e.preventDefault()
        const { name, email, password, cpassword } = inputValue
        if (!name) {
            toast.warning('Name is required')
        } else if (!email) {
            toast.warning('Email is required')
        } else if (!email.includes('@')) {
            toast.warning('Email is invalid')
        } else if (!password) {
            toast.warning('Password is required')
        } else if (password.length < 6) {
            toast.warning('Password must be more than 6 characters')
        } else if (password !== cpassword) {
            toast.warning('Password and Confirm Password not matching!')
        } else {
            const res = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputValue)
            })

            const data = await res.json()
            console.log(data)

            if (data.code === 201) {
                toast.success('Register successfully!')
                setInputValue({
                    ...inputValue,
                    name: '',
                    email: '',
                    password: '',
                    cpassword: ''
                })
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
                        <h1 className='heading--1'>Sign Up</h1>
                        <p>We are glad that you will be using Project Cloud to manage <br />
                            your tasks! We hope that you will get like it.</p>
                    </div>
                    <form className='form' action="">
                        <div className="form-group">
                            <label htmlFor="name" className="form__label">Name</label>
                            <input onChange={setValue} type="text" className="form__input" id='name' name='name' value={inputValue.name} placeholder='Enter Your Name' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form__label">Email</label>
                            <input onChange={setValue} type="text" className="form__input" id='email' name='email' value={inputValue.email} placeholder='Enter Your Email Address' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form__label">Password</label>
                            <div className="input-wrapper">
                                <input onChange={setValue} type={showPwd ? 'text' : 'password'} name='password' value={inputValue.password} className="form__input" id='password' placeholder='Enter Your Password' />
                                <button type='button' className='form__btn-show' onClick={() => setShowPwd(!showPwd)} >{showPwd ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cpassword" className="form__label">Confirm Password</label>
                            <input onChange={setValue} type={showPwd ? 'text' : 'password'} name='cpassword' value={inputValue.cpassword} className="form__input" id='cpassword' placeholder='Enter Confirm Password' />
                        </div>

                        <button className='form__btn-login' onClick={register}>Sign up</button>
                        <p>Already have an Account ? <Link to={'/'}>Login</Link></p>
                    </form>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}
