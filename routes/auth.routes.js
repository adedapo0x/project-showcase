const router = require('express').Router()
const { logIn, signUp } = require("../controllers/auth.controller");

router.post('/sign-up', signUp)
router.post('/login', logIn)

module.exports = router
 