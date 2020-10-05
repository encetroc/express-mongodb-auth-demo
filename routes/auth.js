const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidator, loginValidator} = require('../validation')
const User = require('../models/User')

router.post('/register', registerValidator, async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({...req.body, password: hashedPassword})

    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (err) {
        res.status('400').send(err)
    }
})

router.post('/login', loginValidator, async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

    res.header('token', token).send(token)
})

module.exports = router