const express = require('express');
const router = express.Router();

const resetPaswordController = require('../controllers/reset-password');


router.post('/password/forgotpassword', resetPaswordController.forgotpassword);

router.get('/password/resetpassword/:id', resetPaswordController.resetpassword);

router.get('/password/updatepassword/:id', resetPaswordController.updatepassword);



module.exports = router;