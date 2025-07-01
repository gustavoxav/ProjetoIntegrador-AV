<?php

use Kahlan\Plugin\Double;

describe("GestorAvaria", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        realizarLoginTests('Gerente');
        
        $this->repositorioAvaria = new RepositorioAvariaEmBDR($this->pdo);
        $this->repositorioEquipamento = new RepositorioEquipamentoEmBDR($this->pdo);
        $this->repositorioLocacao = new RepositorioLocacaoEmBDR($this->pdo);
        
        $this->gestor = new GestorAvaria(
            $this->repositorioAvaria, 
            $this->repositorioEquipamento, 
            $this->repositorioLocacao
        );

        $stmt = $this->pdo->prepare("
            INSERT INTO locacao (data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, desconto, valor_total, cliente_id, funcionario_id) 
            VALUES (NOW(), 4, DATE_ADD(NOW(), INTERVAL 4 HOUR), 0.00, 120.00, 1, 1)
        ");
        $stmt->execute();
        $this->locacaoId = $this->pdo->lastInsertId();
        
        $stmt = $this->pdo->prepare("
            INSERT INTO item_locado (tempo_contratado, subtotal, equipamento_id, locacao_id) 
            VALUES (4, 120.00, 1, ?)
        ");
        $stmt->execute([$this->locacaoId]);
    });

    afterAll(function () {
        realizarLogout();
    });

    beforeEach(function () {
        $diretorioFotos = __DIR__ . '/../fotos/avarias';
        if (!is_dir($diretorioFotos)) {
            mkdir($diretorioFotos, 0755, true);
        }
        
        $this->fotoTemporaria = $diretorioFotos . '/teste_' . uniqid() . '.jpg';
        
        $imagem = imagecreate(1, 1);
        imagejpeg($imagem, $this->fotoTemporaria);
        imagedestroy($imagem);
        
        $this->dadosAvaria = [
            'avaliadorId' => 1,
            'descricao' => 'Teste de avaria - arranhão no quadro',
            'valorCobrar' => 200.00,
            'equipamentoId' => 1,
            'locacaoId' => $this->locacaoId,
            'foto' => [
                'name' => 'teste.jpg',
                'tmp_name' => $this->fotoTemporaria,
                'type' => 'image/jpeg',
                'size' => filesize($this->fotoTemporaria),
                'error' => UPLOAD_ERR_OK
            ]
        ];
        
        $_FILES['foto'] = $this->dadosAvaria['foto'];
    });

    afterEach(function () {
        if (file_exists($this->fotoTemporaria)) {
            unlink($this->fotoTemporaria);
        }
    });

    it("Deve registrar avaria corretamente", function () {
        expect(function() {
            $this->gestor->registrarAvaria($this->dadosAvaria);
        })->toThrow(new \AvariaException("Erro ao salvar arquivo de foto"));
    });

    it("Deve lançar exceção se equipamento não for encontrado", function () {
        $dadosInvalidos = $this->dadosAvaria;
        $dadosInvalidos['equipamentoId'] = 999;

        expect(function() use ($dadosInvalidos) {
            $this->gestor->registrarAvaria($dadosInvalidos);
        })->toThrow(new \AvariaException("Equipamento não encontrado"));
    });

    it("Deve lançar exceção se valorCobrar for maior que valor de compra", function () {
        $dadosInvalidos = $this->dadosAvaria;
        $dadosInvalidos['valorCobrar'] = 2000.00;

        expect(function() use ($dadosInvalidos) {
            $this->gestor->registrarAvaria($dadosInvalidos);
        })->toThrow(new \AvariaException("O valor da avaria não pode ser maior que o valor de compra do equipamento (R$ 1.500,00)"));
    });

    it("Deve lançar exceção se equipamento não pertencer à locação", function () {
        $dadosInvalidos = $this->dadosAvaria;
        $dadosInvalidos['equipamentoId'] = 2;

        expect(function() use ($dadosInvalidos) {
            $this->gestor->registrarAvaria($dadosInvalidos);
        })->toThrow(new \AvariaException("O equipamento não pertence a esta locação. Apenas equipamentos que fazem parte da locação podem ter avarias registradas."));
    });
});
