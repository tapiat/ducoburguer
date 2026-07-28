const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// Rutas públicas (cualquiera puede verlas, sin login)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas de administrador (requieren estar logueado Y tener rol admin)
router.get('/admin/all', authenticate, authorize('admin'), getAllProductsAdmin);
router.post('/', authenticate, authorize('admin'), createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;