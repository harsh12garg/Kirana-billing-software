const express = require('express');
const router = express.Router();
const { getCredits, createCredit, updateCredit } = require('../controllers/creditController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCredits)
  .post(protect, createCredit);

router.put('/:id', protect, updateCredit);

module.exports = router;
