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
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  senha_hash CHAR(128) NOT NULL,
  salt CHAR(32) NOT NULL,
  cargo ENUM('Gerente', 'Atendente', 'Mecanico') NOT NULL
);

-- Criando a tabela de equipamento
create table equipamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  modelo VARCHAR(100),
  fabricante VARCHAR(100),
  descricao VARCHAR(255),
  valor_compra DECIMAL(10,2) NOT NULL,
  valor_hora DECIMAL(10,2) NOT NULL,
  avarias VARCHAR(255),
  numero_seguro VARCHAR(50), -- Só preenchido para bicicletas
  disponivel BOOLEAN DEFAULT TRUE
);

-- Criação Locação
create table locacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_hora_locacao TIMESTAMP,
  horas_contratadas INTEGER,
  data_hora_entrega_prevista DATETIME NOT NULL,
  desconto DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  cliente_id INTEGER NOT NULL,
  funcionario_id INTEGER NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);

-- Criação Item Locado
create table item_locado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tempo_contratado INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  equipamento_id INTEGER NOT NULL,
  locacao_id INTEGER NOT NULL,
  FOREIGN KEY (equipamento_id) REFERENCES equipamento(id),
  FOREIGN KEY (locacao_id) REFERENCES locacao(id)
);

-- Criação Devolução
create table devolucao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_hora_devolucao TIMESTAMP,
  valor_pago DECIMAL(10,2) NOT NULL,
  locacao_id INTEGER NOT NULL,
  funcionario_id INTEGER NOT NULL,
  FOREIGN KEY (locacao_id) REFERENCES locacao(id),
  FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);

-- Criação Avaria
create table avaria (
  id VARCHAR(36) PRIMARY KEY, -- UUID
  data_hora_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  avaliador_id INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  foto_caminho VARCHAR(255) NOT NULL,
  valor_cobrar DECIMAL(10,2) NOT NULL,
  equipamento_id INTEGER NOT NULL,
  locacao_id INTEGER NOT NULL,
  FOREIGN KEY (avaliador_id) REFERENCES funcionario(id),
  FOREIGN KEY (equipamento_id) REFERENCES equipamento(id),
  FOREIGN KEY (locacao_id) REFERENCES locacao(id)
);

-- Índices para as tabelas
CREATE INDEX idx_locacao_cliente ON locacao(cliente_id);
CREATE INDEX idx_locacao_funcionario ON locacao(funcionario_id);
CREATE INDEX idx_item_locado_equipamento ON item_locado(equipamento_id);
CREATE INDEX idx_item_locado_locacao ON item_locado(locacao_id);
CREATE INDEX idx_devolucao_locacao ON devolucao(locacao_id);
CREATE INDEX idx_devolucao_funcionario ON devolucao(funcionario_id);
CREATE INDEX idx_avaria_equipamento ON avaria(equipamento_id);
CREATE INDEX idx_avaria_locacao ON avaria(locacao_id);
CREATE INDEX idx_avaria_avaliador ON avaria(avaliador_id);
