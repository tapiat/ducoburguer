const { pool } = require('../config/db');

const OrderModel = {
  // Crea un pedido completo (orden + items) usando una transacción
  async create({ userId, items, address }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let total = 0;
      const itemsWithPrice = [];

      // Recorremos cada producto del pedido, verificando stock y precio real
      for (const item of items) {
        const [rows] = await conn.query(
          'SELECT id, price, stock FROM products WHERE id = ? AND active = TRUE',
          [item.productId]
        );
        const product = rows[0];

        if (!product) {
          throw new Error(`El producto ${item.productId} no existe o no está disponible`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto ${item.productId}`);
        }

        total += product.price * item.quantity;
        itemsWithPrice.push({ ...item, unitPrice: product.price });
      }

      // Creamos el pedido con el total ya calculado
      const [orderResult] = await conn.query(
        'INSERT INTO orders (user_id, total, address, status) VALUES (?, ?, ?, ?)',
        [userId, total, address, 'pendiente']
      );
      const orderId = orderResult.insertId;

      // Creamos cada item y descontamos su stock
      for (const item of itemsWithPrice) {
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.unitPrice]
        );
        await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
      }

      await conn.commit();
      return this.findById(orderId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Busca un pedido con todos sus items
  async findById(id) {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    const order = orders[0];
    if (!order) return null;

    const [items] = await pool.query(
      `SELECT oi.*, p.name AS product_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );
    return { ...order, items };
  },

  // Pedidos de un usuario específico (para "Mis Pedidos")
  async findByUser(userId) {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return orders;
  },

  // Todos los pedidos (para el panel admin)
  async findAll() {
    const [orders] = await pool.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    return orders;
  },

  // Cambia el estado de un pedido (admin)
  async updateStatus(id, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }
};

module.exports = OrderModel;