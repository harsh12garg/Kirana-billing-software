const Credit = require('../models/Credit');
const Customer = require('../models/Customer');

// @desc    Get all credits
// @route   GET /api/credits
// @access  Private
const getCredits = async (req, res) => {
  try {
    const credits = await Credit.find({})
      .populate('customer')
      .populate('bill')
      .sort({ createdAt: -1 });
    res.json(credits);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create credit
// @route   POST /api/credits
// @access  Private
const createCredit = async (req, res) => {
  try {
    const credit = await Credit.create(req.body);
    res.status(201).json(credit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update credit (mark as paid)
// @route   PUT /api/credits/:id
// @access  Private
const updateCredit = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    
    if (credit) {
      if (req.body.isPaid && !credit.isPaid) {
        credit.isPaid = true;
        credit.paidDate = new Date();
        
        // Update customer total credit
        const customer = await Customer.findById(credit.customer);
        if (customer) {
          customer.totalCredit -= credit.amount;
          await customer.save();
        }
      }
      
      Object.assign(credit, req.body);
      await credit.save();
      
      res.json(credit);
    } else {
      res.status(404).json({ message: 'Credit not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCredits,
  createCredit,
  updateCredit,
};
