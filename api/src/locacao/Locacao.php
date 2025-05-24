<?php

class Locacao {
    private ?int $codigo;
    private string $dataHoraLocacao;
    private int $horasContratadas;
    private string $dataHoraEntregaPrevista;
    private float $desconto;
    private float $valorTotal;
    /** @var array{codigo: int, nomeCompleto?: string, telefone?: string} */
    private array $cliente;
    /** @var array{codigo: int, nome?: string} */
    private array $registradoPor;
    /** @var array<int,ItemLocado> */
    private array $itens = [];

    /**
     * @param ?int $codigo
     * @param string $dataHoraLocacao
     * @param int $horasContratadas
     * @param array{codigo: int, nomeCompleto?: string, telefone?: string} $cliente
     * @param array{codigo: int, nome?: string} $registradoPor
     * @param array<int,ItemLocado> $itens
     */
    public function __construct(
        ?int $codigo,
        string $dataHoraLocacao,
        int $horasContratadas,
        array $cliente,
        array $registradoPor,
        array $itens = []
    ) {
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

    public function calcularTotal(): float {
        $total = 0;
        foreach ($this->itens as $item) {
            $total += $item->getSubtotal();
        }
        return $total - $this->desconto;
    }

    public function calcularDesconto(): float {
        if ($this->horasContratadas > 2) {
            return $this->calcularSubtotalBruto() * 0.1;
        }
        return 0;
    }
    
    private function calcularSubtotalBruto(): float {
        $total = 0;
        foreach ($this->itens as $item) {
            $total += $item->getSubtotal();
        }
        return $total;
    }

    public function calcularHoraEntrega(): string {
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

    public function getCodigo(): ?int {
        return $this->codigo;
    }

    public function getDataHoraLocacao(): string {
        return $this->dataHoraLocacao;
    }

    public function getHorasContratadas(): int {
        return $this->horasContratadas;
    }

    public function getDataHoraEntregaPrevista(): string {
        return $this->dataHoraEntregaPrevista;
    }

    public function getDesconto(): float {
        return $this->desconto;
    }

    public function getValorTotal(): float {
        return $this->valorTotal;
    }

    /**
     * @return array{codigo: int, nomeCompleto?: string, telefone?: string}
     */
    public function getCliente(): array {
        return $this->cliente;
    }

    /**
     * @return array{codigo: int, nome?: string}
     */
    public function getRegistradoPor(): array {
        return $this->registradoPor;
    }

    /**
     * @return array<int,ItemLocado>
     */
    public function getItens(): array {
        return $this->itens;
    }

    /**
     * @return array{
     *   codigo: ?int,
     *   dataHoraLocacao: string,
     *   horasContratadas: int,
     *   dataHoraEntregaPrevista: string,
     *   desconto: float,
     *   valorTotal: float,
     *   cliente: array{codigo: int, nomeCompleto?: string, telefone?: string},
     *   registradoPor: array{codigo: int, nome?: string},
     *   itens: array<int,array<string,mixed>>
     * }
     */
    public function toArray(): array {
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
