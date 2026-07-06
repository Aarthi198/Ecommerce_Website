const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
router.post('/', authMiddleware, createOrder);
router.use(authMiddleware);
router.get('/my-orders', getMyOrders);
router.get('/', getMyOrders);
router.get('/admin/all', adminMiddleware, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', adminMiddleware, updateOrderStatus);

module.exports = router;
