import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function ResetPassword() {

    const [successMsg, setSuccessMsg] = useState(false)
    const [dataUser, setDataUser] = useState(false)
    const history = useNavigate()
    const { id, token } = useParams()

    const [password, setPassword] = useState('')
    const setValue = e => {
        setPassword(e.target.value)
    }

    const verifyUser = async () => {
        const res = await fetch(`/forgot-password/${id}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()

        if (data.code === 200) {
            setDataUser(true)
        } else {
            history('*')
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()

        if (!password) {
            toast.warning('Password is required')
        } else if (password.length < 6) {
            toast.warning('Password must be more than 6 characters')
        } else {
            const res = await fetch(`/reset-password/${id}/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
            })

            const data = await res.json()
            console.log(data)

            if (data.code === 200) {
                setSuccessMsg(true)
                setPassword('')
                setTimeout(() => {
                    history('/')
                }, 1000)
            } else {
                toast.error(data.message)
            }
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])
    return (
        <>
            {dataUser ? (
                <>
                    <section>
                        <div className="container">
                            <div className="header">
                                <h1 className='heading--1'>Enter New Password</h1>
                                {successMsg ? <p style={{ color: 'green', fontWeight: 'bold' }}>Password updated</p> : ''}
                            </div>
                            <form className='form' action="">
                                <div className="form-group">
                                    <label htmlFor="password" className="form__label">New Password</label>
                                    <input type="password" className="form__input" id='new-password' name='password' onChange={setValue} value={password} placeholder='Enter Your New Password' />
                                </div>
                                <button className='form__btn-login' onClick={resetPassword}>Send</button>
                                <Link to='/' className="form__btn-back">Back home</Link>

                            </form>
                        </div>
                    </section>
                </>
            )
                : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />&nbsp;
                    Loading...
                </Box>
            }
            <ToastContainer />
        </>
    )
}
