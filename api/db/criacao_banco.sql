drop database if exists bd_teste_g9;

create database bd_teste_g9 character set utf8mb4 collate utf8mb4_unicode_ci;

use bd_teste_g9;

-- Criação Clientes
create table clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255),
  foto VARCHAR(255),
  data_nascimento DATE,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco VARCHAR(255)
);

-- Criação Funcionários
create table funcionarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255)
);

-- Criação Locações
create table locacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_hora_locacao TIMESTAMP,
  horas_contratadas INTEGER,
  funcionario_id INTEGER REFERENCES funcionarios(id),
  cliente_id INTEGER REFERENCES clientes(id)
);

-- Criando a tabela de itens
create table itens (
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

