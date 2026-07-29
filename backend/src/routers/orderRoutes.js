const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

// Todas las rutas de este archivo requieren estar logueado
router.use(authenticate);

// Cliente
router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/:id', getOrderById);

// Admin
router.get('/', authorize('admin'), getAllOrders);
router.patch('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;