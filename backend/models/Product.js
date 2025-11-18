const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
    default: 'pcs',
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
  },
  image: {
    type: String,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
