const express = require('express');
const router = express.Router();

const resetPaswordController = require('../controllers/reset-password')


router.post('/password/forgotpassword', resetPaswordController.forgotpassword);



module.exports = router;