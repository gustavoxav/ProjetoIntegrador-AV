use database_g9;

-- Cliente
insert into cliente (nome_completo, foto, data_nascimento, cpf, telefone, email, endereco) values
('Gustavo Xavier Saldanha', 'https://super.abril.com.br/wp-content/uploads/2018/05/humanidade-causa-cc3a2ncer-em-animais-selvagens.png?w=720&h=440&crop=1', '2002-11-11', '12345678900', '(11) 99234-5678', 'gustavoxav@email.com', 'Rua das Pedras, 123'),
('Thiago Rocha', 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/10/26/1095416860-20144148136268.jpg', '1985-11-10', '98765432100', '(11) 99876-5432', 'thiagorocha@email.com', 'Av. Brasil, 456'),
('Fernanda Souza', 'https://vegazeta.com.br/wp-content/uploads/2021/03/Arthurs-Acres-Animal-Sanctuary-2.jpg', '1990-05-15', '45678912300', '(11) 93456-7890', 'fernandasouza@gmail.com', 'Rua das Flores, 789'),
('Lucas Almeida', 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/1-animal.jpg', '1995-03-20', '32165498700', '(11) 91234-5678', 'lucasalmeida@gmail.com', 'Av. das Palmeiras, 321'),
('Mariano Costa', 'https://jpimg.com.br/uploads/2025/03/7-animais-mais-fofos-do-mundo.jpg', '1992-08-25', '65432198700', '(11) 92345-6789', 'marianocosta@gmail.com', 'Rua do Sol, 654');

-- Funcionario
insert into funcionario (nome) values
('Gustavo Funcionario'),
('Fernanda Funcionario'),
('Lucas Funcionario'),
('Mariano Funcionario'),
('Thiago Funcionario');

-- Bicicleta
insert into equipamento (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) values
('bicicleta', 'MTB 29', 'Caloi', 'Bicicleta de trilha com 21 marchas', 15.00, '', 'SEG123456', TRUE),
('bicicleta', 'Elétrica 500W', 'Sense', 'Bicicleta elétrica com autonomia de 40km', 25.00, '', 'SEG987654', TRUE);

-- Equipamentos Gerais
insert into equipamento (tipo, modelo, fabricante, descricao, valor_hora, avarias, numero_seguro, disponivel) values
('capacete', 'Capacete', 'Giro', 'Capacete de ciclismo', 5.00, '', NULL, TRUE),
('farolete', 'Farol LED', 'Trek', 'Farol LED', 3.00, '', NULL, TRUE),
('squeeze', 'Squeeze 600ml', 'Nike', 'Squeeze térmico', 1.00, '', NULL, FALSE),
('suporte_para_squeeze', 'Suporte de Bicicleta', 'Shimano', 'Suporte para squeeze', 0.50, '', NULL, TRUE),
('pisca_alerta', 'Pisca Dianteiro', 'GTS', 'Pisca alerta dianteiro LED', 2.00, '', NULL, TRUE),
('acolchoamento_selim', 'Empresa Banco', 'Atrio', 'Banco de Gel', 1.50, '', NULL, TRUE),
('refletor_roda', 'Refletor de Roda', 'shimano', 'Refletor circular para rodas', 0.75, '', NULL, TRUE),
('refletor_selim', 'Refletor Traseiro', 'shimano', 'Refletor vermelho traseiro', 0.75, '', NULL, TRUE),
('cadeado', 'Cadeado Antifurto', 'Haga', 'Cadeado com senha numérica', 1.00, '', NULL, TRUE),
('tranca', 'Tranca Alta Segurança', 'Empresa Tranca', 'Tranca com chave e alarme', 2.50, '', NULL, TRUE);
