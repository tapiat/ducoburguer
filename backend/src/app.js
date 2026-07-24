const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routers/authRoutes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'duco-burger-backend' }));

app.use('/api/auth', authRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = app;