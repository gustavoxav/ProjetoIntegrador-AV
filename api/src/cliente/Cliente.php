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
  ) {
  }

 public function validar(): void
  {
    if (empty($this->nomeCompleto)) {
      throw new ValidacaoClienteException("O nome do cliente é inválido.");
    }

    if (strlen($this->cpf) !== 11 || !is_numeric($this->cpf)) {
      throw new ValidacaoClienteException("O CPF é inválido. Deve conter 11 dígitos numéricos.");
    }

    if (empty($this->telefone) || !is_numeric($this->telefone) || strlen($this->telefone) < 10) {
      throw new ValidacaoClienteException("O telefone é inválido.");
    }

    if (!str_contains($this->email, "@") || !str_contains($this->email, ".")) {
      throw new ValidacaoClienteException("E-mail inválido.");
    }

    if (dateValidator($this->dataNascimento)) {
      throw new ValidacaoClienteException("A Data de nascimento é inválida.");
    }
  }
}

?>