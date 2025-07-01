<?php

use CredenciaisInvalidasException;

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
});

describe("Valida retorno de erros do Login de Funcionário", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        $this->funcionarioRepo = new RepositorioFuncionarioEmBDR($this->pdo);
        $this->gestor = new GestorFuncionario($this->funcionarioRepo);
        realizarLogout();
    });

    it("Deve lançar CredenciaisInvalidasException se o CPF não existir", function () {
        expect(fn() => $this->gestor->login("00000000000", "123456"))
            ->toThrow(new \ErroLoginException, "CPF ou senha inválidos");
    });

    it("Deve lançar CredenciaisInvalidasException se a senha estiver incorreta", function () {
        expect(fn() => $this->gestor->login("11111111111", "senhaerrada"))
            ->toThrow(new \ErroLoginException, "CPF ou senha inválidos");
    });

    it("Deve lançar CredenciaisInvalidasException se o CPF tiver menos de 11 dígitos", function () {
        expect(fn() => $this->gestor->login("123", "123456"))
            ->toThrow(new \ErroLoginException, "CPF inválido. Deve conter 11 dígitos.");
    });

    it("Deve lançar CredenciaisInvalidasException se CPF ou senha forem vazios", function () {
        expect(fn() => $this->gestor->login("", ""))
            ->toThrow(new \ErroLoginException, "CPF e senha são obrigatórios para o login.");
    });
});
