<?php

class Equipamento
{
  public function __construct(
    public int $codigo = 0,
    public string $modelo = '',
    public string $fabricante = '',
    public string $descricao = '',
    public float $valorHora = 0,
    public string $avarias = '',
    public bool $disponivel = true,
    public ?string $numeroSeguro = null
  ) {
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
