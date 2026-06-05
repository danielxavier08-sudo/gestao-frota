// src/config/database.js
// Configuração do pool de conexões MySQL

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'frota_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
});

// Testa a conexão ao iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅  MySQL conectado — frota_db');
    conn.release();
  })
  .catch(err => {
    console.error('❌  Erro ao conectar no MySQL:', err.message);
    console.error('    Verifique as variáveis DB_HOST, DB_USER, DB_PASSWORD, DB_NAME no .env');
  });

module.exports = pool;
