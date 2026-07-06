const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    email: String,
    phoneNumber: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cod'],
    default: 'card',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cod'],
    default: function() {
      return this.paymentMethod === 'cod' ? 'cod' : 'pending';
    },
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered'],
    default: 'Pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
