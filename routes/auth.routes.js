const router = require('express').Router()
const signUp = require('../controllers/auth.controller')

router.post('/sign-up', signUp)


module.exports = signUp