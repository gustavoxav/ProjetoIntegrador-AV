<?php

class ItemLocado {
    private int $codigo;
    private int $tempoContratado;
    private float $subtotal;
    /** @var array<string,float|int> */
    private array $equipamento;

    /**
     * @param array<string,float|int> $equipamento
     */
    public function __construct(int $codigo, int $tempoContratado, array $equipamento) {
        $this->codigo = $codigo;
        $this->tempoContratado = $tempoContratado;
        $this->equipamento = $equipamento;
        $this->subtotal = $this->calcularSubtotal();
    }

    public function calcularSubtotal(): float {
        if (isset($this->equipamento['calcularValorHora'])) {
            return $this->equipamento['calcularValorHora'];
        }
        
        $valorHora = isset($this->equipamento['valorHora']) ? $this->equipamento['valorHora'] : 0;
        return $valorHora * $this->tempoContratado;
    }

    public function getCodigo(): int {
        return $this->codigo;
    }

    public function getTempoContratado(): int {
        return $this->tempoContratado;
    }

    public function getSubtotal(): float {
        return $this->subtotal;
    }

    /**
     * @return array<string,float|int>
     */
    public function getEquipamento(): array {
        return $this->equipamento;
    }

    /**
     * @return array<string,int|float|array<string,float|int>>
     */
    public function toArray(): array {
        return [
            'codigo' => $this->codigo,
            'tempoContratado' => $this->tempoContratado,
            'subtotal' => $this->subtotal,
            'equipamento' => $this->equipamento
        ];
    }
} 