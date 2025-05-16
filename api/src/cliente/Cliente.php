<?php

class Cliente
{
  public function __construct(
    public int $codigo = 0,
    public string $nomeCompleto = '',
    public string $dataNascimento = '',
    public string $cpf = '',
    public string $telefone = '',
    public string $email = '',
    public string $endereco = '',
    public string $foto = '',
  ) {
  }
}

?>