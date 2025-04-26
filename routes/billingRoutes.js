const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.get('/', billingController.getAllBillingDetails);
router.get('/:id', billingController.getBillingDetailsById);
router.post('/', billingController.createBillingDetails);
router.put('/:id', billingController.updateBillingDetails);
router.delete('/:id', billingController.deleteBillingDetails);

module.exports = router;