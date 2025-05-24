<?php

class Devolucao {
    private ?int $codigo;
    private string $dataHoraDevolucao;
    private float $valorPago;
    /** @var array<string,mixed> */
    private array $locacao;
    /** @var array{codigo: int, nome?: string} */
    private array $registradoPor;

    /**
     * @param ?int $codigo
     * @param string $dataHoraDevolucao
     * @param float $valorPago
     * @param array<string,mixed> $locacao
     * @param array{codigo: int, nome?: string} $registradoPor
     */
    public function __construct(
        ?int $codigo,
        string $dataHoraDevolucao,
        float $valorPago,
        array $locacao,
        array $registradoPor
    ) {
        $this->codigo = $codigo;
        $this->dataHoraDevolucao = $dataHoraDevolucao;
        $this->valorPago = $valorPago;
        $this->locacao = $locacao;
        $this->registradoPor = $registradoPor;
    }

    public function getCodigo(): ?int {
        return $this->codigo;
    }

    public function getDataHoraDevolucao(): string {
        return $this->dataHoraDevolucao;
    }

    public function getValorPago(): float {
        return $this->valorPago;
    }

    /**
     * @return array<string,mixed>
     */
    public function getLocacao(): array {
        return $this->locacao;
    }

    /**
     * @return array{codigo: int, nome?: string}
     */
    public function getRegistradoPor(): array {
        return $this->registradoPor;
    }

    /**
     * @return array{
     *   codigo: ?int,
     *   dataHoraDevolucao: string,
     *   valorPago: float,
     *   locacao: array<string,mixed>,
     *   registradoPor: array{codigo: int, nome?: string}
     * }
     */
    public function toArray(): array {
        return [
            'codigo' => $this->codigo,
            'dataHoraDevolucao' => $this->dataHoraDevolucao,
            'valorPago' => $this->valorPago,
            'locacao' => $this->locacao,
            'registradoPor' => $this->registradoPor
        ];
    }
} 