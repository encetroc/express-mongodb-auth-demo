const Joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')

const registerValidator = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    try {
        await schema.validateAsync(req.body)
        const user = await User.findOne({email: req.body.email})
        if (user) return res.status('400').send('email already exists')
    } catch (error) {
        return res.status('400').send(error.details[0].message)
    }
    next()
}

const loginValidator = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    try {
        await schema.validateAsync(req.body)
        const user = await User.findOne({email: req.body.email})
        if (!user) return res.status('400').send('incorrect email or password')
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordValid) return res.status('400').send('incorrect password or email')
    } catch (error) {
        return res.status('400').send(error.details[0].message)
    }
    next()
}

const tokenValidator = (req, res, next) => {
    const token = req.header('token')
    if (!token) return res.status('401').send('access denied')
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded
        next()
    } catch (err) {
        res.status('400').send('invalid token')
    }
}

module.exports.registerValidator = registerValidator
module.exports.loginValidator = loginValidator
module.exports.tokenValidator = tokenValidator