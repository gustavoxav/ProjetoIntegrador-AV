<?php

class RepositorioClienteEmBDR implements RepositorioCliente
{
  public function __construct(
    private PDO $pdo
  ) {}

  public function buscarCliente(int|string $parametro): ?Cliente
  {
    try {
      if (is_int($parametro)) {
        $sql = "SELECT * FROM cliente WHERE id = :param LIMIT 1";
      } else {
        $sql = "SELECT * FROM cliente WHERE cpf = :param LIMIT 1";
      }

      $ps = $this->pdo->prepare($sql);
      $ps->setFetchMode(PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Cliente::class);
      $ps->execute(['param' => $parametro]);

      $objeto = $ps->fetch();
      return $objeto === false ? null : $objeto;
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar cliente por código ou CPF. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }
}
