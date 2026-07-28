// Este script crea (o actualiza) un usuario administrador.
// Se ejecuta manualmente con: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function seedAdmin() {
  const name = 'Administrador Duco';
  const email = 'admin@ducoburger.com';
  const plainPassword = 'Admin123!';

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

  if (existing.length > 0) {
    await pool.query(
      'UPDATE users SET password_hash = ?, role = ? WHERE email = ?',
      [passwordHash, 'admin', email]
    );
    console.log('✅ Usuario admin actualizado.');
  } else {
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'admin']
    );
    console.log('✅ Usuario admin creado.');
  }

  console.log(`Email: ${email}`);
  console.log(`Password: ${plainPassword}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('❌ Error al crear admin:', err);
  process.exit(1);
});