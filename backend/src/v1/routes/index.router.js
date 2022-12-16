const { Router } = require('express')
const { register, login, validUser, logout, sendResetLink, verifyLink, resetPassword } = require('../controllers/user.controller')
const authenticate = require('../middlewares/auth.middleware')
const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/validuser', authenticate, validUser)
router.get('/logout', authenticate, logout)
router.post('/sendresetlink', sendResetLink)
router.get('/forgot-password/:id/:token', verifyLink)
router.post('/reset-password/:id/:token', resetPassword)
module.exports = router