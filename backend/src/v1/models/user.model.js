const { Schema, model } = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    verifyToken: {
        type: String
    }
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET, { expiresIn: '120s' })
        this.tokens = this.tokens.concat({ token })

        await this.save()
        return token
    } catch (error) {
        return res.status(400).json({ code: 400, message: error.message })
        // next(error)
    }
}

const _User = model('users', userSchema)

module.exports = _User