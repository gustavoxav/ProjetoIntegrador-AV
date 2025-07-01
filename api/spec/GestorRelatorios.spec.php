<?php

use Kahlan\Plugin\Double;

describe("GestorRelatorio", function () {

    beforeEach(function () {
        $this->repositorioRelatorio = Double::instance(['class' => \RepositorioRelatorio::class]);
        $this->gestorRelatorio = new \GestorRelatorio($this->repositorioRelatorio);
    });

    describe("Gerar Relatorio Locacoes Devolvidas Por Periodo", function () {

        it("Deve retornar dados formatados corretamente quando há locações devolvidas", function () {
            allow($this->repositorioRelatorio)->toReceive('buscarLocacoesDevolvidasPorPeriodo')->andReturn([
                [
                    'data_locacao' => '2025-07-01',
                    'valor_total_pago' => 150.00,
                    'quantidade_locacoes' => 3
                ],
                [
                    'data_locacao' => '2025-07-02',
                    'valor_total_pago' => 200.00,
                    'quantidade_locacoes' => 4
                ]
            ]);

            $resultado = $this->gestorRelatorio->gerarRelatorioLocacoesDevolvidasPorPeriodo('2025-07-01', '2025-07-31');

            expect($resultado)->toBeAn('array');
            expect($resultado['resumo']['valorTotalGeral'])->toBe(350.00);
            expect($resultado['resumo']['quantidadeLocacoesGeral'])->toBe(7);
            expect($resultado['resumo']['quantidadeDias'])->toBe(2);
            expect($resultado['dados'][0]['dataFormatada'])->toBe('01/07/2025');
        });

        it("Deve lançar exceção se data estiver em formato inválido", function () {
            expect(fn() => $this->gestorRelatorio->gerarRelatorioLocacoesDevolvidasPorPeriodo('01-07-2025', '31-07-2025'))
                ->toThrow(new \DominioException("Erro ao gerar relatório de locações devolvidas: Data inicial deve estar no formato Y-m-d"));
        });
    });

    describe("Gerar Relatorio Top10 Itens Mais Alugados", function () {

        it("deve retornar ranking e gráfico corretamente com dados", function () {
            allow($this->repositorioRelatorio)->toReceive('buscarTop10ItensMaisAlugados')->andReturn([
                [
                    'equipamento_id' => 1,
                    'modelo' => 'Modelo X',
                    'fabricante' => 'FabriCo',
                    'descricao' => 'Descrição',
                    'tipo' => 'Tipo A',
                    'quantidade_locacoes' => 5
                ]
            ]);

            allow($this->repositorioRelatorio)->toReceive('buscarTotalLocacoesPeriodo')->andReturn(10);
            allow($this->repositorioRelatorio)->toReceive('buscarQuantidadeOutrosItens')->andReturn(5);

            $resultado = $this->gestorRelatorio->gerarRelatorioTop10ItensMaisAlugados('2025-07-01', '2025-07-31');

            expect($resultado)->toBeAn('array');
            expect($resultado['resumo']['totalLocacoesPeriodo'])->toBe(10);
            expect($resultado['grafico'][0]['label'])->toContain('Modelo X');
            expect($resultado['grafico'][1]['label'])->toBe('Outros');
        });

        it("Deve retornar ranking vazio se não existir registro", function () {
            allow($this->repositorioRelatorio)->toReceive('buscarTop10ItensMaisAlugados')->andReturn([]);
            allow($this->repositorioRelatorio)->toReceive('buscarTotalLocacoesPeriodo')->andReturn(0);

            $resultado = $this->gestorRelatorio->gerarRelatorioTop10ItensMaisAlugados('2025-07-01', '2025-07-31');

            expect($resultado['ranking'])->toBe([]);
            expect($resultado['grafico'])->toBe([]);
            expect($resultado['resumo']['totalLocacoesPeriodo'])->toBe(0);
        });

        it("Deve lançar exceção se data final for menor que a data inicial", function () {
            expect(fn() => $this->gestorRelatorio->gerarRelatorioTop10ItensMaisAlugados('2025-08-01', '2025-07-01'))
                ->toThrow(new \DominioException("Erro ao gerar relatório de itens mais alugados: Data inicial deve ser menor ou igual à data final"));
        });
    });
});
