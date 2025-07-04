<?php

class RepositorioFuncionarioEmBDR implements RepositorioFuncionario
{
  public function __construct(
    private PDO $pdo
  ) {}

  public function buscarFuncionarios(): array|null
  {
    try {
      $sql = "SELECT * FROM funcionario";
      $ps = $this->pdo->prepare($sql);
      $ps->execute();
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $resultados = $ps->fetchAll();

      if (!$resultados) return null;

      $funcionarios = [];
      foreach ($resultados as $dados) {
        $funcionarios[] = new Funcionario(
          codigo: (int) $dados['id'],
          nome: $dados['nome'],
        );
      }

      return $funcionarios;
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar funcionarios. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }

  public function buscarFuncionarioFiltro(int|string $query): Funcionario|null
  {
    try {
      $query = ltrim((string) $query, '/');

      if (strlen($query) === 11) {
        $sql = "SELECT * FROM funcionario WHERE cpf = :param LIMIT 1";
      } else {
        $sql = "SELECT * FROM funcionario WHERE id = :param LIMIT 1";
      }

      $ps = $this->pdo->prepare($sql);
      $ps->execute([':param' => $query]);
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $dados = $ps->fetch();

      if (!$dados) return null;

      return new Funcionario(
        codigo: (int) $dados['id'],
        nome: $dados['nome'],
        cpf: $dados['cpf'] ?? '',
        cargo: $dados['cargo'] ?? '',
        salt: $dados['salt'] ?? '',
        senha: '',
        senha_hash: $dados['senha_hash'] ?? ''
      );
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar funcionario por código ou nome. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }
}
