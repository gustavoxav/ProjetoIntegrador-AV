use bd_teste_g9;

-- Clientes
insert into clientes (nome_completo, foto, data_nascimento, cpf, telefone, email, endereco) values
('Gustavo Xavier Saldanha', 'https://drive.google.com/file/d/1dVmHQ3Zhx8mjNCpkK67SqlSSPBJ2ATYU/view?usp=drive_link', '2002-11-11', '123.456.789-00', '(11) 99234-5678', 'gustavoxav@email.com', 'Rua das Pedras, 123'),
('Thiago Rocha', 'https://drive.google.com/file/d/1uOL0bVqlokqORpwV6uzNCIxmWg9m0ZbB/view?usp=sharing', '1985-11-10', '987.654.321-00', '(11) 99876-5432', 'thiagorocha@email.com', 'Av. Brasil, 456'),
('Fernanda Souza', 'https://drive.google.com/file/d/1AYjwEe6ZYbRD0EOblQ_ieZ5M-QgtChiX/view?usp=drive_link', '1990-05-15', '456.789.123-00', '(11) 93456-7890', 'fernandasouza@gmail.com', 'Rua das Flores, 789'),
('Lucas Almeida', 'https://drive.google.com/file/d/1U2fZ1J0dkfDGg7hFIuDCNPralFa-aqTJ/view?usp=drive_link', '1995-03-20', '321.654.987-00', '(11) 91234-5678', 'lucasalmeida@gmail.com', 'Av. das Palmeiras, 321'),
('Mariano Costa', 'https://drive.google.com/file/d/1mXoP7cQogSH0Ikt-FhdydYIKyPqxLWza/view?usp=drive_link', '1992-08-25', '654.321.987-00', '(11) 92345-6789', 'marianocosta@gmail.com', 'Rua do Sol, 654');

-- Funcionarios
insert into funcionarios (nome) values
('Gustavo Funcionario'),
('Fernanda Funcionario'),
('Lucas Funcionario'),
('Mariano Funcionario'),
('Thiago Funcionario');

-- Bicicletas
insert into itens (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) values
('bicicleta', 'MTB 29', 'Caloi', 'Bicicleta de trilha com 21 marchas', 15.00, '', 'SEG123456', TRUE),
('bicicleta', 'Elétrica 500W', 'Sense', 'Bicicleta elétrica com autonomia de 40km', 25.00, '', 'SEG987654', TRUE);

-- Equipamentos Gerais
insert into itens (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) values
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
