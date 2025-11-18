const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Settings = require('./models/Settings');
const Customer = require('./models/Customer');
const sampleProducts = require('./seedProducts');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const sampleCustomers = [
  { name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@example.com', address: 'Shop No. 5, Main Market', totalPurchases: 0, totalCredit: 0 },
  { name: 'Priya Sharma', phone: '9876543211', email: 'priya@example.com', address: 'House No. 12, Gandhi Nagar', totalPurchases: 0, totalCredit: 0 },
  { name: 'Amit Patel', phone: '9876543212', address: 'Flat 201, Sunrise Apartments', totalPurchases: 0, totalCredit: 0 },
  { name: 'Sunita Devi', phone: '9876543213', address: 'Lane 4, Nehru Colony', totalPurchases: 0, totalCredit: 0 },
  { name: 'Vikram Singh', phone: '9876543214', email: 'vikram@example.com', address: 'Plot 15, Sector 7', totalPurchases: 0, totalCredit: 0 },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Settings.deleteMany({});
    await Customer.deleteMany({});

    console.log('Creating admin user...');
    await User.create({
      name: 'Admin',
      email: 'admin@kirana.com',
      password: 'admin123',
    });
    console.log('✓ Admin user created (Email: admin@kirana.com, Password: admin123)');

    console.log('Creating products...');
    await Product.insertMany(sampleProducts);
    console.log(`✓ ${sampleProducts.length} products created across multiple categories`);

    console.log('Creating customers...');
    await Customer.insertMany(sampleCustomers);
    console.log(`✓ ${sampleCustomers.length} customers created`);

    console.log('Creating shop settings...');
    await Settings.create({
      shopName: 'Kirana Store',
      gstNumber: '27AABCU9603R1ZM',
      address: 'Shop No. 123, Main Market, City - 400001',
      phone: '9876543210',
      email: 'shop@kirana.com',
      taxRate: 5,
    });
    console.log('✓ Shop settings created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@kirana.com');
    console.log('   Password: admin123');
    console.log('\n🎉 You can now start the application!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
