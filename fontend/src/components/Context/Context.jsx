import React, { createContext, useState } from 'react'

export const LoginContext = createContext('')

export default function Context({ children }) {
    const [loginData, setLoginData] = useState('')
    return (
        <>
            <LoginContext.Provider value={{ loginData, setLoginData }}>
                {children}
            </LoginContext.Provider>
        </>
    )
}
