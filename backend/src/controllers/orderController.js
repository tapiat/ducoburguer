const OrderModel = require('../models/orderModel');

const VALID_STATUSES = ['pendiente', 'en_preparacion', 'enviado', 'entregado', 'cancelado'];

// POST /api/orders - Cliente: crea un nuevo pedido
async function createOrder(req, res) {
  try {
    const { items, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido debe incluir al menos un producto' });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: 'Cada item debe tener productId y quantity válidos' });
      }
    }

    const order = await OrderModel.create({ userId: req.user.id, items, address });
    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    // Errores de negocio (stock insuficiente, producto no existe) los mandamos como 400
    res.status(400).json({ error: err.message || 'Error al crear el pedido' });
  }
}

// GET /api/orders/mine - Cliente: ve solo sus propios pedidos
async function getMyOrders(req, res) {
  try {
    const orders = await OrderModel.findByUser(req.user.id);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tus pedidos' });
  }
}

// GET /api/orders/:id - Cliente (solo el suyo) o Admin (cualquiera)
async function getOrderById(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a este pedido' });
    }

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
}

// GET /api/orders - Admin: ve todos los pedidos
async function getAllOrders(req, res) {
  try {
    const orders = await OrderModel.findAll();
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
}

// PATCH /api/orders/:id/status - Admin: cambia el estado de un pedido
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Estado inválido. Usa uno de: ${VALID_STATUSES.join(', ')}` });
    }

    const existing = await OrderModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Pedido no encontrado' });

    const order = await OrderModel.updateStatus(req.params.id, status);
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
}

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };