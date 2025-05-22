<?php

class CalculadoraPagamento {
    /**
     * Calcula o valor a ser pago na devolução
     * 
     * @param array $locacao Dados da locação
     * @param string $dataHoraDevolucao Data e hora da devolução
     * @return float Valor a ser pago
     */
    public function calcularValorPagamento($locacao, $dataHoraDevolucao) {
        if (!isset($locacao['dataHoraLocacao']) || empty($locacao['dataHoraLocacao'])) {
            throw new Exception("Data e hora da locação não informados");
        }
        
        if (!isset($locacao['horasContratadas']) || !is_numeric($locacao['horasContratadas'])) {
            throw new Exception("Horas contratadas inválidas ou não informadas");
        }
        
        if (!isset($locacao['dataHoraEntregaPrevista']) || empty($locacao['dataHoraEntregaPrevista'])) {
            throw new Exception("Data e hora prevista de entrega não informados");
        }
        
        if (!isset($locacao['itens']) || !is_array($locacao['itens']) || count($locacao['itens']) === 0) {
            throw new Exception("Itens da locação não informados ou inválidos");
        }
        

        $dataHoraLocacao = new DateTime($locacao['dataHoraLocacao']);
        $dataHoraEntregaPrevista = new DateTime($locacao['dataHoraEntregaPrevista']);
        $dataHoraDevolucaoObj = new DateTime($dataHoraDevolucao);
        
        $dataHoraEntregaComTolerancia = clone $dataHoraEntregaPrevista;
        $dataHoraEntregaComTolerancia->add(new DateInterval('PT15M'));
        
        if ($dataHoraDevolucaoObj <= $dataHoraEntregaComTolerancia) {
            $horasReais = (int)$locacao['horasContratadas'];
        } else {
            $timestampLocacao = $dataHoraLocacao->getTimestamp();
            $timestampDevolucao = $dataHoraDevolucaoObj->getTimestamp();
            
            $segundosTotais = $timestampDevolucao - $timestampLocacao;
            
            $horasReais = ceil($segundosTotais / 3600);
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