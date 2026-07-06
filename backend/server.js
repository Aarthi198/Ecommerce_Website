const path = require('path');
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedProducts = require('./seed/seedProducts');
const { errorHandler, notFound } = require('./middleware/error');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');

dotenv.config({ path: path.resolve(__dirname, '.env') });

connectDB()
  .then(() => seedProducts())
  .catch((error) => console.error('Could not connect to database:', error.message));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Threads & Trinkets API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
