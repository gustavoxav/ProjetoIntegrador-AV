<?php

use Kahlan\Plugin\Double;

describe("GestorAvaria", function () {

    beforeEach(function () {
        $this->repositorioAvaria = Double::instance(['class' => \RepositorioAvariaEmBDR::class]);
        $this->repositorioEquipamento = Double::instance(['class' => \RepositorioEquipamentoEmBDR::class]);

        $this->gestor = Double::instance([
            'class' => \GestorAvaria::class,
            'args' => [$this->repositorioAvaria, $this->repositorioEquipamento, null],
            'methods' => ['validarEquipamentoNaLocacao', 'processarUploadFoto', 'gerarUUID']
        ]);

        allow($this->gestor)->toReceive('validarEquipamentoNaLocacao')->andReturn(true);
        allow($this->gestor)->toReceive('processarUploadFoto')->andReturn('fotos/teste.jpg');
        allow($this->gestor)->toReceive('gerarUUID')->andReturn('uuid-teste');

        $this->equipamento = Double::instance([
            'class' => \Equipamento::class,
            'methods' => [
                'getValorCompra' => 1000.00,
                'jsonSerialize' => ['descricao' => 'Bike']
            ]
        ]);

        $this->dadosValidos = [
            'avaliadorId' => 1,
            'descricao' => 'Amassado',
            'valorCobrar' => 200.00,
            'equipamentoId' => 1,
            'locacaoId' => 123,
            'foto' => ['tmp_name' => '/tmp/foto.jpg', 'name' => 'foto.jpg']
        ];
    });

    it("Deve registrar avaria corretamente", function () {
        allow($this->repositorioEquipamento)->toReceive('buscarEquipamentoFiltro')->andReturn($this->equipamento);
        allow($this->repositorioAvaria)->toReceive('salvar')->andReturn(['id' => 'uuid-teste']);

        $resultado = $this->gestor->registrarAvaria($this->dadosValidos);

        expect($resultado)->toBeAn('array');
        expect($resultado['id'])->toBe('uuid-teste');
    });

    it("Deve lançar exceção se equipamento não for encontrado", function () {
        allow($this->repositorioEquipamento)->toReceive('buscarEquipamentoFiltro')->andReturn(null);

        expect(fn() => $this->gestor->registrarAvaria($this->dadosValidos))
            ->toThrow(new \AvariaException("Equipamento não encontrado"));
    });

    it("Deve lançar exceção se valorCobrar for maior que valor de compra", function () {
        allow($this->equipamento)->toReceive('getValorCompra')->andReturn(100.00);
        allow($this->repositorioEquipamento)->toReceive('buscarEquipamentoFiltro')->andReturn($this->equipamento);

        $dados = $this->dadosValidos;
        $dados['valorCobrar'] = 200.00;

        expect(fn() => $this->gestor->registrarAvaria($dados))
            ->toThrow(new \AvariaException("O valor da avaria não pode ser maior que o valor de compra do equipamento (R$ 100,00)"));
    });

    it("Deve lançar exceção se equipamento não pertencer à locação", function () {
        allow($this->repositorioEquipamento)->toReceive('buscarEquipamentoFiltro')->andReturn($this->equipamento);
        allow($this->gestor)->toReceive('validarEquipamentoNaLocacao')->andRun(function () {
            throw new \AvariaException("Equipamento não pertence à locação");
        });

        expect(fn() => $this->gestor->registrarAvaria($this->dadosValidos))
            ->toThrow(new \AvariaException("Equipamento não pertence à locação"));
    });
});
