require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`🍔 Duco Burger backend corriendo en http://localhost:${PORT}`);
  await testConnection();
});