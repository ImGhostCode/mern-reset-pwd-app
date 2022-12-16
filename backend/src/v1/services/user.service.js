const _User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

const { PORT_CLIENT, TOKEN_SECRET, EMAIL, PASS } = process.env


module.exports = {
    registerAccount: async ({ name, email, password, cpassword }) => {
        if (!name || !email || !password || !cpassword) {
            return {
                code: 400,
                elements: [],
                message: "Fill all the details"
            }
        }

        const user = await _User.findOne({ email })
        if (user) {
            return {
                code: 400,
                elements: [],
                message: 'Email is already exist'
            }
        }
        if (password !== cpassword) {
            return {
                code: 400,
                elements: [],
                message: 'Password and Confirm password not match'
            }
        }

        const newUser = new _User({ name, email, password, cpassword })
        return {
            code: 201,
            elements: [{ newUser: await newUser.save() }],
            message: 'New user is created'
        }

    },

    loginAccount: async ({ res, email, password }) => {
        if (!email || !password) {
            return {
                code: 400,
                elements: [],
                message: "Fill all the details"
            }
        }

        const user = await _User.findOne({ email })
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return {
                    code: 400,
                    elements: [],
                    message: "Invalid credential"
                }
            }

            const token = await user.generateAuthToken()
            res.cookie('token', token, { expires: new Date(Date.now() + 9000000), httpOnly: true })
            return {
                code: 200,
                elements: [token, user],
                message: ''
            }
        }

        return {
            code: 400,
            elements: [],
            message: "Invalid credential"
        }

    },
    checkValidUser: async ({ userId }) => {
        const user = await _User.findOne({ _id: userId })
        if (user) {
            return {
                code: 200,
                elements: [user],
                message: ''
            }
        }
        return {
            code: 400,
            elements: [],
            message: 'User not found'
        }
    },

    logoutAccount: async ({ res, rootUser, token }) => {
        rootUser.tokens = rootUser.tokens.filter(item => item.token !== token)

        res.clearCookie('token', { path: '/' })

        await rootUser.save()

        return {
            code: 200,
            elements: [],
            message: 'Logout successful'
        }
    },
    sendLink: async ({ email }) => {
        if (!email) {
            return {
                code: 400,
                elements: [],
                message: 'Enter your email'
            }
        }

        const user = await _User.findOne({ email })

        if (!user) return {
            code: 400,
            elements: [],
            message: 'Email not found'
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '120s' })

        const setUserToken = await _User.findByIdAndUpdate({ _id: user._id }, { verifyToken: token }, { new: true })

        if (setUserToken) {

            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: EMAIL,
                    pass: PASS,
                },
            });


            const mailOptions = {
                from: EMAIL, // sender address
                to: email, // list of receivers
                subject: "Password Reset", // Subject line
                text: `This link valid for 2 minutes http://localhost:${PORT_CLIENT}/reset-password/${user._id}/${setUserToken.verifyToken}`, // plain text body
            }
            let info = await transporter.sendMail(mailOptions);

            return {
                code: 200,
                elements: [{ Url: nodemailer.getTestMessageUrl(info) }],
                message: 'Email sent successfully'
            }
        }
    },
    verifyUser: async ({ id, token }) => {
        const user = await _User.findOne({ _id: id, verifyToken: token })
        const decoded = jwt.verify(token, TOKEN_SECRET)

        if (user && decoded._id) return {
            code: 200,
            elements: [user],
            message: ''
        }
        else return {
            code: 400,
            elements: [],
            message: 'User not found'
        }
    },
    changePassword: async ({ id, token, password }) => {
        const user = await _User.findOne({ _id: id, verifyToken: token })
        const decoded = jwt.verify(token, TOKEN_SECRET)

        if (user && decoded._id) {
            const newPassHashed = await bcrypt.hash(password, 12)

            const userPassUpdated = await _User.findByIdAndUpdate({ _id: id }, { password: newPassHashed })
            return {
                code: 200,
                elements: [userPassUpdated],
                message: ''
            }
        }
        else return {
            code: 400,
            elements: [],
            message: 'User not found'
        }
    },


} 