const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const sendEmail = require('../config/nodemailer');

const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  const orderItems = await Promise.all(items.map(async (item) => {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error('One or more order items are invalid');
    }

    return {
      product: product._id,
      quantity: item.quantity,
      price: product.salePrice || product.price,
    };
  }));

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Determine payment status based on payment method
  let paymentStatus = 'pending';
  if (paymentMethod === 'cod') {
    paymentStatus = 'cod';
  }

  const order = await Order.create({
    user: req.user ? req.user._id : undefined,
    items: orderItems,
    shippingAddress: {
      ...shippingAddress,
      email: shippingAddress.email || req.user?.email,
    },
    paymentMethod,
    paymentStatus,
    deliveryStatus: 'Pending',
    totalPrice,
  });

  let user = null;
  if (req.user) {
    user = await User.findById(req.user._id);
    if (user) {
      user.cart = [];
      await user.save();
    }
  }

  const customerName = user?.name || shippingAddress.name || 'Customer';
  const emailBody = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your purchase, ${customerName}!</p>
    <p>Order ID: ${order._id}</p>
    <p>Total: ₹${totalPrice.toFixed(2)}</p>
    <p>We will notify you when your order ships.</p>
  `;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS && user?.email) {
    await sendEmail({
      to: user.email,
      subject: 'Your Threads & Trinkets Order Confirmation',
      html: emailBody,
      text: `Thank you for your purchase. Order ID: ${order._id}. Total: ₹${totalPrice.toFixed(2)}`,
    }).catch((error) => console.error('Order email error:', error));
  }

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name price images');
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'name price images');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(order);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate('items.product', 'name price');
  res.json(orders);
};

const VALID_DELIVERY_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Out For Delivery',
  'Delivered',
];

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const { deliveryStatus, paymentStatus, status } = req.body;

  if (deliveryStatus) {
    if (!VALID_DELIVERY_STATUSES.includes(deliveryStatus)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }
    order.deliveryStatus = deliveryStatus;
  }
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  if (status) {
    order.status = status;
  }
  
  await order.save();
  res.json(order);
};

const getAdminStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const revenueResult = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;
  const pendingOrders = await Order.countDocuments({ deliveryStatus: 'Pending' });
  const totalCustomers = await User.countDocuments({ role: { $in: ['customer', 'user'] } });

  res.json({
    totalOrders,
    totalRevenue,
    pendingOrders,
    totalCustomers,
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
};
