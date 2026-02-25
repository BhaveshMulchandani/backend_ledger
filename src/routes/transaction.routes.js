const express = require('express');
const router = express.Router();
const transactioncontroller = require('../controllers/transaction.controller');
const authmiddleware = require('../middleware/auth.middleware');

router.post('/',authmiddleware.authmiddleware, transactioncontroller.createtransaction)
router.post('/system/initial-funds',authmiddleware.authsystemusermiddleware, transactioncontroller.createinitialfundtransaction)


module.exports = router
