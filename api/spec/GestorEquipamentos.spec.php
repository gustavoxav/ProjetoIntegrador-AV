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
        $equipamento = $gestor->obterEquipamentos("00000000000");

        expect($equipamento)->toBe(null);
    });
});
