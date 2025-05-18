<?php

class ItemLocado {
    private $codigo;
    private $tempoContratado;
    private $subtotal;
    private $equipamento;

    public function __construct($codigo, $tempoContratado, $equipamento) {
        $this->codigo = $codigo;
        $this->tempoContratado = $tempoContratado;
        $this->equipamento = $equipamento;
        $this->subtotal = $this->calcularSubtotal();
    }

    public function calcularSubtotal() {
        if (isset($this->equipamento['calcularValorHora'])) {
            return $this->equipamento['calcularValorHora'];
        }
        
        $valorHora = isset($this->equipamento['valorHora']) ? $this->equipamento['valorHora'] : 0;
        return $valorHora * $this->tempoContratado;
    }

    public function getCodigo() {
        return $this->codigo;
    }

    public function getTempoContratado() {
        return $this->tempoContratado;
    }

    public function getSubtotal() {
        return $this->subtotal;
    }

    public function getEquipamento() {
        return $this->equipamento;
    }

    public function toArray() {
        return [
            'codigo' => $this->codigo,
            'tempoContratado' => $this->tempoContratado,
            'subtotal' => $this->subtotal,
            'equipamento' => $this->equipamento
        ];
    }
} 