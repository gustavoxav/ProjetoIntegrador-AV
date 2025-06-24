<?php

class Equipamento implements JsonSerializable {
  public function __construct(
    private int $codigo = 0,
    private string $modelo = '',
    private string $fabricante = '',
    private string $descricao = '',
    private float $valorHora = 0,
    private string $avarias = '',
    private bool $disponivel = true,
    private ?string $numeroSeguro = null
  ) {}

  public function jsonSerialize(): array {
    return [
      'codigo' => $this->codigo,
      'modelo' => $this->modelo,
      'fabricante' => $this->fabricante,
      'descricao' => $this->descricao,
      'valorHora' => $this->valorHora,
      'avarias' => $this->avarias,
      'disponivel' => $this->disponivel,
      'numeroSeguro' => $this->numeroSeguro,
    ];
  }

  public function verificarDisponibilidade(): bool
  {
    return $this->disponivel;
  }

  public function calcularValorHora(int $horas): float
  {
    return $this->valorHora * $horas;
  }
}
?>
