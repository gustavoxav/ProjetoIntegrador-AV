<?php

class CalculadoraPagamento {
    private ?RepositorioAvaria $repositorioAvaria;

    public function __construct(?RepositorioAvaria $repositorioAvaria = null) {
        $this->repositorioAvaria = $repositorioAvaria;
    }

    /**
     * Calcula o valor a ser pago na devolução incluindo taxas de limpeza e avarias
     * 
     * @param array{
     *     dataHoraLocacao: string,
     *     horasContratadas: int,
     *     dataHoraEntregaPrevista: string,
     *     codigo?: int,
     *     itens: array<int, array{
     *         equipamento: array{
     *             codigo: int,
     *             valorHora: float
     *         }
     *     }>
     * } $locacao Dados da locação
     * @param string $dataHoraDevolucao Data e hora da devolução
     * @param array<int, bool>|null $taxasLimpeza Array associativo [equipamentoId => temTaxa]
     * @return array{
     *     valorBase: float,
     *     valorTaxaLimpeza: float,
     *     valorAvarias: float,
     *     valorTotal: float,
     *     horasReais: int,
     *     detalhesItens: array<int, array{
     *         equipamentoId: int,
     *         subtotal: float,
     *         taxaLimpeza: float,
     *         valorComTaxa: float
     *     }>
     * } Dados detalhados do cálculo
     * @throws InvalidArgumentException erro
     */
    public function calcularValorPagamento(array $locacao, string $dataHoraDevolucao, ?array $taxasLimpeza = null): array {
        if (!isset($locacao['dataHoraLocacao']) || empty($locacao['dataHoraLocacao'])) {
            throw new InvalidArgumentException("Data e hora da locação não informados");
        }
        
        if (!isset($locacao['horasContratadas']) || !is_numeric($locacao['horasContratadas'])) {
            throw new InvalidArgumentException("Horas contratadas inválidas ou não informadas");
        }
        
        if (!isset($locacao['dataHoraEntregaPrevista']) || empty($locacao['dataHoraEntregaPrevista'])) {
            throw new InvalidArgumentException("Data e hora prevista de entrega não informados");
        }
        
        if (!isset($locacao['itens']) || !is_array($locacao['itens']) || count($locacao['itens']) === 0) {
            throw new InvalidArgumentException("Itens da locação não informados ou inválidos");
        }

        $horasReais = $this->calcularHorasReais($locacao, $dataHoraDevolucao);
        
        $subtotalGeral = 0;
        $valorTaxaLimpezaGeral = 0;
        $detalhesItens = [];
        
        foreach ($locacao['itens'] as $item) {
            if (!isset($item['equipamento']) || !isset($item['equipamento']['valorHora']) || !isset($item['equipamento']['codigo'])) {
                continue;
            }
            
            $equipamentoId = $item['equipamento']['codigo'];
            $valorHora = $item['equipamento']['valorHora'];
            $subtotalItem = $valorHora * $horasReais;
            
            $temTaxaLimpeza = $taxasLimpeza && isset($taxasLimpeza[$equipamentoId]) && $taxasLimpeza[$equipamentoId];
            $taxaLimpezaItem = $temTaxaLimpeza ? $subtotalItem * 0.1 : 0;
            $valorComTaxaItem = $subtotalItem + $taxaLimpezaItem;
            
            $subtotalGeral += $subtotalItem;
            $valorTaxaLimpezaGeral += $taxaLimpezaItem;
            
            $detalhesItens[] = [
                'equipamentoId' => $equipamentoId,
                'subtotal' => $subtotalItem,
                'taxaLimpeza' => $taxaLimpezaItem,
                'valorComTaxa' => $valorComTaxaItem
            ];
        }
        
        $desconto = 0;
        if ($horasReais > 2) {
            $desconto = $subtotalGeral * 0.1;
        }
        
        $valorBase = $subtotalGeral + $valorTaxaLimpezaGeral - $desconto;
        
        $valorAvarias = 0;
        if ($this->repositorioAvaria && isset($locacao['codigo'])) {
            $avarias = $this->repositorioAvaria->obterPorLocacao($locacao['codigo']);
            foreach ($avarias as $avaria) {
                $valorAvarias += $avaria['valorCobrar'];
            }
        }
        
        $valorTotal = $valorBase + $valorAvarias;
        
        return [
            'valorBase' => $valorBase,
            'valorTaxaLimpeza' => $valorTaxaLimpezaGeral,
            'valorAvarias' => $valorAvarias,
            'valorTotal' => $valorTotal,
            'horasReais' => $horasReais,
            'detalhesItens' => $detalhesItens
        ];
    }

    /**
     * Retornar apenas o valor total (usa em registrarDevolucao)
     * 
     * @param array $locacao Dados da locação
     * @param string $dataHoraDevolucao Data e hora da devolução
     * @param array<int, bool>|null $taxasLimpeza Array associativo [equipamentoId => temTaxa]
     * @return float Valor total a ser pago
     */
    public function calcularValorPagamentoSimples(array $locacao, string $dataHoraDevolucao, ?array $taxasLimpeza = null): float {
        $resultado = $this->calcularValorPagamento($locacao, $dataHoraDevolucao, $taxasLimpeza);
        return $resultado['valorTotal'];
    }

    /**
     * Calcula as horas reais baseado na lógica existente
     */
    private function calcularHorasReais(array $locacao, string $dataHoraDevolucao): int {
        $dataHoraLocacao = new DateTime($locacao['dataHoraLocacao']);
        $dataHoraEntregaPrevista = new DateTime($locacao['dataHoraEntregaPrevista']);
        $dataHoraDevolucaoObj = new DateTime($dataHoraDevolucao);
        
        $dataHoraLocacaoCalculo = clone $dataHoraLocacao;
        $dataHoraLocacaoCalculo->setTime(
            (int)$dataHoraLocacao->format('H'),
            (int)$dataHoraLocacao->format('i'),
            0 // tirar os segs do calculo
        );
        
        $dataHoraEntregaPrevistaCalculo = clone $dataHoraEntregaPrevista;
        $dataHoraEntregaPrevistaCalculo->setTime(
            (int)$dataHoraEntregaPrevista->format('H'),
            (int)$dataHoraEntregaPrevista->format('i'),
            0
        );
        
        $dataHoraDevolucaoCalculo = clone $dataHoraDevolucaoObj;
        $dataHoraDevolucaoCalculo->setTime(
            (int)$dataHoraDevolucaoObj->format('H'),
            (int)$dataHoraDevolucaoObj->format('i'),
            0
        );
        
        $dataHoraEntregaComTolerancia = clone $dataHoraEntregaPrevistaCalculo;
        $dataHoraEntregaComTolerancia->add(new DateInterval('PT15M'));
        
        if ($dataHoraDevolucaoCalculo <= $dataHoraEntregaComTolerancia) {
            return (int)$locacao['horasContratadas'];
        } else {
            $diferencaEmMinutos = floor(($dataHoraDevolucaoCalculo->getTimestamp() - $dataHoraLocacaoCalculo->getTimestamp()) / 60);
            $horasCompletas = floor($diferencaEmMinutos / 60);
            $minutosExcedentes = $diferencaEmMinutos % 60;
            
            $horasReais = $horasCompletas;
            if ($minutosExcedentes > 0) {
                $horasReais += 1;
            }
            return $horasReais;
        }
    }
} 