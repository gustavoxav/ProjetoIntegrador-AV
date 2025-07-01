<?php

class Funcionario implements JsonSerializable {
  public function __construct(
    private int $codigo = 0,
    private string $nome = '',
    private string $cpf = '',
    private string $cargo = '',
    private string $salt = '',
    private string $senha = '',
    private string $senha_hash = '',
  ) {}

  /**
   * @return array{
   *   codigo: int,
   *   nome: string,
   *   cpf: string,
   *   cargo: string
   * }
   */
  public function jsonSerialize(): array {
    return [
      'codigo' => $this->codigo,
      'nome' => $this->nome,
      'cpf' => $this->cpf,
      'cargo' => $this->cargo,
      // 'salt' => $this->salt,
      // 'senha' => $this->senha,
      // 'senha_hash' => $this->senha_hash, // é perigoso expor isso????? sim né?
    ];
  }

  public function getCodigo(): int {
    return $this->codigo;
  }

  public function getNome(): string {
    return $this->nome;
  }

  public function getCpf(): string {
    return $this->cpf;
  }

  public function getCargo(): string {
    return $this->cargo;
  }

  public function getSalt(): string {
    return $this->salt;
  }

  public function getSenha(): string {
    return $this->senha;
  }

  public function getSenhaHash(): string {
    return $this->senha_hash;
  }
}

?>