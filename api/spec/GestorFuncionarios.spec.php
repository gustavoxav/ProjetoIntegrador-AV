<?php

use PHPUnit\Framework\ExpectationFailedException;

describe("GestorFuncionario", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        realizarLoginTests('Gerente');
        $this->funcionarioRepo = new RepositorioFuncionarioEmBDR($this->pdo);
    });
    afterAll(function () {
        realizarLogout();
    });

    it("Deve retornar todos os funcionarios quando nenhum filtro é passado", function () {
        $gestor = new GestorFuncionario($this->funcionarioRepo);
        $funcionarios = $gestor->obterFuncionarios(null);

        expect($funcionarios)->not->toBe(null);
        expect($funcionarios)->toBeAn('array');
        expect(count($funcionarios))->toBeGreaterThan(0);
        expect($funcionarios[0])->toBeAnInstanceOf(Funcionario::class);
    });

    it("Deve retornar um funcionario por código", function () {
        $gestor = new GestorFuncionario($this->funcionarioRepo);
        $funcionario = $gestor->obterFuncionarios(1);

        expect($funcionario)->not->toBe(null);
        expect($funcionario)->toBeAnInstanceOf(Funcionario::class);
        expect($funcionario->getCodigo())->toEqual(1);
    });

    it("Deve retornar null quando o funcionario não é encontrado", function () {
        $gestor = new GestorFuncionario($this->funcionarioRepo);
        $funcionario = $gestor->obterFuncionarios("00000000000");

        expect($funcionario)->toBe(null);
    });
});
