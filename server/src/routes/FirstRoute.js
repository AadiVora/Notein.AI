const express = require('express')
const RegisterUser = require('../controllers/RegisterUser.js')
const LoginUser = require('../controllers/LoginUser.js')

const router = express.Router();

router.post('/register', RegisterUser)
router.post('/login', LoginUser)


module.exports  = router