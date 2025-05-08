-- Criação Clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255),
  foto TEXT,
  data_nascimento DATE,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco TEXT
);

-- Criação Funcionários
CREATE TABLE funcionarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255)
);

-- Criação Locações
CREATE TABLE locacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_hora_locacao TIMESTAMP,
  horas_contratadas INTEGER,
  funcionario_id INTEGER REFERENCES funcionarios(id),
  cliente_id INTEGER REFERENCES clientes(id)
);

-- Criando a tabela de itens
CREATE TABLE itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  modelo VARCHAR(100),
  fabricante VARCHAR(100),
  descricao TEXT,
  valor_hora DECIMAL(10,2) NOT NULL,
  avarias TEXT,
  numero_seguro VARCHAR(50), -- Só preenchido para bicicletas
  disponivel BOOLEAN DEFAULT TRUE
);

Insert Clientes
INSERT INTO clientes (nome_completo, foto, data_nascimento, cpf, telefone, email, endereco)
VALUES 
('Gustavo Xavier Saldanha', Gustavo.jpg', '2002-11-11', '123.456.789-00', '(11) 99234-5678', gustavoxav@email.com', 'Rua das Pedras, 123'),
('Thiago Rocha', Thiago.jpg', '1985-11-10', '987.654.321-00', '(11) 99876-5432', thiagorocha@email.com', 'Av. Brasil, 456');


Insert Funcionários
INSERT INTO funcionarios (nome)
VALUES 
('Thiago Func'),
('Fernanda Souza');

-- Bicicletas
INSERT INTO itens (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) VALUES
('bicicleta', 'MTB 29', 'Caloi', 'Bicicleta de trilha com 21 marchas', 15.00, '', 'SEG123456', TRUE),
('bicicleta', 'Elétrica 500W', 'Sense', 'Bicicleta elétrica com autonomia de 40km', 25.00, '', 'SEG987654', TRUE);

-- Equipamentos Gerais
INSERT INTO itens (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) VALUES
('capacete', 'Capacete', 'Giro', 'Capacete de ciclismo', 5.00, '', NULL, TRUE),
('farolete', 'Farol LED', 'Trek', 'Farol LED', 3.00, '', NULL, TRUE),
('squeeze', 'Squeeze 600ml', 'Nike', 'Squeeze térmico', 1.00, '', NULL, TRUE),
('suporte_para_squeeze', 'Suporte de Bicicleta', 'Shimano', 'Suporte para squeeze', 0.50, '', NULL, TRUE),
('pisca_alerta', 'Pisca Dianteiro', 'GTS', 'Pisca alerta dianteiro LED', 2.00, '', NULL, TRUE),
('acolchoamento_selim', 'Empresa Banco', 'Atrio', 'Banco de Gel', 1.50, '', NULL, TRUE),
('refletor_roda', 'Refletor de Roda', shimano, 'Refletor circular para rodas', 0.75, '', NULL, TRUE),
('refletor_selim', 'Refletor Traseiro', shimano, 'Refletor vermelho traseiro', 0.75, '', NULL, TRUE),
('cadeado', 'Cadeado Antifurto', Haga, 'Cadeado com senha numérica', 1.00, '', NULL, TRUE),
('tranca', 'Tranca Alta Segurança', Empresa Tranca, 'Tranca com chave e alarme', 2.50, '', NULL, TRUE)

