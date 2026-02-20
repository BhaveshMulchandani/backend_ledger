const express  = require('express')
const router = express.Router()
const authcontroller  = require('../controllers/auth.controller')



router.post('/register',authcontroller.userregistercontroller)
router.post('/login',authcontroller.userlogincontroller)





module.exports = router