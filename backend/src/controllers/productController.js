const ProductModel = require('../models/productModel');

// GET /api/products - Público: lista solo productos activos
async function getProducts(req, res) {
  try {
    const products = await ProductModel.findAll({ onlyActive: true });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
}

// GET /api/products/admin/all - Admin: lista todos, incluidos inactivos
async function getAllProductsAdmin(req, res) {
  try {
    const products = await ProductModel.findAll({ onlyActive: false });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
}

// POST /api/products - Admin: crea un producto
async function createProduct(req, res) {
  try {
    const { name, description, price, imageUrl, categoryId, stock } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const product = await ProductModel.create({
      name,
      description,
      price,
      imageUrl,
      categoryId,
      stock: stock || 0
    });
    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
}

// PUT /api/products/:id - Admin: actualiza un producto
async function updateProduct(req, res) {
  try {
    const existing = await ProductModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });

    const {
      name = existing.name,
      description = existing.description,
      price = existing.price,
      imageUrl = existing.image_url,
      categoryId = existing.category_id,
      stock = existing.stock,
      active = existing.active
    } = req.body;

    const product = await ProductModel.update(req.params.id, {
      name, description, price, imageUrl, categoryId, stock, active
    });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
}

// DELETE /api/products/:id - Admin: desactiva un producto
async function deleteProduct(req, res) {
  try {
    const existing = await ProductModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });

    await ProductModel.remove(req.params.id);
    res.json({ message: 'Producto desactivado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}

module.exports = {
  getProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};