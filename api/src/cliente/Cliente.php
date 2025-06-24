<?php

class Cliente implements JsonSerializable {
  public function __construct(
    private int $codigo = 0,
    private string $nomeCompleto = '',
    private string $dataNascimento = '',
    private string $cpf = '',
    private string $telefone = '',
    private string $email = '',
    private string $endereco = '',
    private string $foto = '',
  ) {}

  /**
   * qnd a gnt implementa o jsonSerialize, o json_encode vai usar o retorno desse metodo para serializar o objeto
   */
  public function jsonSerialize(): array {
    return [
      'codigo' => $this->codigo,
      'nomeCompleto' => $this->nomeCompleto,
      'dataNascimento' => $this->dataNascimento,
      'cpf' => $this->cpf,
      'telefone' => $this->telefone,
      'email' => $this->email,
      'endereco' => $this->endereco,
      'foto' => $this->foto,
    ];
  }

  public function validar(): array
  {
    $erros = [];

    if (!is_string($this->nomeCompleto) || trim($this->nomeCompleto) === '') {
      $erros[] = 'O Nome completo é inválido.';
    }
    if (!ctype_digit($this->cpf) || strlen($this->cpf) !== 11) {
      $erros[] = 'O CPF é inválido.';
    }
    if (!ctype_digit($this->telefone) || strlen($this->telefone) !== 11) {
      $erros[] = 'O Telefone é inválido.';
    }
    $data = DateTime::createFromFormat('Y-m-d', $this->dataNascimento);
    $hoje = new DateTime();

    if (!$data || $data > $hoje) {
      $erros[] = 'A data de nascimento é inválida ou futura.';
    }
    if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
      $erros[] = 'O Email é inválido.';
    }
    if (trim($this->endereco) === '') {
      $erros[] = 'Endereço não pode estar vazio.';
    }
    if (trim($this->foto) === '') {
      $erros[] = 'Foto não pode estar vazia.';
    }

    return $erros;
  }

  public function getCodigo(): int
  {
    return $this->codigo;
  }

  public function getNomeCompleto(): string
  {
    return $this->nomeCompleto;
  }

  public function getDataNascimento(): string
  {
    return $this->dataNascimento;
  }

  public function getCpf(): string
  {
    return $this->cpf;
  }

  public function getTelefone(): string
  {
    return $this->telefone;
  }

  public function getEmail(): string
  {
    return $this->email;
  }

  public function getEndereco(): string
  {
    return $this->endereco;
  }

  public function getFoto(): string
  {
    return $this->foto;
  }

  public function setCodigo(int $codigo): void
  {
    $this->codigo = $codigo;
  }

  public function setNomeCompleto(string $nomeCompleto): void
  {
    $this->nomeCompleto = $nomeCompleto;
  }

  public function setDataNascimento(string $dataNascimento): void
  {
    $this->dataNascimento = $dataNascimento;
  }

  public function setCpf(string $cpf): void
  {
    $this->cpf = $cpf;
  }

  public function setTelefone(string $telefone): void
  {
    $this->telefone = $telefone;
  }

  public function setEmail(string $email): void
  {
    $this->email = $email;
  }

  public function setEndereco(string $endereco): void
  {
    $this->endereco = $endereco;
  }

  public function setFoto(string $foto): void
  {
    $this->foto = $foto;
  }
}
