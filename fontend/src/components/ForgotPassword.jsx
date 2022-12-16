import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
    const [successMsg, setSuccessMsg] = useState(false)

    const [email, setEmail] = useState('')
    const setValue = e => {
        setEmail(e.target.value)
    }

    const sendData = async (e) => {
        e.preventDefault()
        if (!email) {
            toast.warning('Email is required')
        } else if (!email.includes('@')) {
            toast.warning('Email is invalid')
        } else {
            const res = await fetch('/sendresetlink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await res.json()
            console.log(data)

            if (data.code === 200) {
                toast.success(`${data.message}`)
                setSuccessMsg(true)
                setEmail('')
            } else if (data.code === 400) {
                toast.error(`${data.message}`)
                setSuccessMsg(false)
            }
        }
    }
    return (
        <>
            <section>
                <div className="container">
                    <div className="header">
                        <h1 className='heading--1'>Enter Your Email</h1>
                        {successMsg ? <p style={{ color: 'green', fontWeight: 'bold' }}>Link reset password sent successfully to your email</p> : ''}
                    </div>
                    <form className='form' action="">
                        <div className="form-group">
                            <label htmlFor="email" className="form__label">Email</label>
                            <input type="text" className="form__input" id='email' name='email' value={email} onChange={setValue} placeholder='Enter Your Email Address' />
                        </div>
                        <button className='form__btn-login' onClick={sendData}>Send</button>
                    </form>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}
