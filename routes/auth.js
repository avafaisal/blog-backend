const express = require('express')
const router = express.Router()

const User = require('../controllers/User');

router.post('/register', User.registerUser)
router.post('/login', User.loginUser)

module.exports = router