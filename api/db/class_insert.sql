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


-- LOCACAO 1
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) VALUES (NOW(),2,DATE_ADD(NOW(), INTERVAL 3 HOUR),0.00, 30.00, 1, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 1, 1); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 30.00, 1, 1);

-- LOCACAO 2
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) VALUES (NOW(),2,DATE_ADD(NOW(), INTERVAL 2 HOUR),0.00, 30.00, 4, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 1, 2); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 4, 2); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 5, 2); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 6, 2); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 30.00, 2, 2);

-- LOCACAO 3
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) VALUES (NOW(),2,DATE_ADD(NOW(), INTERVAL 7 HOUR),70.00, 700.00, 8, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 1, 3); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 4, 3); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 5, 3); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 6, 3); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 30.00, 3, 2);

-- LOCACAO 4
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 5 HOUR), 10.00, 120.00, 5, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 40.00, 7, 4); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 40.00, 8, 4); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 50.00, 9, 4); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 120.00, 4, 4);

-- LOCACAO 5
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0.00, 20.00, 3, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 1, 20.00, 10, 5); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 20.00, 5, 2);

-- LOCACAO 6
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 4, DATE_ADD(NOW(), INTERVAL 6 HOUR), 30.00, 270.00, 9, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 60.00, 11, 6); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 60.00, 12, 6); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 60.00, 13, 6); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 60.00, 14, 6); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 270.00, 6, 4);

-- LOCACAO 7
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 5, DATE_ADD(NOW(), INTERVAL 7 HOUR), 15.00, 285.00, 7, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 55.00, 2, 7); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 60.00, 3, 7); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 65.00, 4, 7); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 285.00, 7, 2);

-- LOCACAO 8
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0.00, 25.00, 11, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 1, 25.00, 15, 8); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 25.00, 8, 4);

-- LOCACAO 9
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 5 HOUR), 20.00, 180.00, 6, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 60.00, 8, 9); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 60.00, 9, 9); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 180.00, 9, 2);

-- LOCACAO 10
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 2, DATE_ADD(NOW(), INTERVAL 4 HOUR), 0.00, 50.00, 12, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 25.00, 10, 10); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 25.00, 11, 10); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 50.00, 10, 2);

-- -- LOCACAO 11
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 4 HOUR), 5.00, 85.00, 3, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 1, 11); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 2, 11); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 85.00, 11, 4);

-- -- LOCACAO 12
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 0.00, 40.00, 6, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 40.00, 3, 12); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 40.00, 12, 2);

-- -- LOCACAO 13
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 5, DATE_ADD(NOW(), INTERVAL 6 HOUR), 25.00, 175.00, 7, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 60.00, 4, 13); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 90.00, 5, 13); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 175.00, 13, 4);

-- -- LOCACAO 14
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0.00, 20.00, 10, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 1, 20.00, 6, 14); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 20.00, 14, 2);

-- -- LOCACAO 15
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 4, DATE_ADD(NOW(), INTERVAL 5 HOUR), 10.00, 180.00, 12, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 60.00, 7, 15); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 60.00, 8, 15); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 60.00, 9, 15); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 180.00, 15, 4);

-- -- LOCACAO 16
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 2, DATE_ADD(NOW(), INTERVAL 3 HOUR), 0.00, 50.00, 1, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 25.00, 10, 16); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 25.00, 11, 16); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 50.00, 16, 2);

-- -- LOCACAO 17
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 4 HOUR), 15.00, 100.00, 4, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 50.00, 12, 17); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 50.00, 13, 17); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 100.00, 17, 4);

-- -- LOCACAO 18
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0.00, 20.00, 5, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 1, 20.00, 14, 18); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 20.00, 18, 2);

-- -- LOCACAO 19
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 4, DATE_ADD(NOW(), INTERVAL 6 HOUR), 30.00, 280.00, 9, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 70.00, 15, 19); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 70.00, 1, 19); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 280.00, 19, 4);

-- -- LOCACAO 20
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
VALUES (NOW(), 2, DATE_ADD(NOW(), INTERVAL 3 HOUR), 0.00, 60.00, 8, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 2, 20); 
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 3, 20); 
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 60.00, 20, 2);

-- -- LOCACAO 21
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 5 HOUR), 10.00, 90.00, 2, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 4, 21);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 5, 21);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 90.00, 21, 4);

-- -- LOCACAO 22
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0.00, 25.00, 7, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 1, 25.00, 6, 22);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 25.00, 22, 2);

-- -- LOCACAO 23
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 4, DATE_ADD(NOW(), INTERVAL 7 HOUR), 20.00, 240.00, 5, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 80.00, 7, 23);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 4, 80.00, 8, 23);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 240.00, 23, 4);

-- -- LOCACAO 24
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 2, DATE_ADD(NOW(), INTERVAL 3 HOUR), 5.00, 55.00, 9, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 9, 24);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 55.00, 24, 2);

-- -- LOCACAO 25
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 5 HOUR), 0.00, 90.00, 12, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 10, 25);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 11, 25);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 90.00, 25, 4);

-- -- LOCACAO 26
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0.00, 20.00, 1, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 1, 20.00, 12, 26);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 20.00, 26, 2);

-- -- LOCACAO 27
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 5, DATE_ADD(NOW(), INTERVAL 8 HOUR), 50.00, 350.00, 4, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 70.00, 13, 27);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 70.00, 14, 27);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 5, 60.00, 15, 27);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 350.00, 27, 4);

-- -- LOCACAO 28
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 2, DATE_ADD(NOW(), INTERVAL 3 HOUR), 0.00, 60.00, 10, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 1, 28);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 2, 30.00, 2, 28);
UPDATE equipamento SET disponivel = 0 WHERE id = 1;
UPDATE equipamento SET disponivel = 0 WHERE id = 2;

-- -- LOCACAO 29
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 3, DATE_ADD(NOW(), INTERVAL 4 HOUR), 15.00, 90.00, 6, 2);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 3, 29);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 3, 30.00, 4, 29);
INSERT INTO devolucao ( data_hora_devolucao, valor_pago, locacao_id, funcionario_id ) VALUES ( NOW(), 90.00, 29, 4);

-- -- LOCACAO 30
INSERT INTO locacao ( data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id)
VALUES (NOW(), 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0.00, 20.00, 8, 4);
INSERT INTO item_locado ( tempo_contratado, subtotal, equipamento_id, locacao_id ) VALUES ( 1, 20.00, 5, 30);
UPDATE equipamento SET disponivel = 0 WHERE id = 5;
