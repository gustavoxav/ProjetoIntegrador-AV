<?php

class Devolucao {
    private $codigo;
    private $dataHoraDevolucao;
    private $valorPago;
    private $locacao;
    private $registradoPor;

    public function __construct($codigo, $dataHoraDevolucao, $valorPago, $locacao, $registradoPor) {
        $this->codigo = $codigo;
        $this->dataHoraDevolucao = $dataHoraDevolucao;
        $this->valorPago = $valorPago;
        $this->locacao = $locacao;
        $this->registradoPor = $registradoPor;
    }

    public function getCodigo() {
        return $this->codigo;
    }

    public function getDataHoraDevolucao() {
        return $this->dataHoraDevolucao;
    }

    public function getValorPago() {
        return $this->valorPago;
    }

    public function getLocacao() {
        return $this->locacao;
    }

    public function getRegistradoPor() {
        return $this->registradoPor;
    }

    public function toArray() {
        return [
            'codigo' => $this->codigo,
            'dataHoraDevolucao' => $this->dataHoraDevolucao,
            'valorPago' => $this->valorPago,
            'locacao' => $this->locacao,
            'registradoPor' => $this->registradoPor
        ];
    }
} 