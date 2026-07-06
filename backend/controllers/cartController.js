const User = require('../models/User');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product', 'name price images stock');
  res.json(user.cart || []);
};

const addCartItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingItem = user.cart.find((item) => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
  } else {
    user.cart.push({ product: productId, quantity: Math.min(quantity, product.stock) });
  }

  await user.save();
  const populatedCart = await user.populate('cart.product', 'name price images stock');
  res.status(201).json(populatedCart.cart);
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.find((cartItem) => cartItem.product.toString() === req.params.productId);

  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  item.quantity = Math.min(quantity, product.stock);
  await user.save();
  const populatedCart = await user.populate('cart.product', 'name price images stock');
  res.json(populatedCart.cart);
};

const removeCartItem = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId);
  await user.save();
  const populatedCart = await user.populate('cart.product', 'name price images stock');
  res.json(populatedCart.cart);
};

const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ message: 'Cart cleared' });
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
};
