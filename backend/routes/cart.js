const express = require('express');
const {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);
router.get('/', getCart);
router.post('/', addCartItem);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
