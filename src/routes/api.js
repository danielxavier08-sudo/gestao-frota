// src/routes/api.js
const express    = require('express');
const router     = express.Router();

const { verificaToken, verificaAdmin } = require('../middlewares/auth');
const AuthController         = require('../controllers/authController');
const VeiculoController      = require('../controllers/veiculoController');
const MotoristaController    = require('../controllers/motoristaController');
const OficinaController      = require('../controllers/oficinaController');
const UsuarioController      = require('../controllers/usuarioController');

// ── Auth (público) ──────────────────────────────────────────
router.post('/auth/login', AuthController.login);

// ── Health check ────────────────────────────────────────────
router.get('/', (req, res) => res.json({ status: 'ok', sistema: 'Gestão de Frota DW3' }));

// ── Veículos ────────────────────────────────────────────────
// Leitura pública (rotas SPA "Inicial" e "Detalhes"); escrita protegida
router.get   ('/veiculos',     VeiculoController.listar);
router.get   ('/veiculos/:id', VeiculoController.buscarPorId);
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
// ── Usuários (somente admin) ─────────────────────────────────
router.get   ('/usuarios',     verificaToken, verificaAdmin, UsuarioController.listar);
router.post  ('/usuarios',     verificaToken, verificaAdmin, UsuarioController.criar);
router.delete('/usuarios/:id', verificaToken, verificaAdmin, UsuarioController.apagar);

// Endpoint do autor — público (sem middleware JWT)
router.get('/autor', (req, res) => {
  res.json({
    nome: 'Daniel Xavier',
    matricula: '20252062660050',
    curso: 'Informática para Internet EAD',
    instituicao: 'IFCE',
    disciplina: 'Desenvolvimento Web III',
    github: 'https://github.com/danielxavier08-sudo/gestao-frota'
  });
});

module.exports = router;
