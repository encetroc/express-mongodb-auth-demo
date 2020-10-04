const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {registerValidator} = require('../validation')
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

module.exports = router