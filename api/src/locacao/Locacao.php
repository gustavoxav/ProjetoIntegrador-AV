<?php

class Locacao {
    private $codigo;
    private $dataHoraLocacao;
    private $horasContratadas;
    private $dataHoraEntregaPrevista;
    private $desconto;
    private $valorTotal;
    private $cliente;
    private $registradoPor;
    private $itens = [];

    public function __construct($codigo, $dataHoraLocacao, $horasContratadas, $cliente, $registradoPor, $itens = []) {
        $this->codigo = $codigo;
        $this->dataHoraLocacao = $dataHoraLocacao;
        $this->horasContratadas = $horasContratadas;
        $this->cliente = $cliente;
        $this->registradoPor = $registradoPor;
        $this->itens = $itens;
        
        $this->dataHoraEntregaPrevista = $this->calcularHoraEntrega();
        $this->desconto = $this->calcularDesconto();
        $this->valorTotal = $this->calcularTotal();
    }

    public function calcularTotal() {
        $total = 0;
        foreach ($this->itens as $item) {
            $total += $item->getSubtotal();
        }
        return $total - $this->desconto;
    }

    public function calcularDesconto() {
        if ($this->horasContratadas > 2) {
            return $this->calcularSubtotalBruto() * 0.1;
        }
        return 0;
    }
    
    private function calcularSubtotalBruto() {
        $total = 0;
        foreach ($this->itens as $item) {
            $total += $item->getSubtotal();
        }
        return $total;
    }

    public function calcularHoraEntrega() {
        date_default_timezone_set('America/Sao_Paulo');
        
        $dataHora = new DateTime($this->dataHoraLocacao);
        
        $dataHoraCalculo = clone $dataHora;
        $dataHoraCalculo->setTime(
            (int)$dataHora->format('H'),
            (int)$dataHora->format('i'),
            0
        );
        
        $dataHoraCalculo->add(new DateInterval('PT' . $this->horasContratadas . 'H'));
        
        $segundos = (int)$dataHora->format('s');
        $resultado = clone $dataHoraCalculo;
        $resultado->setTime(
            (int)$dataHoraCalculo->format('H'),
            (int)$dataHoraCalculo->format('i'),
            $segundos
        );
        
        return $resultado->format('Y-m-d H:i:s');
    }

    public function getCodigo() {
        return $this->codigo;
    }

    public function getDataHoraLocacao() {
        return $this->dataHoraLocacao;
    }

    public function getHorasContratadas() {
        return $this->horasContratadas;
    }

    public function getDataHoraEntregaPrevista() {
        return $this->dataHoraEntregaPrevista;
    }

    public function getDesconto() {
        return $this->desconto;
    }

    public function getValorTotal() {
        return $this->valorTotal;
    }

    public function getCliente() {
        return $this->cliente;
    }

    public function getRegistradoPor() {
        return $this->registradoPor;
    }

    public function getItens() {
        return $this->itens;
    }

    public function toArray() {
        $itens = [];
        foreach ($this->itens as $item) {
            $itens[] = $item->toArray();
        }
        
        return [
            'codigo' => $this->codigo,
            'dataHoraLocacao' => $this->dataHoraLocacao,
            'horasContratadas' => $this->horasContratadas,
            'dataHoraEntregaPrevista' => $this->dataHoraEntregaPrevista,
            'desconto' => $this->desconto,
            'valorTotal' => $this->valorTotal,
            'cliente' => $this->cliente,
            'registradoPor' => $this->registradoPor,
            'itens' => $itens
        ];
    }
}
