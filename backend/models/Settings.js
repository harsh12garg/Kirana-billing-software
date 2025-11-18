const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Shop Information
  shopName: {
    type: String,
    default: 'Kirana Shop',
  },
  gstNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  logo: {
    type: String,
  },
  
  // Tax & Financial Settings
  taxRate: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: '₹',
  },
  currencyPosition: {
    type: String,
    enum: ['before', 'after'],
    default: 'before',
  },
  
  // Bill Settings
  billPrefix: {
    type: String,
    default: 'INV',
  },
  billStartNumber: {
    type: Number,
    default: 1,
  },
  billFooterText: {
    type: String,
    default: 'Thank you for your business!',
  },
  showBillTerms: {
    type: Boolean,
    default: false,
  },
  billTerms: {
    type: String,
  },
  
  // Inventory Settings
  lowStockAlert: {
    type: Number,
    default: 10,
  },
  enableStockAlerts: {
    type: Boolean,
    default: true,
  },
  autoReduceStock: {
    type: Boolean,
    default: true,
  },
  
  // Notification Settings
  emailNotifications: {
    type: Boolean,
    default: false,
  },
  smsNotifications: {
    type: Boolean,
    default: false,
  },
  lowStockNotification: {
    type: Boolean,
    default: true,
  },
  dailyReportEmail: {
    type: Boolean,
    default: false,
  },
  
  // Business Hours
  businessHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean },
  },
  
  // Payment Settings
  acceptCash: {
    type: Boolean,
    default: true,
  },
  acceptCard: {
    type: Boolean,
    default: true,
  },
  acceptUPI: {
    type: Boolean,
    default: true,
  },
  upiId: {
    type: String,
  },
  
  // Receipt Settings
  printAfterSale: {
    type: Boolean,
    default: false,
  },
  receiptPaperSize: {
    type: String,
    enum: ['80mm', '58mm', 'A4'],
    default: '80mm',
  },
  showBarcode: {
    type: Boolean,
    default: true,
  },
  
  // Backup Settings
  autoBackup: {
    type: Boolean,
    default: false,
  },
  backupFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'weekly',
  },
  
  // Display Settings
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  dateFormat: {
    type: String,
    enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
    default: 'DD/MM/YYYY',
  },
  timeFormat: {
    type: String,
    enum: ['12h', '24h'],
    default: '12h',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
