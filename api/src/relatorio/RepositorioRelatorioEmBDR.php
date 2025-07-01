<?php

class RepositorioRelatorioEmBDR implements RepositorioRelatorio {
	public function __construct(
		private PDO $pdo
	) {}

	/**
	 * @return array<array<string, mixed>>
	 */
	public function buscarLocacoesDevolvidasPorPeriodo(string $dataInicial, string $dataFinal): array {
		try {
			$sql = "
				SELECT 
					DATE(l.data_hora_locacao) as data_locacao,
					SUM(d.valor_pago) as valor_total_pago,
					COUNT(DISTINCT l.id) as quantidade_locacoes
				FROM locacao l
				INNER JOIN devolucao d ON l.id = d.locacao_id
				WHERE DATE(l.data_hora_locacao) BETWEEN :data_inicial AND :data_final
				GROUP BY DATE(l.data_hora_locacao)
				ORDER BY DATE(l.data_hora_locacao) ASC
			";

			$ps = $this->pdo->prepare($sql);
			$ps->execute([
				':data_inicial' => $dataInicial,
				':data_final' => $dataFinal
			]);

			return $ps->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $ex) {
			throw new RepositorioException(
				'Erro ao buscar dados de locações devolvidas por período.',
				(int) $ex->getCode(),
				$ex
			);
		}
	}

	/**
	 * @return array<array<string, mixed>>
	 */
	public function buscarTop10ItensMaisAlugados(string $dataInicial, string $dataFinal): array {
		try {
			$sql = "
				SELECT 
					e.id as equipamento_id,
					e.modelo,
					e.fabricante,
					e.descricao,
					e.tipo,
					COUNT(il.equipamento_id) as quantidade_locacoes
				FROM equipamento e
				INNER JOIN item_locado il ON e.id = il.equipamento_id
				INNER JOIN locacao l ON il.locacao_id = l.id
				WHERE DATE(l.data_hora_locacao) BETWEEN :data_inicial AND :data_final
				GROUP BY e.id, e.modelo, e.fabricante, e.descricao, e.tipo
				ORDER BY quantidade_locacoes DESC, e.descricao ASC
				LIMIT 10
			";

			$ps = $this->pdo->prepare($sql);
			$ps->execute([
				':data_inicial' => $dataInicial,
				':data_final' => $dataFinal
			]);

			return $ps->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $ex) {
			throw new RepositorioException(
				'Erro ao buscar dados de itens mais alugados.',
				(int) $ex->getCode(),
				$ex
			);
		}
	}

	public function buscarTotalLocacoesPeriodo(string $dataInicial, string $dataFinal): int {
		try {
			$sql = "
				SELECT COUNT(il.id) as total_locacoes
				FROM item_locado il
				INNER JOIN locacao l ON il.locacao_id = l.id
				WHERE DATE(l.data_hora_locacao) BETWEEN :data_inicial AND :data_final
			";

			$ps = $this->pdo->prepare($sql);
			$ps->execute([
				':data_inicial' => $dataInicial,
				':data_final' => $dataFinal
			]);

			$resultado = $ps->fetch(PDO::FETCH_ASSOC);
			return (int) ($resultado['total_locacoes'] ?? 0);
		} catch (PDOException $ex) {
			throw new RepositorioException(
				'Erro ao buscar total de locações do período.',
				(int) $ex->getCode(),
				$ex
			);
		}
	}

	/**
	 * Busca a soma das locações dos itens fora do TOP 10
	 * @param array<int> $top10Ids
	 */
	public function buscarQuantidadeOutrosItens(string $dataInicial, string $dataFinal, array $top10Ids): int {
		try {
			if (empty($top10Ids)) {
				return 0;
			}

			$placeholders = str_repeat('?,', count($top10Ids) - 1) . '?';
			$sql = "
				SELECT COUNT(il.id) as quantidade_outros
				FROM item_locado il
				INNER JOIN locacao l ON il.locacao_id = l.id
				WHERE DATE(l.data_hora_locacao) BETWEEN ? AND ?
				AND il.equipamento_id NOT IN ($placeholders)
			";

			$params = [$dataInicial, $dataFinal, ...$top10Ids];
			$ps = $this->pdo->prepare($sql);
			$ps->execute($params);

			$resultado = $ps->fetch(PDO::FETCH_ASSOC);
			return (int) ($resultado['quantidade_outros'] ?? 0);
		} catch (PDOException $ex) {
			throw new RepositorioException(
				'Erro ao buscar quantidade de outros itens.',
				(int) $ex->getCode(),
				$ex
			);
		}
	}
} 