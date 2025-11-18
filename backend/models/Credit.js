const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Credit', creditSchema);
