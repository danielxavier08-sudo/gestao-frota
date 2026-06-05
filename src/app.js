// src/app.js  — Front Controller
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const apiRoutes = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globais ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Arquivos estáticos (front-end) ───────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── API REST ─────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ── SPA fallback — serve o index.html para rotas do front ────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ── Inicia servidor ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚛  Gestão de Frota — DW2 IFCE`);
  console.log(`📡  Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔑  Login: admin@frota.com / admin123\n`);
});

module.exports = app;
