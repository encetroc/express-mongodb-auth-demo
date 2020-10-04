const Joi = require('@hapi/joi')
const User = require('./models/User')

const registerValidator = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    try {
        await schema.validateAsync(req.body)
        const emailExists = await User.findOne({email: req.body.email})
        if (emailExists) return res.status('400').send('email already exists')
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
    } catch (error) {
        return res.status('400').send(error.details[0].message)
    }
    next()
}

module.exports.registerValidator = registerValidator
module.exports.loginValidator = loginValidator