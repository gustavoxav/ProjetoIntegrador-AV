<?php

describe("GestorLocacao", function () {
    beforeAll(function () {
        $this->pdo = conectarPDO();
        $this->pdo->exec(file_get_contents('db/test_script.sql'));
        $this->locacaoRepo = new RepositorioLocacaoEmBDR($this->pdo);
        
        $this->clienteId = 1;
        $this->funcionarioId = 1;
        $this->equipamentoId = 1;
        
        $this->pdo->exec("
            INSERT INTO locacao 
            (data_hora_locacao, horas_contratadas, data_hora_entrega_prevista, 
            desconto, valor_total, cliente_id, funcionario_id)
            VALUES 
            (NOW(), 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 0, 30.00, {$this->clienteId}, {$this->funcionarioId})
        ");
        
        $locacaoId = $this->pdo->lastInsertId();
        
        $this->pdo->exec("
            INSERT INTO item_locado
            (tempo_contratado, subtotal, equipamento_id, locacao_id)
            VALUES
            (2, 30.00, {$this->equipamentoId}, {$locacaoId})
        ");
    });

    it("Deve retornar todas as locações quando nenhum filtro é passado", function () {
        $gestor = new GestorLocacao($this->locacaoRepo);
        $locacoes = $gestor->obterLocacoes(null);

        expect($locacoes)->not->toBe(null);
        expect($locacoes)->toBeAn('array');
        expect(count($locacoes))->toBeGreaterThan(0);
        
        expect($locacoes[0])->toBeAn('array');
        expect($locacoes[0])->toContainKey('codigo');
        expect($locacoes[0])->toContainKey('dataHoraLocacao');
        expect($locacoes[0])->toContainKey('cliente');
    });

    it("Deve retornar uma locação por código", function () {
        $gestor = new GestorLocacao($this->locacaoRepo);
        $locacoes = $gestor->obterLocacaoPorFiltro(1);

        expect($locacoes)->not->toBe(null);
        expect($locacoes)->toBeAn('array');
        expect(count($locacoes))->toBe(1);
        expect($locacoes[0])->toBeAn('array');
        expect($locacoes[0]['codigo'])->toEqual(1);
    });

    it("Deve retornar null quando a locação não é encontrada", function () {
        $gestor = new GestorLocacao($this->locacaoRepo);
        $locacao = $gestor->obterLocacaoPorFiltro(999);

        expect($locacao)->toBeNull();
    });
});
