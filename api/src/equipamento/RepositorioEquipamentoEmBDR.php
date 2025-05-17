<?php

class RepositorioEquipamentoEmBDR implements RepositorioEquipamento
{
  public function __construct(
    private PDO $pdo
  ) {}

  public function buscarEquipamentoFiltro(int $query): Equipamento|null
  {
    try {
      $query = $query !== null ? ltrim((string) $query, '/') : null;

      $sql = "SELECT * FROM Equipamentos WHERE id = :param LIMIT 1";

      $ps = $this->pdo->prepare($sql);
      $ps->execute([':param' => $query]);
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $dados = $ps->fetch();

      if (!$dados) return null;

      return new Equipamento(
        codigo: (int) $dados['id'],
        modelo: (string) $dados['modelo'],
        fabricante: (string) $dados['fabricante'],
        descricao: (string) $dados['descricao'],
        valorHora: (float) $dados['valor_hora'],
        avarias: (string) $dados['avarias'],
        disponivel: (bool) $dados['disponivel'],
        numeroSeguro: (int) $dados['numero_seguro']

      );
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar Equipamento por código. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }
}
