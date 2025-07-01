<?php

require_once __DIR__ . '/../src/infra/helperTests.php';

describe("GestorCliente", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        realizarLoginTests('Gerente');
        $this->clienteRepo = new RepositorioClienteEmBDR($this->pdo);
    });

    afterAll(function () {
        realizarLogout();
    });


    it("Deve retornar todos os clientes quando nenhum filtro é passado", function () {
        $gestor = new GestorCliente($this->clienteRepo);
        $clientes = $gestor->obterClientes(null);

        expect($clientes)->not->toBe(null);
        expect($clientes)->toBeAn('array');
        expect(count($clientes))->toBeGreaterThan(0);
        expect($clientes[0])->toBeAnInstanceOf(Cliente::class);
    });

    it("Deve retornar um cliente por código", function () {
        $gestor = new GestorCliente($this->clienteRepo);
        $cliente = $gestor->obterClientes(1);

        expect($cliente)->not->toBe(null);
        expect($cliente)->toBeAnInstanceOf(Cliente::class);
        expect($cliente->getCodigo())->toEqual(1);
    });

    it("Deve retornar um cliente por CPF", function () {
        $gestor = new GestorCliente($this->clienteRepo);
        $cliente = $gestor->obterClientes("12345678900");

        expect($cliente)->not->toBe(null);
        expect($cliente)->toBeAnInstanceOf(Cliente::class);
        expect($cliente->getCpf())->toEqual("12345678900");
    });

    it("Deve retornar null quando o cliente não é encontrado", function () {
        $gestor = new GestorCliente($this->clienteRepo);
        $cliente = $gestor->obterClientes("00000000000");

        expect($cliente)->toBe(null);
    });
});
