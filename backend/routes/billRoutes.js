const express = require('express');
const router = express.Router();
const { getBills, getBillById, createBill } = require('../controllers/billController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getBills)
  .post(protect, createBill);

router.get('/:id', protect, getBillById);

module.exports = router;
