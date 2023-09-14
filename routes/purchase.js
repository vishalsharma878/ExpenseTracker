const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');


const authenticateMidl = require('../middleware/auth');

router.get('/premiummembership', authenticateMidl.auth, purchaseController.purchasePremimum);

router.post('/purchase/updatestatus', authenticateMidl.auth, purchaseController.updateStatus);

router.get('/premium/check-status', authenticateMidl.auth, purchaseController.checkStatus);

module.exports = router;