// src/routes/api.js
const express    = require('express');
const router     = express.Router();

const { verificaToken }      = require('../middlewares/auth');
const AuthController         = require('../controllers/authController');
const VeiculoController      = require('../controllers/veiculoController');
const MotoristaController    = require('../controllers/motoristaController');
const OficinaController      = require('../controllers/oficinaController');

// ── Auth (público) ──────────────────────────────────────────
router.post('/auth/login', AuthController.login);

// ── Health check ────────────────────────────────────────────
router.get('/', (req, res) => res.json({ status: 'ok', sistema: 'Gestão de Frota DW2' }));

// ── Veículos (protegido) ─────────────────────────────────────
router.get   ('/veiculos',     verificaToken, VeiculoController.listar);
router.get   ('/veiculos/:id', verificaToken, VeiculoController.buscarPorId);
router.post  ('/veiculos',     verificaToken, VeiculoController.criar);
router.put   ('/veiculos/:id', verificaToken, VeiculoController.atualizar);
router.delete('/veiculos/:id', verificaToken, VeiculoController.apagar);

// ── Motoristas (protegido) ───────────────────────────────────
router.get   ('/motoristas',     verificaToken, MotoristaController.listar);
router.get   ('/motoristas/:id', verificaToken, MotoristaController.buscarPorId);
router.post  ('/motoristas',     verificaToken, MotoristaController.criar);
router.put   ('/motoristas/:id', verificaToken, MotoristaController.atualizar);
router.delete('/motoristas/:id', verificaToken, MotoristaController.apagar);

// ── Oficinas (protegido) ──────────────────────────────────────
router.get   ('/oficinas',     verificaToken, OficinaController.listar);
router.get   ('/oficinas/:id', verificaToken, OficinaController.buscarPorId);
router.post  ('/oficinas',     verificaToken, OficinaController.criar);
router.put   ('/oficinas/:id', verificaToken, OficinaController.atualizar);
router.delete('/oficinas/:id', verificaToken, OficinaController.apagar);

module.exports = router;
