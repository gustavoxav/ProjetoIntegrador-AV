drop database if exists database_test_g9;

create database database_test_g9 character set utf8mb4 collate utf8mb4_unicode_ci;

use database_test_g9;

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

-- Criação Locação
create table locacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_hora_locacao TIMESTAMP,
  horas_contratadas INTEGER,
  data_hora_entrega_prevista TIMESTAMP NOT NULL,
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

-- Índices para as tabelas
CREATE INDEX idx_locacao_cliente ON locacao(cliente_id);
CREATE INDEX idx_locacao_funcionario ON locacao(funcionario_id);
CREATE INDEX idx_item_locado_equipamento ON item_locado(equipamento_id);
CREATE INDEX idx_item_locado_locacao ON item_locado(locacao_id);

-- Cliente
insert into cliente (nome_completo, foto, data_nascimento, cpf, telefone, email, endereco) values
('Gustavo Xavier Saldanha', 'https://drive.google.com/file/d/1dVmHQ3Zhx8mjNCpkK67SqlSSPBJ2ATYU/view?usp=drive_link', '2002-11-11', '12345678900', '(11) 99234-5678', 'gustavoxav@email.com', 'Rua das Pedras, 123'),
('Thiago Rocha', 'https://drive.google.com/file/d/1uOL0bVqlokqORpwV6uzNCIxmWg9m0ZbB/view?usp=sharing', '1985-11-10', '98765432100', '(11) 99876-5432', 'thiagorocha@email.com', 'Av. Brasil, 456'),
('Fernanda Souza', 'https://drive.google.com/file/d/1AYjwEe6ZYbRD0EOblQ_ieZ5M-QgtChiX/view?usp=drive_link', '1990-05-15', '45678912300', '(11) 93456-7890', 'fernandasouza@gmail.com', 'Rua das Flores, 789'),
('Lucas Almeida', 'https://drive.google.com/file/d/1U2fZ1J0dkfDGg7hFIuDCNPralFa-aqTJ/view?usp=drive_link', '1995-03-20', '32165498700', '(11) 91234-5678', 'lucasalmeida@gmail.com', 'Av. das Palmeiras, 321'),
('Mariano Costa', 'https://drive.google.com/file/d/1mXoP7cQogSH0Ikt-FhdydYIKyPqxLWza/view?usp=drive_link', '1992-08-25', '65432198700', '(11) 92345-6789', 'marianocosta@gmail.com', 'Rua do Sol, 654');

-- Funcionario
insert into funcionario (nome) values
('Gustavo Funcionario'),
('Fernanda Funcionario'),
('Lucas Funcionario'),
('Mariano Funcionario'),
('Thiago Funcionario');

-- Bicicletas
insert into equipamento (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) values
('bicicleta', 'MTB 29', 'Caloi', 'Bicicleta de trilha com 21 marchas', 15.00, '', 'SEG123456', TRUE),
('bicicleta', 'Elétrica 500W', 'Sense', 'Bicicleta elétrica com autonomia de 40km', 25.00, '', 'SEG987654', TRUE);

-- Equipamentos Gerais
insert into equipamento (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) values
('capacete', 'Capacete', 'Giro', 'Capacete de ciclismo', 5.00, '', NULL, TRUE),
('farolete', 'Farol LED', 'Trek', 'Farol LED', 3.00, '', NULL, TRUE),
('squeeze', 'Squeeze 600ml', 'Nike', 'Squeeze térmico', 1.00, '', NULL, TRUE),
('suporte_para_squeeze', 'Suporte de Bicicleta', 'Shimano', 'Suporte para squeeze', 0.50, '', NULL, TRUE),
('pisca_alerta', 'Pisca Dianteiro', 'GTS', 'Pisca alerta dianteiro LED', 2.00, '', NULL, TRUE),
('acolchoamento_selim', 'Empresa Banco', 'Atrio', 'Banco de Gel', 1.50, '', NULL, TRUE),
('refletor_roda', 'Refletor de Roda', 'shimano', 'Refletor circular para rodas', 0.75, '', NULL, TRUE),
('refletor_selim', 'Refletor Traseiro', 'shimano', 'Refletor vermelho traseiro', 0.75, '', NULL, TRUE),
('cadeado', 'Cadeado Antifurto', 'Haga', 'Cadeado com senha numérica', 1.00, '', NULL, TRUE),
('tranca', 'Tranca Alta Segurança', 'Empresa Tranca', 'Tranca com chave e alarme', 2.50, '', NULL, TRUE);
