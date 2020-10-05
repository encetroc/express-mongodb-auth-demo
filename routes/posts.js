const router = require('express').Router()
const {tokenValidator} = require('../validation')

router.get('/', tokenValidator, (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status('400').send(req.user)
    }
})

module.exports = router