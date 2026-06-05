// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'frota_secret_dw2_ifce_2024';

function verificaToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

function geraToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

module.exports = { verificaToken, geraToken };
