// src/controllers/veiculoController.js
const VeiculoModel = require('../models/veiculoModel');

const VeiculoController = {

  // GET /api/v1/veiculos
  async listar(req, res) {
    try {
      const veiculos = await VeiculoModel.listar();
      res.json(veiculos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao listar veículos.' });
    }
  },

  // GET /api/v1/veiculos/:id
  async buscarPorId(req, res) {
    try {
      const veiculo = await VeiculoModel.buscarPorId(req.params.id);
      if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado.' });
      res.json(veiculo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar veículo.' });
    }
  },

  // POST /api/v1/veiculos
  async criar(req, res) {
    try {
      const { placa, modelo, ano, km, status } = req.body;
      if (!placa || !modelo || !ano) {
        return res.status(400).json({ erro: 'Placa, modelo e ano são obrigatórios.' });
      }
      const veiculo = await VeiculoModel.criar({ placa, modelo, ano, km, status });
      res.status(201).json(veiculo);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'Já existe um veículo com essa placa.' });
      }
      console.error(err);
      res.status(500).json({ erro: 'Erro ao criar veículo.' });
    }
  },

  // PUT /api/v1/veiculos/:id
  async atualizar(req, res) {
    try {
      const existe = await VeiculoModel.buscarPorId(req.params.id);
      if (!existe) return res.status(404).json({ erro: 'Veículo não encontrado.' });

      const { placa, modelo, ano, km, status } = req.body;
      if (!placa || !modelo || !ano) {
        return res.status(400).json({ erro: 'Placa, modelo e ano são obrigatórios.' });
      }
      const atualizado = await VeiculoModel.atualizar(req.params.id, { placa, modelo, ano, km, status });
      res.json(atualizado);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'Já existe um veículo com essa placa.' });
      }
      console.error(err);
      res.status(500).json({ erro: 'Erro ao atualizar veículo.' });
    }
  },

  // DELETE /api/v1/veiculos/:id
  async apagar(req, res) {
    try {
      const existe = await VeiculoModel.buscarPorId(req.params.id);
      if (!existe) return res.status(404).json({ erro: 'Veículo não encontrado.' });

      await VeiculoModel.apagar(req.params.id);
      res.json({ mensagem: 'Veículo removido com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao remover veículo.' });
    }
  },
};

module.exports = VeiculoController;
