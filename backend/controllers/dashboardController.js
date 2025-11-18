const Product = require('../models/Product');
const Bill = require('../models/Bill');
const Customer = require('../models/Customer');
const Credit = require('../models/Credit');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Total products
    const totalProducts = await Product.countDocuments();
    
    // Low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });
    
    // Today's sales
    const todayBills = await Bill.find({
      createdAt: { $gte: today }
    });
    const todaySales = todayBills.reduce((sum, bill) => sum + bill.finalAmount, 0);
    
    // Monthly sales
    const monthlyBills = await Bill.find({
      createdAt: { $gte: startOfMonth }
    });
    const monthlySales = monthlyBills.reduce((sum, bill) => sum + bill.finalAmount, 0);
    
    // Monthly sales chart data (last 30 days)
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayBills = await Bill.find({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      const daySales = dayBills.reduce((sum, bill) => sum + bill.finalAmount, 0);
      
      last30Days.push({
        date: date.toISOString().split('T')[0],
        sales: daySales
      });
    }
    
    // Best selling products
    const allBills = await Bill.find({}).populate('items.product');
    const productSales = {};
    
    allBills.forEach(bill => {
      bill.items.forEach(item => {
        const productId = item.product?._id?.toString();
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = {
              product: item.product,
              totalQuantity: 0,
              totalRevenue: 0
            };
          }
          productSales[productId].totalQuantity += item.quantity;
          productSales[productId].totalRevenue += item.total;
        }
      });
    });
    
    const bestSelling = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);
    
    // Total customers
    const totalCustomers = await Customer.countDocuments();
    
    // Pending credits
    const pendingCredits = await Credit.find({ isPaid: false });
    const totalPendingCredit = pendingCredits.reduce((sum, credit) => sum + credit.amount, 0);
    
    res.json({
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      todaySales,
      monthlySales,
      salesChart: last30Days,
      bestSelling,
      totalCustomers,
      totalPendingCredit,
      pendingCreditsCount: pendingCredits.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
