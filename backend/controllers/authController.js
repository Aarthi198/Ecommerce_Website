const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const normalizeRole = (role) => (role === 'user' ? 'customer' : role);

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: normalizeRole(user.role),
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'customer',
  });

  res.status(201).json({
    user: buildUserResponse(user),
    token: generateToken(user._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    user: buildUserResponse(user),
    token: generateToken(user._id),
  });
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  res.json({
    user: buildUserResponse(user),
    token: generateToken(user._id),
  });
};

const profile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: normalizeRole(req.user.role),
    cart: req.user.cart,
  });
};

module.exports = {
  register,
  login,
  adminLogin,
  profile,
};
