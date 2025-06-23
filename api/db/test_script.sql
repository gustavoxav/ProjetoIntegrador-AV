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

-- Índices para as tabelas
CREATE INDEX idx_locacao_cliente ON locacao(cliente_id);
CREATE INDEX idx_locacao_funcionario ON locacao(funcionario_id);
CREATE INDEX idx_item_locado_equipamento ON item_locado(equipamento_id);
CREATE INDEX idx_item_locado_locacao ON item_locado(locacao_id);
CREATE INDEX idx_devolucao_locacao ON devolucao(locacao_id);
CREATE INDEX idx_devolucao_funcionario ON devolucao(funcionario_id);

-- Cliente
insert into cliente (nome_completo, foto, data_nascimento, cpf, telefone, email, endereco) values
('Gustavo Xavier Saldanha', 'https://super.abril.com.br/wp-content/uploads/2018/05/humanidade-causa-cc3a2ncer-em-animais-selvagens.png?w=720&h=440&crop=1', '2002-11-11', '12345678900', '(11) 99234-5678', 'gustavoxav@email.com', 'Rua das Pedras, 123'),
('Thiago Rocha', 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/10/26/1095416860-20144148136268.jpg', '1985-11-10', '98765432100', '(11) 99876-5432', 'thiagorocha@email.com', 'Av. Brasil, 456'),
('Fernanda Souza', 'https://vegazeta.com.br/wp-content/uploads/2021/03/Arthurs-Acres-Animal-Sanctuary-2.jpg', '1990-05-15', '45678912300', '(11) 93456-7890', 'fernandasouza@gmail.com', 'Rua das Flores, 789'),
('Lucas Almeida', 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/1-animal.jpg', '1995-03-20', '32165498700', '(11) 91234-5678', 'lucasalmeida@gmail.com', 'Av. das Palmeiras, 321'),
('Mariano Costa', 'https://jpimg.com.br/uploads/2025/03/7-animais-mais-fofos-do-mundo.jpg', '1992-08-25', '65432198700', '(11) 92345-6789', 'marianocosta@gmail.com', 'Rua do Sol, 654'),
('Amanda Ribeiro', 'https://jpimg.com.br/uploads/2025/02/8-animais-mais-fortes-do-mundo.jpg', '1996-04-12', '12345678001', '(11) 99123-4567', 'amanda.ribeiro@gmail.com', 'Rua Jacarandá, 87'),
('Bruno Costa', 'https://portaledicase.com/wp-content/uploads/2025/02/Hipopotamo-1024x683.jpg', '1989-08-25', '23456789002', '(21) 99876-5432', 'bruno.costa@email.com', 'Av. Copacabana, 145'),
('Carolina Mello', 'https://rizzoimobiliaria.com.br/images/media/dfe779831f7a3f38504a77dbfa883a341673881279.jpg', '1994-12-03', '34567890103', '(31) 98765-4321', 'carol.mello@gmail.com', 'Rua das Palmeiras, 321'),
('Diego Nunes', 'https://cdn.gazetasp.com.br/img/c/825/500/dn_arquivo/2025/01/lobo-guara.jpg', '1992-01-10', '45678901204', '(41) 97654-3210', 'diego.nunes@hotmail.com', 'Travessa do Sol, 12'),
('Elisa Martins', 'https://ogimg.infoglobo.com.br/in/14638550-9ee-f9a/FT1086A/20141123-125719.jpg', '1990-07-28', '56789012305', '(51) 96543-2109', 'elisa.martins@yahoo.com', 'Rua dos Lírios, 98'),
('Felipe Gomes', 'https://ufape.com.br/wp-content/uploads/2024/06/Ufape-Hospital-Veterinario-filhote-de-cachorro-brincando-na-grama-GS2-MKT-Freepik.jpg', '1995-03-05', '67890123406', '(61) 95432-1098', 'felipe.gomes@outlook.com', 'Alameda Central, 250');

-- Funcionario - Pimenta: "projetoI123456" - Senha:"123456"
INSERT INTO funcionario (nome, cpf, senha_hash, salt, cargo) values
('Patrícia Oliveira', '11111111111', '857666c91a59f6d355fb856ef300dd84ba6ab056cfaad15eb309ee5e039d5c6e8001dea6c999b37af29cf380b4abd05d97e20a11958bd34900efa0f553f1f3a9', '210b326aa961fccb048f7a22a262a3f9', 'Gerente'),
('Renato Silva', '22222222222', 'd8e2c8d3cf2607478f048689a13cdeeacdd28fe57525ce33f909e5bf0416ddb915d9b25226adcd336233bd60fa81a7c415306afd90c055e5466ae1067c8a521d', 'b90628876a1520c2fce6a30ef078bf93', 'Atendente'),
('Juliana Castro', '33333333333', '2a66b958b826a52eefb9168840f477fd3e4413b2ee820aaa4163f62653624db63d257b5c17067cacdcb3b4732ad05bbfea3013719d431460c100e85f8d7f42fb', '5dc1bae9ad253ca0751e78a2320c93c7', 'Mecanico'),
('Marcelo Teixeira', '44444444444', '3beae5a16d56d4bbb18c951c526a78202032af3514fed8eb7339c070b9de38f556ad391b95b753b0f740b3cbc687e45450c27dfdb3b3d0cef15eef71254dcebc', 'f60ee44a56eb2667329bfb4c3b0f6e1c', 'Atendente'),
('Aline Fernandes', '55555555555', 'e80a16456cc5a613c4707ff3b2618e79ea85ba3e20d15e480d20b3da88ae46a498d80103a9663977043d0ee758edaa46e80b1ca72ebeb5a3045ecc3503b604bb', '218df1d9295a4009dbdba69eb70aafa9', 'Gerente');

-- Bicicleta
insert into equipamento (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) values
('bicicleta', 'MTB 29', 'Caloi', 'Bicicleta de trilha com 21 marchas', 15.00, '', 'SEG123456', TRUE),
('bicicleta', 'Elétrica 500W', 'Sense', 'Bicicleta elétrica com autonomia de 40km', 25.00, '', 'SEG987654', TRUE),
('bicicleta', 'Urban Speed 2024', 'Specialized', 'Bicicleta urbana de alta performance', 22.00, '', 'SEG101010', TRUE),
('bicicleta', 'Trail Master 500', 'Scott', 'Mountain Bike com suspensão total', 30.00, '', 'SEG202020', TRUE),
('bicicleta', 'EcoBike City', 'Oggi', 'Bicicleta elétrica dobrável', 27.50, '', 'SEG303030', TRUE);

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
('tranca', 'Tranca Alta Segurança', 'Empresa Tranca', 'Tranca com chave e alarme', 2.50, '', NULL, TRUE),
('capacete', 'Urban Helmet', 'Bell', 'Capacete urbano ventilado', 6.00, '', NULL, TRUE),
('capacete', 'Sport Pro', 'Giro', 'Capacete com viseira removível', 7.00, '', NULL, TRUE),
('farolete', 'LED Max', 'Trek', 'Farol LED recarregável', 3.50, '', NULL, TRUE),
('farolete', 'Light Beam', 'GTS', 'Farol traseiro e dianteiro conjunto', 4.00, '', NULL, TRUE),
('squeeze', 'Thermo 700ml', 'Nike', 'Squeeze com isolamento térmico', 1.50, '', NULL, TRUE),
('tranca', 'Tranca X-Pro', 'Haga', 'Tranca com alarme embutido', 3.00, '', NULL, TRUE),
('cadeado', 'Cadeado Flex', 'Zoli', 'Cadeado com senha digital', 1.75, '', NULL, TRUE),
('refletor_roda', 'Roda Reflex', 'Shimano', 'Refletor com encaixe magnético', 1.00, '', NULL, TRUE),
('refletor_selim', 'Reflex Red', 'Giro', 'Refletor traseiro com LED', 1.20, '', NULL, TRUE),
('acolchoamento_selim', 'GelComfort', 'Atrio', 'Selim com gel extra confortável', 2.00, '', NULL, TRUE),
('suporte_para_squeeze', 'Bike Holder', 'Shimano', 'Suporte ajustável para garrafa', 0.75, '', NULL, TRUE);
