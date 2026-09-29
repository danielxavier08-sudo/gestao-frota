// src/controllers/usuarioController.js
const UsuarioModel = require('../models/usuarioModel');

const UsuarioController = {

  // GET /api/v1/usuarios  (admin)
  async listar(req, res) {
    try {
      res.json(await UsuarioModel.listar());
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao listar usuários.' });
    }
  },

  // POST /api/v1/usuarios  (admin)
  async criar(req, res) {
    try {
      const { nome, email, senha, perfil } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
      }
      if (perfil && !['admin', 'operador'].includes(perfil)) {
        return res.status(400).json({ erro: 'Perfil inválido.' });
      }
      const usuario = await UsuarioModel.criar({ nome, email, senha, perfil });
      res.status(201).json(usuario);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'Já existe um usuário com esse e-mail.' });
      }
      console.error(err);
      res.status(500).json({ erro: 'Erro ao criar usuário.' });
    }
  },

  // DELETE /api/v1/usuarios/:id  (admin)
  async apagar(req, res) {
    try {
      if (Number(req.params.id) === req.usuario.id) {
        return res.status(400).json({ erro: 'Você não pode remover o seu próprio usuário.' });
      }
      const ok = await UsuarioModel.apagar(req.params.id);
      if (!ok) return res.status(404).json({ erro: 'Usuário não encontrado.' });
      res.json({ mensagem: 'Usuário removido com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao remover usuário.' });
    }
  },
};

module.exports = UsuarioController;
