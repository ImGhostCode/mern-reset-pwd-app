import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './Header.css'
import { LoginContext } from './Context/Context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { loginData, setLoginData } = useContext(LoginContext)
    const history = useNavigate()

    const logout = async () => {
        const token = localStorage.getItem('token')

        const res = await fetch('/logout', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()
        console.log(data)
        if (data.code === 200) {
            toast.success(`${data.message}`)
            localStorage.removeItem('token')
            setLoginData(false)
            history('/')
        } else {
            toast.error(`${data.message}`)
        }

    }

    const goDashboard = () => {
        history('/dashboard')
    }

    const goError = () => {
        history('*')
    }
    return (
        <>
            <header>
                <nav>
                    <NavLink to={'/'}><h1>IM Ghost Cloud</h1></NavLink>
                    <div className="avt">
                        {loginData ?
                            <Avatar style={{ background: "salmon", fontWeight: "bold", textTransform: "capitalize" }} onClick={handleClick}>{loginData.name[0].toUpperCase()}</Avatar>
                            :
                            <Avatar className='avt-default' onClick={handleClick} />
                        }

                    </div>

                    {loginData ?

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => {
                                goDashboard()
                                handleClose()
                            }}
                            >Profile</MenuItem>
                            <MenuItem onClick={() => {
                                logout()
                                handleClose()
                            }}
                            >Logout</MenuItem>
                        </Menu>
                        :
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => {
                                goError()
                                handleClose()
                            }}>Profile</MenuItem>
                        </Menu>
                    }
                </nav>
            </header>
        </>
    )
}
