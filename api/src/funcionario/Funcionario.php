<?php

class Funcionario
{
  public function __construct(
    public int $codigo = 0,
    public string $nome = '',
    public string $cpf = '',
    public string $cargo = '',
    public string $salt = '',
    public string $senha = '',
    public string $senha_hash = '',
  ) {
  }
}

?>