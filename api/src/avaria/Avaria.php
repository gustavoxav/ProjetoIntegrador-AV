<?php

class Avaria {
    private string $id;
    private string $dataHoraLancamento;
    private string $descricao;
    private string $fotoCaminho;
    private float $valorCobrar;
    /** @var array{codigo: int, nome?: string} */
    private array $avaliador;
    /** @var array{codigo: int, descricao?: string, valorCompra?: float} */
    private array $equipamento;
    private int $locacaoId;

    /**
     * @param string $id UUID da avaria
     * @param string $dataHoraLancamento Data e hora do lançamento
     * @param string $descricao Descrição da avaria
     * @param string $fotoCaminho Caminho da foto da avaria
     * @param float $valorCobrar Valor a cobrar pela avaria
     * @param array{codigo: int, nome?: string} $avaliador Funcionário avaliador
     * @param array{codigo: int, descricao?: string, valorCompra?: float} $equipamento Equipamento com avaria
     * @param int $locacaoId ID da locação
     */
    public function __construct(
        string $id,
        string $dataHoraLancamento,
        string $descricao,
        string $fotoCaminho,
        float $valorCobrar,
        array $avaliador,
        array $equipamento,
        int $locacaoId
    ) {
        $this->id = $id;
        $this->dataHoraLancamento = $dataHoraLancamento;
        $this->descricao = $descricao;
        $this->fotoCaminho = $fotoCaminho;
        $this->valorCobrar = $valorCobrar;
        $this->avaliador = $avaliador;
        $this->equipamento = $equipamento;
        $this->locacaoId = $locacaoId;
    }

    public function getId(): string {
        return $this->id;
    }

    public function getDataHoraLancamento(): string {
        return $this->dataHoraLancamento;
    }

    public function getDescricao(): string {
        return $this->descricao;
    }

    public function getFotoCaminho(): string {
        return $this->fotoCaminho;
    }

    public function getValorCobrar(): float {
        return $this->valorCobrar;
    }

    /**
     * @return array{codigo: int, nome?: string}
     */
    public function getAvaliador(): array {
        return $this->avaliador;
    }

    /**
     * @return array{codigo: int, descricao?: string, valorCompra?: float}
     */
    public function getEquipamento(): array {
        return $this->equipamento;
    }

    public function getLocacaoId(): int {
        return $this->locacaoId;
    }

    /**
     * @return array{
     *   id: string,
     *   dataHoraLancamento: string,
     *   descricao: string,
     *   fotoCaminho: string,
     *   valorCobrar: float,
     *   avaliador: array{codigo: int, nome?: string},
     *   equipamento: array{codigo: int, descricao?: string, valorCompra?: float},
     *   locacaoId: int
     * }
     */
    public function toArray(): array {
        return [
            'id' => $this->id,
            'dataHoraLancamento' => $this->dataHoraLancamento,
            'descricao' => $this->descricao,
            'fotoCaminho' => $this->fotoCaminho,
            'valorCobrar' => $this->valorCobrar,
            'avaliador' => $this->avaliador,
            'equipamento' => $this->equipamento,
            'locacaoId' => $this->locacaoId
        ];
    }
} 