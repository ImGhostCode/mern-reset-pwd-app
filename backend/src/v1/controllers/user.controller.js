const { registerAccount, loginAccount, checkValidUser, logoutAccount, sendLink, verifyUser, changePassword } = require("../services/user.service")

module.exports = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, cpassword } = req.body
            const { code, elements, message } = await registerAccount({ name, email, password, cpassword })
            res.status(code).json({ code, elements, message })
        } catch (error) {
            res.status(400).json({ code: 400, message: error.message })
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const { code, elements, message } = await loginAccount({ res, email, password })
            res.status(code).json({ code, elements, message })
        } catch (error) {
            res.status(400).json({ code: 400, message: error.message })
        }
    },
    validUser: async (req, res, next) => {
        try {
            const { code, elements, message } = await checkValidUser({ userId: req.userId })
            res.status(code).json({ code, elements, message })
        } catch (error) {
            res.status(400).json({ code: 400, message: error.message })
        }
    },
    logout: async (req, res, next) => {
        try {
            const { rootUser, token } = req
            const { code, elements, message } = await logoutAccount({ res, rootUser, token })
            res.status(code).json({ code, elements, message })
        } catch (error) {
            res.status(400).json({ code: 400, message: error.message })
        }
    },
    sendResetLink: async (req, res, next) => {
        try {
            const { email } = req.body
            const { code, elements, message } = await sendLink({ email })
            res.status(code).json({ code, elements, message })

        } catch (error) {
            res.status(400).json({ code: 400, message: error.message })
        }
    },
    verifyLink: async (req, res, next) => {
        try {
            const { id, token } = req.params
            const { code, elements, message } = await verifyUser({ id, token })
            res.status(code).json({ code, elements, message })
        } catch (error) {
            res.status(400).json({ code: 400, message: error.message })
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { id, token } = req.params
            const { password } = req.body
            const { code, elements, message } = await changePassword({ id, token, password })
            res.status(code).json({ code, elements, message })
        } catch (error) {
            res.status(400).json({ code: 400, message: error.message })
        }
    }
}