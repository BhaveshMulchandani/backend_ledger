const express = require('express');
const router = express.Router();
const {authmiddleware} = require('../middleware/auth.middleware')
const accountcontroller = require('../controllers/account.controller')

router.post('/',authmiddleware,accountcontroller.createaccountcontroller)



module.exports = router