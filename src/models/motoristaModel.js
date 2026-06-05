// src/models/motoristaModel.js
const db = require('../config/database');

const MotoristaModel = {

  async listar() {
    const [rows] = await db.query(
      'SELECT * FROM motoristas ORDER BY nome ASC'
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      'SELECT * FROM motoristas WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  async criar({ nome, cnh, categoria, validade_cnh, telefone, status }) {
    const [result] = await db.query(
      `INSERT INTO motoristas (nome, cnh, categoria, validade_cnh, telefone, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cnh, categoria, validade_cnh, telefone || null, status || 'ativo']
    );
    return this.buscarPorId(result.insertId);
  },

  async atualizar(id, { nome, cnh, categoria, validade_cnh, telefone, status }) {
    await db.query(
      `UPDATE motoristas
          SET nome = ?, cnh = ?, categoria = ?, validade_cnh = ?, telefone = ?, status = ?
        WHERE id = ?`,
      [nome, cnh, categoria, validade_cnh, telefone, status, id]
    );
    return this.buscarPorId(id);
  },

  async apagar(id) {
    const [result] = await db.query(
      'DELETE FROM motoristas WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = MotoristaModel;
