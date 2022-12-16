import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Error from './components/Error'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setData(true)
    }, 500)
  }, [])
  return (
    <>
      {data ?
        <>
          <Header />
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </>
        : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />&nbsp;
          Loading...
        </Box>}
    </>
  )
}

export default App
