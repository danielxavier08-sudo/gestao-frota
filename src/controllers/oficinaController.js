// src/controllers/oficinaController.js
const OficinaModel = require('../models/oficinaModel');

const OficinaController = {

  async listar(req, res) {
    try {
      const oficinas = await OficinaModel.listar();
      res.json(oficinas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao listar oficinas.' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const oficina = await OficinaModel.buscarPorId(req.params.id);
      if (!oficina) return res.status(404).json({ erro: 'Oficina não encontrada.' });
      res.json(oficina);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao buscar oficina.' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, cidade, telefone, especialidade, status } = req.body;
      if (!nome || !cidade) {
        return res.status(400).json({ erro: 'Nome e cidade são obrigatórios.' });
      }
      const oficina = await OficinaModel.criar({ nome, cidade, telefone, especialidade, status });
      res.status(201).json(oficina);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao criar oficina.' });
    }
  },

  async atualizar(req, res) {
    try {
      const existe = await OficinaModel.buscarPorId(req.params.id);
      if (!existe) return res.status(404).json({ erro: 'Oficina não encontrada.' });

      const { nome, cidade, telefone, especialidade, status } = req.body;
      if (!nome || !cidade) {
        return res.status(400).json({ erro: 'Nome e cidade são obrigatórios.' });
      }
      const atualizada = await OficinaModel.atualizar(req.params.id, { nome, cidade, telefone, especialidade, status });
      res.json(atualizada);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao atualizar oficina.' });
    }
  },

  async apagar(req, res) {
    try {
      const existe = await OficinaModel.buscarPorId(req.params.id);
      if (!existe) return res.status(404).json({ erro: 'Oficina não encontrada.' });

      await OficinaModel.apagar(req.params.id);
      res.json({ mensagem: 'Oficina removida com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao remover oficina.' });
    }
  },
};

module.exports = OficinaController;
