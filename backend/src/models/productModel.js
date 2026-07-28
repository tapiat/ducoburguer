const { pool } = require('../config/db');

const ProductModel = {
  // Lista productos. Por defecto solo los activos (para el catálogo público)
  async findAll({ onlyActive = true } = {}) {
    let query = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    if (onlyActive) {
      query += ' WHERE p.active = TRUE';
    }
    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query);
    return rows;
  },

  // Busca un producto por su id
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  },

  // Crea un producto nuevo
  async create({ name, description, price, imageUrl, categoryId, stock }) {
    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, image_url, category_id, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, imageUrl, categoryId, stock]
    );
    return this.findById(result.insertId);
  },

  // Actualiza un producto existente
  async update(id, { name, description, price, imageUrl, categoryId, stock, active }) {
    await pool.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, stock = ?, active = ?
       WHERE id = ?`,
      [name, description, price, imageUrl, categoryId, stock, active, id]
    );
    return this.findById(id);
  },

  // "Elimina" un producto (baja lógica, no borrado real)
  async remove(id) {
    await pool.query('UPDATE products SET active = FALSE WHERE id = ?', [id]);
  }
};

module.exports = ProductModel;