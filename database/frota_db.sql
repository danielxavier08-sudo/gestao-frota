-- ============================================================
--  frota_db — Script de criação do banco de dados
--  DW2 IFCE — Gestão de Frota
-- ============================================================

CREATE DATABASE IF NOT EXISTS frota_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE frota_db;

-- ------------------------------------------------------------
-- Tabela: veiculos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS veiculos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  placa       VARCHAR(10)  NOT NULL UNIQUE,
  modelo      VARCHAR(80)  NOT NULL,
  ano         YEAR         NOT NULL,
  km          INT          NOT NULL DEFAULT 0,
  status      ENUM('ativo','manutencao','inativo') NOT NULL DEFAULT 'ativo',
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabela: motoristas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS motoristas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  cnh           VARCHAR(20)  NOT NULL UNIQUE,
  categoria     ENUM('A','B','C','D','E','AB','AC','AD','AE') NOT NULL,
  validade_cnh  DATE         NOT NULL,
  telefone      VARCHAR(20),
  status        ENUM('ativo','inativo') NOT NULL DEFAULT 'ativo',
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabela: oficinas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oficinas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nome           VARCHAR(120) NOT NULL,
  cidade         VARCHAR(80)  NOT NULL,
  telefone       VARCHAR(20),
  especialidade  VARCHAR(100),
  status         ENUM('ativa','inativa') NOT NULL DEFAULT 'ativa',
  criado_em      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabela: usuarios (autenticação)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  senha_hash    VARCHAR(255) NOT NULL,
  perfil        ENUM('admin','operador') NOT NULL DEFAULT 'operador',
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Dados de exemplo
-- ------------------------------------------------------------
INSERT INTO veiculos (placa, modelo, ano, km, status) VALUES
  ('ABC-1234', 'Fiat Ducato',      2020, 85000, 'ativo'),
  ('DEF-5678', 'Mercedes Sprinter',2019, 120000,'manutencao'),
  ('GHI-9012', 'VW Delivery',      2021, 45000, 'ativo'),
  ('JKL-3456', 'Ford Cargo',       2018, 200000,'inativo'),
  ('MNO-7890', 'Iveco Daily',      2022, 30000, 'ativo');

INSERT INTO motoristas (nome, cnh, categoria, validade_cnh, telefone, status) VALUES
  ('Carlos Silva',    '12345678901', 'D', '2026-06-15', '(85) 99999-1111', 'ativo'),
  ('Ana Oliveira',    '98765432100', 'B', '2025-12-01', '(85) 98888-2222', 'ativo'),
  ('João Santos',     '11122233344', 'E', '2027-03-20', '(85) 97777-3333', 'ativo'),
  ('Maria Costa',     '55566677788', 'C', '2024-08-10', '(85) 96666-4444', 'inativo');

INSERT INTO oficinas (nome, cidade, telefone, especialidade, status) VALUES
  ('Auto Center Norte', 'Fortaleza',  '(85) 3333-1111', 'Mecânica Geral',    'ativa'),
  ('TruckService CE',   'Caucaia',    '(85) 3333-2222', 'Caminhões Pesados', 'ativa'),
  ('Oficina Express',   'Maracanaú',  '(85) 3333-3333', 'Elétrica Veicular', 'ativa'),
  ('Moto Peças Sul',    'Juazeiro',   '(88) 3333-4444', 'Revisão Geral',     'inativa');

-- Usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
  ('Administrador', 'admin@frota.com',
   '$2a$10$GMwQis7gMLGPeaUatB5zTuHmxfV7N5VBHweBrMygaPpJfj2wKfd.O',
   'admin');
