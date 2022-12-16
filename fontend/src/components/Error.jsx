import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Error() {
    return (
        <>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    minHeight: '85vh',
                    alignItems: 'center',
                }}>
                    <img src="/404.svg" alt="error" width={500} style={{ maxWidth: '100%' }} />
                    <h2 style={{ marginTop: '48px' }}>PAGE NOT FOUND</h2>
                    <NavLink to={'/'}>Back to home page</NavLink>
                </div>
            </div>
        </>
    )
}
