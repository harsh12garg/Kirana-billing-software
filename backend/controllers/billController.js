const Bill = require('../models/Bill');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Credit = require('../models/Credit');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({}).populate('items.product').sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Private
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('items.product');
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create bill
// @route   POST /api/bills
// @access  Private
const createBill = async (req, res) => {
  try {
    const { customer, items, subtotal, tax, discount, finalAmount, paymentMethod, isCredit } = req.body;

    // Generate bill number
    const lastBill = await Bill.findOne().sort({ createdAt: -1 });
    const billNumber = lastBill 
      ? `BILL${String(parseInt(lastBill.billNumber.replace('BILL', '')) + 1).padStart(6, '0')}`
      : 'BILL000001';

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Update or create customer
    let customerId = customer.customerId;
    if (customer.phone) {
      let customerDoc = await Customer.findOne({ phone: customer.phone });
      if (!customerDoc) {
        customerDoc = await Customer.create({
          name: customer.name,
          phone: customer.phone,
        });
      }
      customerDoc.totalPurchases += finalAmount;
      if (isCredit) {
        customerDoc.totalCredit += finalAmount;
      }
      await customerDoc.save();
      customerId = customerDoc._id;
    }

    const bill = await Bill.create({
      billNumber,
      customer: {
        ...customer,
        customerId,
      },
      items,
      subtotal,
      tax,
      discount,
      finalAmount,
      paymentMethod,
      isCredit,
    });

    // Create credit record if it's a credit sale
    if (isCredit && customerId) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // Default 30 days due date

      await Credit.create({
        customer: customerId,
        bill: bill._id,
        amount: finalAmount,
        dueDate: dueDate,
        isPaid: false,
        notes: `Credit sale - Bill ${billNumber}`,
      });
    }

    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBills,
  getBillById,
  createBill,
};
