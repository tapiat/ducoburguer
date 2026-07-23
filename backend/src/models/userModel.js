const { pool } = require('../config/db');

const UserModel = {
  // Crea un nuevo usuario
  async create({ name, email, passwordHash, role = 'customer' }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return { id: result.insertId, name, email, role };
  },

  // Busca un usuario por su email (lo usamos al hacer login)
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Busca un usuario por su id (sin devolver la contraseña)
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};

module.exports = UserModel;