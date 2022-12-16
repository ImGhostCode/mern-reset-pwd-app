import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { LoginContext } from './Context/Context';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { loginData, setLoginData } = useContext(LoginContext)
    const [data, setData] = useState(false)
    const history = useNavigate()

    const dashboardValid = async () => {
        let token = localStorage.getItem('token')

        const res = await fetch('/validuser', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()
        console.log(data)

        if (data.code === 401 || !data) {
            history('/*')
        } else {
            setLoginData(data.elements[0])
            history('/dashboard')
        }
    }

    useEffect(() => {
        setTimeout(() => {
            dashboardValid()
            setData(true)
        }, 1000)
    }, [])

    return (
        <>
            {data ? <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: 'column', height: "90vh" }}>
                <img src="./man.png" alt="man" width={200} />
                <h1 style={{ textAlign: 'center' }}>User Email: {loginData ? loginData.email : ''}</h1>
            </div> : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />&nbsp;
                Loading...
            </Box>}
        </>
    )
}
