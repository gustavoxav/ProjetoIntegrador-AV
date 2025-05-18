<?php

class RepositorioClienteEmBDR implements RepositorioCliente
{
  public function __construct(
    private PDO $pdo
  ) {}

  public function buscarClientes(): array|null
  {
    try {
      // echo "buscando clientes";
      $sql = "SELECT * FROM cliente";
      $ps = $this->pdo->prepare($sql);
      $ps->execute();
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $resultados = $ps->fetchAll();

      if (!$resultados) return null;

      $clientes = [];
      foreach ($resultados as $dados) {
        $clientes[] = new Cliente(
          codigo: (int) $dados['id'],
          nomeCompleto: $dados['nome_completo'],
          dataNascimento: $dados['data_nascimento'],
          cpf: $dados['cpf'],
          telefone: $dados['telefone'],
          email: $dados['email'],
          endereco: $dados['endereco'],
          foto: $dados['foto'],
        );
      }

      return $clientes;
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar clientes. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }

  public function buscarClienteFiltro(int|string $query): Cliente|null
  {
    try {
      // echo "buscando cliente filto";
      $query = $query !== null ? ltrim((string) $query, '/') : null;

      if (strlen($query) === 11) {
        $sql = "SELECT * FROM cliente WHERE cpf = :param LIMIT 1";
      } else {
        $sql = "SELECT * FROM cliente WHERE id = :param LIMIT 1";
      }

      $ps = $this->pdo->prepare($sql);
      $ps->execute([':param' => $query]);
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $dados = $ps->fetch();

      if (!$dados) return null;

      return new Cliente(
        codigo: (int) $dados['id'],
        nomeCompleto: $dados['nome_completo'],
        dataNascimento: $dados['data_nascimento'],
        cpf: $dados['cpf'],
        telefone: $dados['telefone'],
        email: $dados['email'],
        endereco: $dados['endereco'],
        foto: $dados['foto'],
      );
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar cliente por código ou CPF. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }
}
