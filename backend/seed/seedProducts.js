const path = require('path');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const productsPath = path.resolve(__dirname, '../data/products.json');
      const products = require(productsPath);
      await Product.insertMany(products);
      console.log('Seeded product catalog into MongoDB.');
    }

    const adminEmail = 'admin@admin.com';
    const legacyAdminEmail = 'admin@threadsandtrinkets.com';
    const adminPassword = 'Admin@123';

    let adminUser = await User.findOne({
      $or: [{ email: adminEmail }, { email: legacyAdminEmail }, { role: 'admin' }],
    });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      adminUser = await User.create({
        name: 'Store Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Created default admin user: ${adminEmail}`);
    } else {
      if (adminUser.email !== adminEmail) {
        adminUser.email = adminEmail;
        adminUser.role = 'admin';
        await adminUser.save();
        console.log(`Updated admin email to: ${adminEmail}`);
      }
    }
  } catch (error) {
    console.error('Failed to seed products:', error.message);
  }
};

module.exports = seedProducts;
