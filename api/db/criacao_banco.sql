drop database if exists database_g9;

create database database_g9 character set utf8mb4 collate utf8mb4_unicode_ci;

use database_g9;

-- Criação Cliente
create table cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255),
  foto VARCHAR(255),
  data_nascimento DATE,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco VARCHAR(255)
);

-- Criação Funcionário
create table funcionario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255)
);

-- Criação Locação
create table locacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_hora_locacao TIMESTAMP,
  horas_contratadas INTEGER,
  funcionario_id INTEGER REFERENCES funcionario(id),
  cliente_id INTEGER REFERENCES cliente(id)
);

-- Criando a tabela de equipamento
create table equipamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  modelo VARCHAR(100),
  fabricante VARCHAR(100),
  descricao VARCHAR(255),
  valor_hora DECIMAL(10,2) NOT NULL,
  avarias VARCHAR(255),
  numero_seguro VARCHAR(50), -- Só preenchido para bicicletas
  disponivel BOOLEAN DEFAULT TRUE
);

