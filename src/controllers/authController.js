// src/controllers/authController.js
const UsuarioModel = require('../models/usuarioModel');
const { geraToken } = require('../middlewares/auth');

const AuthController = {

  // POST /api/v1/auth/login
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      const senhaCorreta = await UsuarioModel.verificaSenha(senha, usuario.senha_hash);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      const token = geraToken({
        id:     usuario.id,
        nome:   usuario.nome,
        email:  usuario.email,
        perfil: usuario.perfil,
      });

      res.json({
        token,
        usuario: {
          id:     usuario.id,
          nome:   usuario.nome,
          email:  usuario.email,
          perfil: usuario.perfil,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro no servidor.' });
    }
  },
};

module.exports = AuthController;
