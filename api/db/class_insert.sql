use database_g9;

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
('Felipe Gomes', 'https://ufape.com.br/wp-content/uploads/2024/06/Ufape-Hospital-Veterinario-filhote-de-cachorro-brincando-na-grama-GS2-MKT-Freepik.jpg', '1995-03-05', '67890123406', '(61) 95432-1098', 'felipe.gomes@outlook.com', 'Alameda Central, 250'),
('Eduarda Lima', 'https://super.abril.com.br/wp-content/uploads/2018/05/humanidade-causa-cc3a2ncer-em-animais-selvagens.png?w=720&h=440&crop=1', '2000-01-10', '98712345600', '(21) 91234-5678', 'eduarda.lima@email.com', 'Rua Aurora, 87'),
('Ricardo Silveira', 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/10/26/1095416860-20144148136268.jpg', '1983-04-15', '32145678901', '(11) 99911-2233', 'ricardo.silveira@email.com', 'Av. Paulista, 1001'),
('Juliana Freitas', 'https://vegazeta.com.br/wp-content/uploads/2021/03/Arthurs-Acres-Animal-Sanctuary-2.jpg', '1988-09-22', '74185296300', '(31) 98777-1122', 'juliana.freitas@gmail.com', 'Rua dos Cravos, 45'),
('Henrique Bastos', 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/1-animal.jpg', '1993-06-30', '96325874100', '(41) 99881-3344', 'henrique.bastos@gmail.com', 'Av. Paraná, 200'),
('Vanessa Rocha', 'https://jpimg.com.br/uploads/2025/03/7-animais-mais-fofos-do-mundo.jpg', '1991-11-19', '11223344556', '(61) 93456-1122', 'vanessa.rocha@gmail.com', 'Rua do Campo, 600'),
('Leonardo Brito', 'https://jpimg.com.br/uploads/2025/02/8-animais-mais-fortes-do-mundo.jpg', '1997-02-28', '99887766554', '(11) 98712-4563', 'leonardo.brito@gmail.com', 'Rua Acácia, 72'),
('Priscila Andrade', 'https://portaledicase.com/wp-content/uploads/2025/02/Hipopotamo-1024x683.jpg', '1990-12-15', '55667788990', '(71) 98321-7788', 'priscila.andrade@email.com', 'Av. Salvador, 300'),
('Eduardo Menezes', 'https://rizzoimobiliaria.com.br/images/media/dfe779831f7a3f38504a77dbfa883a341673881279.jpg', '1986-08-05', '66778899001', '(51) 98811-2211', 'eduardo.menezes@gmail.com', 'Rua Araguaia, 111'),
('Nathalia Santos', 'https://cdn.gazetasp.com.br/img/c/825/500/dn_arquivo/2025/01/lobo-guara.jpg', '1993-10-02', '77889900112', '(81) 99223-3344', 'nathalia.santos@hotmail.com', 'Rua Ipê Roxo, 55'),
('Bruno Tavares', 'https://ogimg.infoglobo.com.br/in/14638550-9ee-f9a/FT1086A/20141123-125719.jpg', '1989-05-08', '88990011223', '(91) 98765-7788', 'bruno.tavares@yahoo.com', 'Travessa das Rosas, 14'),
('Isabela Correia', 'https://ufape.com.br/wp-content/uploads/2024/06/Ufape-Hospital-Veterinario-filhote-de-cachorro-brincando-na-grama-GS2-MKT-Freepik.jpg', '1996-07-14', '99001122334', '(62) 99874-1122', 'isabela.correia@outlook.com', 'Alameda do Vale, 789');

-- Funcionario - Pimenta: "projetoI123456" - Senha:"123456"
INSERT INTO funcionario (nome, cpf, senha_hash, salt, cargo) values
('Patrícia Oliveira', '11111111111', '857666c91a59f6d355fb856ef300dd84ba6ab056cfaad15eb309ee5e039d5c6e8001dea6c999b37af29cf380b4abd05d97e20a11958bd34900efa0f553f1f3a9', '210b326aa961fccb048f7a22a262a3f9', 'Gerente'),
('Renato Silva', '22222222222', 'd8e2c8d3cf2607478f048689a13cdeeacdd28fe57525ce33f909e5bf0416ddb915d9b25226adcd336233bd60fa81a7c415306afd90c055e5466ae1067c8a521d', 'b90628876a1520c2fce6a30ef078bf93', 'Atendente'),
('Juliana Castro', '33333333333', '2a66b958b826a52eefb9168840f477fd3e4413b2ee820aaa4163f62653624db63d257b5c17067cacdcb3b4732ad05bbfea3013719d431460c100e85f8d7f42fb', '5dc1bae9ad253ca0751e78a2320c93c7', 'Mecanico'),
('Marcelo Teixeira', '44444444444', '3beae5a16d56d4bbb18c951c526a78202032af3514fed8eb7339c070b9de38f556ad391b95b753b0f740b3cbc687e45450c27dfdb3b3d0cef15eef71254dcebc', 'f60ee44a56eb2667329bfb4c3b0f6e1c', 'Atendente'),
('Aline Fernandes', '55555555555', 'e80a16456cc5a613c4707ff3b2618e79ea85ba3e20d15e480d20b3da88ae46a498d80103a9663977043d0ee758edaa46e80b1ca72ebeb5a3045ecc3503b604bb', '218df1d9295a4009dbdba69eb70aafa9', 'Gerente');

-- Bicicleta
insert into equipamento (tipo, modelo, fabricante, descricao, valor_compra, valor_hora, avarias, numero_seguro, disponivel) values
('bicicleta', 'MTB 29', 'Caloi', 'Bicicleta de trilha com 21 marchas', 1500.00, 30.00, '', 'SEG123456', TRUE),
('bicicleta', 'Elétrica 500W', 'Sense', 'Bicicleta elétrica com autonomia de 40km', 3500.00, 70.00, '', 'SEG987654', TRUE),
('bicicleta', 'Urban Speed 2024', 'Specialized', 'Bicicleta urbana de alta performance', 2800.00, 56.00, '', 'SEG101010', TRUE),
('bicicleta', 'Trail Master 500', 'Scott', 'Mountain Bike com suspensão total', 4200.00, 84.00, '', 'SEG202020', TRUE),
('bicicleta', 'EcoBike City', 'Oggi', 'Bicicleta elétrica dobrável', 2200.00, 44.00, '', 'SEG303030', TRUE);

-- Equipamentos Gerais
insert into equipamento (tipo, modelo, fabricante, descricao, valor_compra, valor_hora, avarias, numero_seguro, disponivel) values
('capacete', 'Capacete', 'Giro', 'Capacete de ciclismo', 180.00, 3.60, '', NULL, TRUE),
('farolete', 'Farol LED', 'Trek', 'Farol LED', 120.00, 2.40, '', NULL, TRUE),
('squeeze', 'Squeeze 600ml', 'Nike', 'Squeeze térmico', 45.00, 0.90, '', NULL, TRUE),
('suporte_para_squeeze', 'Suporte de Bicicleta', 'Shimano', 'Suporte para squeeze', 35.00, 0.70, '', NULL, TRUE),
('pisca_alerta', 'Pisca Dianteiro', 'GTS', 'Pisca alerta dianteiro LED', 80.00, 1.60, '', NULL, TRUE),
('acolchoamento_selim', 'Empresa Banco', 'Atrio', 'Banco de Gel', 95.00, 1.90, '', NULL, TRUE),
('refletor_roda', 'Refletor de Roda', 'shimano', 'Refletor circular para rodas', 25.00, 0.50, '', NULL, TRUE),
('refletor_selim', 'Refletor Traseiro', 'shimano', 'Refletor vermelho traseiro', 25.00, 0.50, '', NULL, TRUE),
('cadeado', 'Cadeado Antifurto', 'Haga', 'Cadeado com senha numérica', 65.00, 1.30, '', NULL, TRUE),
('tranca', 'Tranca Alta Segurança', 'Empresa Tranca', 'Tranca com chave e alarme', 150.00, 3.00, '', NULL, TRUE),
('capacete', 'Urban Helmet', 'Bell', 'Capacete urbano ventilado', 220.00, 4.40, '', NULL, TRUE),
('capacete', 'Sport Pro', 'Giro', 'Capacete com viseira removível', 280.00, 5.60, '', NULL, TRUE),
('farolete', 'LED Max', 'Trek', 'Farol LED recarregável', 160.00, 3.20, '', NULL, TRUE),
('farolete', 'Light Beam', 'GTS', 'Farol traseiro e dianteiro conjunto', 200.00, 4.00, '', NULL, TRUE),
('squeeze', 'Thermo 700ml', 'Nike', 'Squeeze com isolamento térmico', 75.00, 1.50, '', NULL, TRUE),
('tranca', 'Tranca X-Pro', 'Haga', 'Tranca com alarme embutido', 180.00, 3.60, '', NULL, TRUE),
('cadeado', 'Cadeado Flex', 'Zoli', 'Cadeado com senha digital', 90.00, 1.80, '', NULL, TRUE),
('refletor_roda', 'Roda Reflex', 'Shimano', 'Refletor com encaixe magnético', 40.00, 0.80, '', NULL, TRUE),
('refletor_selim', 'Reflex Red', 'Giro', 'Refletor traseiro com LED', 55.00, 1.10, '', NULL, TRUE),
('acolchoamento_selim', 'GelComfort', 'Atrio', 'Selim com gel extra confortável', 130.00, 2.60, '', NULL, TRUE),
('suporte_para_squeeze', 'Bike Holder', 'Shimano', 'Suporte ajustável para garrafa', 50.00, 1.00, '', NULL, TRUE);


-- LOCACAO 1
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) VALUES ('2024-01-05 09:00:00', 3, '2024-01-05 12:00:00', 0.00, 90.00, 1, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 90.00, 1, 1); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-01-05 12:00:00', 90.00, 1, 1);

-- LOCACAO 2
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) VALUES ('2024-01-15 14:00:00', 4, '2024-01-15 18:00:00', 10.00, 280.00, 4, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 280.00, 2, 2); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 14.40, 6, 2); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 9.60, 7, 2); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 5.20, 9, 2); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-01-15 18:00:00', 309.20, 2, 2);

-- LOCACAO 3
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) VALUES ('2024-02-10 10:30:00', 6, '2024-02-10 16:30:00', 15.00, 510.00, 8, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 180.00, 1, 3); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 420.00, 2, 3); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 21.60, 6, 3); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-02-10 16:30:00', 510.00, 3, 2);

-- LOCACAO 4
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-03-08 08:00:00', 5, '2024-03-08 13:00:00', 20.00, 300.00, 5, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 168.00, 3, 4); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 420.00, 4, 4); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 220.00, 5, 4); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 18.00, 6, 4); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-03-08 13:00:00', 300.00, 4, 4);

-- LOCACAO 5
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-04-12 15:30:00', 2, '2024-04-12 17:30:00', 0.00, 60.00, 3, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 60.00, 1, 5); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-04-12 17:30:00', 60.00, 5, 2);

-- LOCACAO 6
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-05-18 09:00:00', 8, '2024-05-18 17:00:00', 50.00, 850.00, 9, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 8, 560.00, 2, 6); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 8, 672.00, 4, 6); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 8, 352.00, 5, 6); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 8, 28.80, 6, 6); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-05-18 17:00:00', 850.00, 6, 4);

-- LOCACAO 7
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-06-22 11:30:00', 3, '2024-06-22 14:30:00', 0.00, 168.00, 7, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 168.00, 3, 7); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-06-22 14:30:00', 168.00, 7, 2);

-- LOCACAO 8
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-07-15 07:00:00', 6, '2024-07-15 13:00:00', 25.00, 450.00, 11, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 420.00, 2, 8); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 180.00, 1, 8); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 21.60, 6, 8); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-07-15 13:00:00', 450.00, 8, 4);

-- LOCACAO 9
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-08-10 13:00:00', 4, '2024-08-10 17:00:00', 15.00, 220.00, 6, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 264.00, 5, 9); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 14.40, 6, 9); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-08-10 17:00:00', 220.00, 9, 2);

-- LOCACAO 10
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-09-05 16:00:00', 2, '2024-09-05 18:00:00', 0.00, 112.00, 12, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 112.00, 3, 10); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-09-05 18:00:00', 112.00, 10, 2);

-- -- LOCACAO 11
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-10-12 10:00:00', 4, '2024-10-12 14:00:00', 10.00, 240.00, 3, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 120.00, 1, 11); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 280.00, 2, 11); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 14.40, 6, 11); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-10-12 14:00:00', 240.00, 11, 4);

-- -- LOCACAO 12
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-10-25 14:30:00', 3, '2024-10-25 17:30:00', 0.00, 168.00, 6, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 168.00, 3, 12); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-10-25 17:30:00', 168.00, 12, 2);

-- -- LOCACAO 13
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-11-29 08:00:00', 6, '2024-11-29 14:00:00', 100.00, 600.00, 7, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 504.00, 4, 13); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 264.00, 5, 13); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 21.60, 6, 13); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-11-29 14:00:00', 600.00, 13, 4);

-- -- LOCACAO 14
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-12-15 09:30:00', 2, '2024-12-15 11:30:00', 0.00, 60.00, 10, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 60.00, 1, 14); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-12-15 11:30:00', 60.00, 14, 2);

-- -- LOCACAO 15
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2024-12-24 15:00:00', 5, '2024-12-24 20:00:00', 30.00, 420.00, 12, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 350.00, 2, 15); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 420.00, 4, 15); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 18.00, 6, 15); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-12-24 20:00:00', 420.00, 15, 4);

-- -- LOCACAO 16
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2025-01-02 11:00:00', 3, '2025-01-02 14:00:00', 0.00, 126.00, 1, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 90.00, 1, 16); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 10.80, 6, 16); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2025-01-02 14:00:00', 126.00, 16, 2);

-- -- LOCACAO 17
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2025-01-10 13:30:00', 4, '2025-01-10 17:30:00', 20.00, 280.00, 4, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 280.00, 2, 17); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 17.60, 7, 17); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2025-01-10 17:30:00', 280.00, 17, 4);

-- -- LOCACAO 18
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2025-01-18 09:15:00', 5, '2025-01-18 14:15:00', 15.00, 350.00, 5, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 420.00, 4, 18); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 220.00, 5, 18); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2025-01-18 14:15:00', 350.00, 18, 2);

-- -- LOCACAO 19
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES ('2025-01-22 16:00:00', 2, '2025-01-22 18:00:00', 0.00, 140.00, 9, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 140.00, 2, 19); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 7.20, 6, 19); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2025-01-22 18:00:00', 140.00, 19, 4);

-- -- LOCACAO 20
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2025-01-25 12:00:00', 3, '2025-01-25 15:00:00', 0.00, 192.00, 2, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 168.00, 3, 20);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 132.00, 5, 20);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2025-01-25 15:00:00', 192.00, 20, 4);

-- -- LOCACAO 21
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 3 HOUR), 0.00, 90.00, 10, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 90.00, 1, 21);
UPDATE equipamento SET disponivel = 0 WHERE id = 1;

-- -- LOCACAO 22
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 4, DATE_ADD(NOW(), INTERVAL 4 HOUR), 15.00, 285.00, 6, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 280.00, 2, 22);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 176.00, 5, 22);
UPDATE equipamento SET disponivel = 0 WHERE id = 2;
UPDATE equipamento SET disponivel = 0 WHERE id = 5;

-- LOCACAO 23
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-03-15 10:00:00', 3, '2024-03-15 13:00:00', 5.00, 35.00, 13, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 10.80, 6, 23);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 7.20, 7, 23);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 2.70, 8, 23);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 2.10, 9, 23);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 4.80, 10, 23);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-03-15 13:00:00', 35.00, 23, 4);

-- LOCACAO 24
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-04-20 14:30:00', 2, '2024-04-20 16:30:00', 0.00, 28.00, 14, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 8.80, 11, 24);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 11.20, 12, 24);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 6.40, 13, 24);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 8.00, 14, 24);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-04-20 16:30:00', 28.00, 24, 4);

-- LOCACAO 25
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-05-25 09:15:00', 4, '2024-05-25 13:15:00', 10.00, 45.00, 15, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 6.00, 8, 25);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 14.40, 15, 25);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 7.20, 16, 25);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 3.20, 17, 25);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 4.40, 18, 25);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-05-25 13:15:00', 45.00, 25, 2);

-- LOCACAO 26
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-06-08 11:00:00', 5, '2024-06-08 16:00:00', 0.00, 65.00, 16, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 10.40, 19, 26);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 13.00, 20, 26);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 18.00, 15, 26);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 9.00, 16, 26);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 5.00, 21, 26);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-06-08 16:00:00', 65.00, 26, 4);

-- LOCACAO 27
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-07-22 08:30:00', 6, '2024-07-22 14:30:00', 20.00, 180.00, 17, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 180.00, 1, 27);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 21.60, 6, 27);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 14.40, 7, 27);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 9.60, 10, 27);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 6, 7.80, 17, 27);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-07-22 14:30:00', 180.00, 27, 2);

-- LOCACAO 28
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-08-18 15:45:00', 3, '2024-08-18 18:45:00', 0.00, 32.00, 18, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 5.40, 16, 28);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 3.90, 17, 28);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 3.30, 18, 28);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 7.80, 20, 28);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 10.80, 21, 28);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-08-18 18:45:00', 32.00, 28, 4);

-- LOCACAO 29
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-09-12 12:00:00', 4, '2024-09-12 16:00:00', 15.00, 85.00, 19, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 224.00, 3, 29);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 17.60, 11, 29);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 12.80, 13, 29);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 6.40, 8, 29);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 2.80, 9, 29);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-09-12 16:00:00', 85.00, 29, 2);

-- LOCACAO 30
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-10-30 16:30:00', 2, '2024-10-30 18:30:00', 0.00, 25.00, 20, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 7.20, 16, 30);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 5.20, 20, 30);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 3.60, 17, 30);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 2.20, 18, 30);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 2.00, 21, 30);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-10-30 18:30:00', 25.00, 30, 4);

-- LOCACAO 31
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-11-15 10:30:00', 5, '2024-11-15 15:30:00', 25.00, 200.00, 21, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 350.00, 2, 31);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 28.00, 12, 31);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 20.00, 14, 31);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 7.50, 8, 31);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-11-15 15:30:00', 200.00, 31, 4);

-- LOCACAO 32
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES ('2024-12-30 14:00:00', 3, '2024-12-30 17:00:00', 0.00, 95.00, 22, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 90.00, 1, 32);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 168.00, 3, 32);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 10.80, 6, 32);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 9.60, 7, 32);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( '2024-12-30 17:00:00', 95.00, 32, 2);
