<?php

describe("GestorEquipamento", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        $this->clienteRepo = new RepositorioEquipamentoEmBDR($this->pdo);
    });

    it("Deve retornar um equipamento por código", function () {
        $gestor = new GestorEquipamento($this->clienteRepo);
        $equipamento = $gestor->obterEquipamentos(1);

        expect($equipamento)->not->toBe(null);
        expect($equipamento)->toBeAnInstanceOf(Equipamento::class);
        expect($equipamento->codigo)->toEqual(1);
    });

    it("Deve retornar null quando o equipamento não é encontrado", function () {
        $gestor = new GestorEquipamento($this->clienteRepo);
        $equipamento = $gestor->obterEquipamentos("0");

        expect($equipamento)->toBe(null);
    });

    it("Deve retornar todos os equipamentos", function () {
        $gestor = new GestorEquipamento($this->clienteRepo);
        $equipamentos = $gestor->obterEquipamentos(null);

        expect($equipamentos)->toBeA('array');
        expect(count($equipamentos))->toBeGreaterThan(0);

        foreach ($equipamentos as $equipamento) {
            expect($equipamento)->toBeAnInstanceOf(Equipamento::class);
        }
    });

    it("Deve registrar uma nova avaria em um equipamento existente", function () {
        $gestor = new GestorEquipamento($this->clienteRepo);

        $equipamentoId = 1;
        $novaAvaria = "Bicicleta com avaria";

        $gestor->registrarAvaria($equipamentoId, $novaAvaria);

        $equipamentoAtualizado = $gestor->obterEquipamentos($equipamentoId);
        expect($equipamentoAtualizado->avarias)->toContain("Bicicleta com avaria");
    });
});
