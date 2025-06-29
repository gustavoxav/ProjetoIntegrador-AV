<?php

class CalculadoraPagamento {
    /**
     * Calcula o valor a ser pago na devolução
     * 
     * @param array{
     *     dataHoraLocacao: string,
     *     horasContratadas: int,
     *     dataHoraEntregaPrevista: string,
     *     itens: array<int, array{
     *         equipamento: array{
     *             valorHora: float
     *         }
     *     }>
     * } $locacao Dados da locação
     * @param string $dataHoraDevolucao Data e hora da devolução
     * @return float Valor a ser pago
     * @throws InvalidArgumentException erro
     */
    public function calcularValorPagamento(array $locacao, string $dataHoraDevolucao): float {
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
            $horasReais = (int)$locacao['horasContratadas'];
        } else {
            $diferencaEmMinutos = floor(($dataHoraDevolucaoCalculo->getTimestamp() - $dataHoraLocacaoCalculo->getTimestamp()) / 60);
            $horasCompletas = floor($diferencaEmMinutos / 60);
            $minutosExcedentes = $diferencaEmMinutos % 60;
            
            $horasReais = $horasCompletas;
            if ($minutosExcedentes > 0) {
                $horasReais += 1;
            }
        }
        
        $valorTotal = 0;
        
        foreach ($locacao['itens'] as $item) {
            if (!isset($item['equipamento']) || !isset($item['equipamento']['valorHora'])) {
                continue;
            }
            
            $valorHora = $item['equipamento']['valorHora'];
            $valorItem = $valorHora * $horasReais;
            $valorTotal += $valorItem;
        }
        

        if ($horasReais > 2) {
            $desconto = $valorTotal * 0.1;
            $valorTotal -= $desconto;
        }
        

        return $valorTotal;
    }
} 