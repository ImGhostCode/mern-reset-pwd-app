const jwt = require('jsonwebtoken')
const _User = require('../models/user.model')

const authenticate = async (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization

        const token = tokenHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)

        const rootUser = await _User.findById(decoded._id)

        if (!rootUser) throw new Error('User not found')

        req.rootUser = rootUser
        req.token = token
        req.userId = rootUser._id

        next()

    } catch (error) {
        res.status(401).json({ code: 401, elements: [], message: 'Invalid token' })
    }
}

module.exports = authenticate