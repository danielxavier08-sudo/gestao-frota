// src/models/oficinaModel.js
const db = require('../config/database');

const OficinaModel = {

  async listar() {
    const [rows] = await db.query(
      'SELECT * FROM oficinas ORDER BY nome ASC'
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      'SELECT * FROM oficinas WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  async criar({ nome, cidade, telefone, especialidade, status }) {
    const [result] = await db.query(
      `INSERT INTO oficinas (nome, cidade, telefone, especialidade, status)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, cidade, telefone || null, especialidade || null, status || 'ativa']
    );
    return this.buscarPorId(result.insertId);
  },

  async atualizar(id, { nome, cidade, telefone, especialidade, status }) {
    await db.query(
      `UPDATE oficinas
          SET nome = ?, cidade = ?, telefone = ?, especialidade = ?, status = ?
        WHERE id = ?`,
      [nome, cidade, telefone, especialidade, status, id]
    );
    return this.buscarPorId(id);
  },

  async apagar(id) {
    const [result] = await db.query(
      'DELETE FROM oficinas WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = OficinaModel;
