const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { uploadProductImage } = require('../middleware/upload');
const { adminLogin } = require('../controllers/authController');
const { getAllOrders, updateOrderStatus, getAdminStats } = require('../controllers/orderController');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.put('/orders/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);
router.post(
  '/upload-image',
  authMiddleware,
  adminMiddleware,
  uploadProductImage.single('image'),
  uploadImage
);

module.exports = router;
