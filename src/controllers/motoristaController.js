// src/controllers/motoristaController.js
const MotoristaModel = require('../models/motoristaModel');

const MotoristaController = {

  async listar(req, res) {
    try {
      const motoristas = await MotoristaModel.listar();
      res.json(motoristas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao listar motoristas.' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const motorista = await MotoristaModel.buscarPorId(req.params.id);
      if (!motorista) return res.status(404).json({ erro: 'Motorista não encontrado.' });
      res.json(motorista);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar motorista.' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, cnh, categoria, validade_cnh, telefone, status } = req.body;
      if (!nome || !cnh || !categoria || !validade_cnh) {
        return res.status(400).json({ erro: 'Nome, CNH, categoria e validade são obrigatórios.' });
      }
      const motorista = await MotoristaModel.criar({ nome, cnh, categoria, validade_cnh, telefone, status });
      res.status(201).json(motorista);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'Já existe um motorista com essa CNH.' });
      }
      console.error(err);
      res.status(500).json({ erro: 'Erro ao criar motorista.' });
    }
  },

  async atualizar(req, res) {
    try {
      const existe = await MotoristaModel.buscarPorId(req.params.id);
      if (!existe) return res.status(404).json({ erro: 'Motorista não encontrado.' });

      const { nome, cnh, categoria, validade_cnh, telefone, status } = req.body;
      if (!nome || !cnh || !categoria || !validade_cnh) {
        return res.status(400).json({ erro: 'Nome, CNH, categoria e validade são obrigatórios.' });
      }
      const atualizado = await MotoristaModel.atualizar(req.params.id, { nome, cnh, categoria, validade_cnh, telefone, status });
      res.json(atualizado);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'Já existe um motorista com essa CNH.' });
      }
      console.error(err);
      res.status(500).json({ erro: 'Erro ao atualizar motorista.' });
    }
  },

  async apagar(req, res) {
    try {
      const existe = await MotoristaModel.buscarPorId(req.params.id);
      if (!existe) return res.status(404).json({ erro: 'Motorista não encontrado.' });

      await MotoristaModel.apagar(req.params.id);
      res.json({ mensagem: 'Motorista removido com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao remover motorista.' });
    }
  },
};

module.exports = MotoristaController;
