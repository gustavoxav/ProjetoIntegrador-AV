<?php

use PHPUnit\Framework\ExpectationFailedException;

describe("GestorFuncionario", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        $this->funcionarioRepo = new RepositorioFuncionarioEmBDR($this->pdo);
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
        expect($funcionario->codigo)->toEqual(1);
    });

    it("Deve retornar um funcionario por nome", function () {
        $gestor = new GestorFuncionario($this->funcionarioRepo);
        $funcionario = $gestor->obterFuncionarios("Patrícia Oliveira");

        expect($funcionario)->not->toBe(null);
        expect($funcionario)->toBeAnInstanceOf(Funcionario::class);
        expect($funcionario->nome)->toEqual("Patrícia Oliveira");
    });

    it("Deve retornar null quando o funcionario não é encontrado", function () {
        $gestor = new GestorFuncionario($this->funcionarioRepo);
        $funcionario = $gestor->obterFuncionarios("00000000000");

        expect($funcionario)->toBe(null);
    });
});

describe("Login de Funcionário", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        $this->funcionarioRepo = new RepositorioFuncionarioEmBDR($this->pdo);
        $this->gestor = new GestorFuncionario($this->funcionarioRepo);
    });

    it("Deve fazer login com sucesso com CPF e senha corretos", function () {
        $dados = $this->gestor->login("11111111111", "123456");

        expect($dados)->toBeArray();
        expect($dados['nome'])->toEqual("Patrícia Oliveira");
        expect($dados['cpf'])->toEqual("11111111111");
        expect($dados['cargo'])->toBe("Gerente");
    });

    it("Deve lançar CredenciaisInvalidasException se o CPF não existir", function () {
        expect(fn() => $this->gestor->login("00000000000", "123456"))
            ->toThrow(\CredenciaisInvalidasException::class);
    });

    it("Deve lançar CredenciaisInvalidasException se a senha estiver incorreta", function () {
        expect(fn() => $this->gestor->login("11111111111", "senhaerrada"))
            ->toThrow(\CredenciaisInvalidasException::class);
    });

    it("Deve lançar CredenciaisInvalidasException se o CPF tiver menos de 11 dígitos", function () {
        expect(fn() => $this->gestor->login("123", "123456"))
            ->toThrow(\CredenciaisInvalidasException::class);
    });

    it("Deve lançar CredenciaisInvalidasException se CPF ou senha forem nulos", function () {
        expect(fn() => $this->gestor->login(null, null))
            ->toThrow(\CredenciaisInvalidasException::class);
    });
});
