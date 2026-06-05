// src/models/veiculoModel.js
const db = require('../config/database');

const VeiculoModel = {

  async listar() {
    const [rows] = await db.query(
      'SELECT * FROM veiculos ORDER BY criado_em DESC'
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      'SELECT * FROM veiculos WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  async buscarPorPlaca(placa) {
    const [rows] = await db.query(
      'SELECT * FROM veiculos WHERE placa = ?', [placa]
    );
    return rows[0] || null;
  },

  async criar({ placa, modelo, ano, km, status }) {
    const [result] = await db.query(
      'INSERT INTO veiculos (placa, modelo, ano, km, status) VALUES (?, ?, ?, ?, ?)',
      [placa, modelo, ano, km || 0, status || 'ativo']
    );
    return this.buscarPorId(result.insertId);
  },

  async atualizar(id, { placa, modelo, ano, km, status }) {
    await db.query(
      `UPDATE veiculos
          SET placa = ?, modelo = ?, ano = ?, km = ?, status = ?
        WHERE id = ?`,
      [placa, modelo, ano, km, status, id]
    );
    return this.buscarPorId(id);
  },

  async apagar(id) {
    const [result] = await db.query(
      'DELETE FROM veiculos WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = VeiculoModel;
