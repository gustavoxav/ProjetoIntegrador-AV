<?php

class RepositorioEquipamentoEmBDR implements RepositorioEquipamento
{
  public function __construct(
    private PDO $pdo
  ) {}

  public function buscarEquipamentos(): array|null {
    try {
      $sql = "SELECT * FROM equipamento";
      $ps = $this->pdo->prepare($sql);
      $ps->execute();
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $resultados = $ps->fetchAll();

      if (!$resultados) return null;

      $equipamentos = [];
      foreach ($resultados as $dados) {
        $equipamentos[] = new Equipamento(
          codigo: (int) $dados['id'],
          modelo: $dados['modelo'],
          fabricante: $dados['fabricante'],
          descricao: $dados['descricao'],
          valorHora: $dados['valor_hora'],
          avarias: $dados['avarias'],
          disponivel: $dados['disponivel'],
          numeroSeguro: !empty($dados['numero_seguro']) ? (string) $dados['numero_seguro'] : null
        );
      }

      return $equipamentos;
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar equipamentos. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }

  public function buscarEquipamentoFiltro(int $query): Equipamento|null
  {
    try {
      $query = ltrim((string) $query, '/');

      $sql = "SELECT * FROM equipamento WHERE id = :param LIMIT 1";

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
        avarias: (string) $dados['avarias'] === "" ? "Nenhuma avaria" : $dados['avarias'],
        disponivel: (bool) $dados['disponivel'],
        numeroSeguro: !empty($dados['numero_seguro']) ? (string) $dados['numero_seguro'] : null

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
