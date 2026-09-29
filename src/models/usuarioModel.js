// src/models/usuarioModel.js
const db     = require('../config/database');
const bcrypt = require('bcryptjs');

const UsuarioModel = {

  async buscarPorEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    );
    return rows[0] || null;
  },

  async listar() {
    const [rows] = await db.query(
      'SELECT id, nome, email, perfil, criado_em FROM usuarios ORDER BY criado_em DESC'
    );
    return rows;
  },

  async apagar(id) {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async criar({ nome, email, senha, perfil }) {
    const hash = await bcrypt.hash(senha, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, hash, perfil || 'operador']
    );
    const [rows] = await db.query(
      'SELECT id, nome, email, perfil, criado_em FROM usuarios WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  },

  async verificaSenha(senha, hash) {
    return bcrypt.compare(senha, hash);
  },
};

module.exports = UsuarioModel;
