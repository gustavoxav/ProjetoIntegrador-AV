<?php

class GestorRelatorio {
	public function __construct(
		private RepositorioRelatorio $repositorioRelatorio
	) {}

	/**
	 * Gera relatório de locações devolvidas por período
	 * 
	 * @param string|null $dataInicial Data inicial (Y-m-d)
	 * @param string|null $dataFinal Data final (Y-m-d)
	 * @return array<string, mixed> Dados formatados para gráfico de colunas
	 */
	public function gerarRelatorioLocacoesDevolvidasPorPeriodo(?string $dataInicial = null, ?string $dataFinal = null): array {
		try {
			if (!$dataInicial || !$dataFinal) {
				$dataInicial = date('Y-m-01');
				$dataFinal = date('Y-m-t');
			}

			$this->validarFormatoDatas($dataInicial, $dataFinal);

			$dadosLocacoes = $this->repositorioRelatorio->buscarLocacoesDevolvidasPorPeriodo($dataInicial, $dataFinal);

			$dadosFormatados = [];
			$valorTotalGeral = 0;
			$quantidadeLocacoesGeral = 0;

			foreach ($dadosLocacoes as $registro) {
				$dadosFormatados[] = [
					'data' => $registro['data_locacao'],
					'dataFormatada' => date('d/m/Y', strtotime($registro['data_locacao'])),
					'valorTotalPago' => (float) $registro['valor_total_pago'],
					'quantidadeLocacoes' => (int) $registro['quantidade_locacoes']
				];
				$valorTotalGeral += (float) $registro['valor_total_pago'];
				$quantidadeLocacoesGeral += (int) $registro['quantidade_locacoes'];
			}

			return [
				'periodo' => [
					'dataInicial' => $dataInicial,
					'dataFinal' => $dataFinal,
					'dataInicialFormatada' => date('d/m/Y', strtotime($dataInicial)),
					'dataFinalFormatada' => date('d/m/Y', strtotime($dataFinal))
				],
				'resumo' => [
					'valorTotalGeral' => $valorTotalGeral,
					'quantidadeLocacoesGeral' => $quantidadeLocacoesGeral,
					'quantidadeDias' => count($dadosFormatados)
				],
				'dados' => $dadosFormatados
			];
		} catch (\Throwable $error) {
			throw new \DominioException("Erro ao gerar relatório de locações devolvidas: " . $error->getMessage());
		}
	}

	/**
	 * Gera relatório de top 10 itens mais alugados
	 * 
	 * @param string|null $dataInicial Data inicial (Y-m-d)
	 * @param string|null $dataFinal Data final (Y-m-d)
	 * @return array<string, mixed> Dados formatados para gráfico de pizza e tabela
	 */
	public function gerarRelatorioTop10ItensMaisAlugados(?string $dataInicial = null, ?string $dataFinal = null): array {
		try {
			if (!$dataInicial || !$dataFinal) {
				$dataInicial = date('Y-m-01');
				$dataFinal = date('Y-m-t');
			}

			$this->validarFormatoDatas($dataInicial, $dataFinal);

			$top10Itens = $this->repositorioRelatorio->buscarTop10ItensMaisAlugados($dataInicial, $dataFinal);
			$totalLocacoesPeriodo = $this->repositorioRelatorio->buscarTotalLocacoesPeriodo($dataInicial, $dataFinal);

			if (empty($top10Itens) || $totalLocacoesPeriodo === 0) {
				return [
					'periodo' => [
						'dataInicial' => $dataInicial,
						'dataFinal' => $dataFinal,
						'dataInicialFormatada' => date('d/m/Y', strtotime($dataInicial)),
						'dataFinalFormatada' => date('d/m/Y', strtotime($dataFinal))
					],
					'resumo' => [
						'totalLocacoesPeriodo' => 0,
						'totalItensUnicos' => 0
					],
					'ranking' => [],
					'grafico' => []
				];
			}

			$top10Ids = array_column($top10Itens, 'equipamento_id');
			$quantidadeOutros = $this->repositorioRelatorio->buscarQuantidadeOutrosItens($dataInicial, $dataFinal, $top10Ids);

			$ranking = [];
			$grafico = [];
			$somaTop10 = 0;

			foreach ($top10Itens as $index => $item) {
				$quantidade = (int) $item['quantidade_locacoes'];
				$percentual = ($quantidade / $totalLocacoesPeriodo) * 100;
				$somaTop10 += $quantidade;

				$ranking[] = [
					'posicao' => $index + 1,
					'equipamentoId' => (int) $item['equipamento_id'],
					'modelo' => $item['modelo'],
					'fabricante' => $item['fabricante'],
					'descricao' => $item['descricao'],
					'tipo' => $item['tipo'],
					'quantidadeLocacoes' => $quantidade,
					'percentual' => round($percentual, 2)
				];

				$grafico[] = [
					'label' => $item['modelo'] . ' - ' . $item['fabricante'],
					'valor' => $quantidade,
					'percentual' => round($percentual, 2)
				];
			}

			if ($quantidadeOutros > 0) {
				$percentualOutros = ($quantidadeOutros / $totalLocacoesPeriodo) * 100;
				$grafico[] = [
					'label' => 'Outros',
					'valor' => $quantidadeOutros,
					'percentual' => round($percentualOutros, 2)
				];
			}

			return [
				'periodo' => [
					'dataInicial' => $dataInicial,
					'dataFinal' => $dataFinal,
					'dataInicialFormatada' => date('d/m/Y', strtotime($dataInicial)),
					'dataFinalFormatada' => date('d/m/Y', strtotime($dataFinal))
				],
				'resumo' => [
					'totalLocacoesPeriodo' => $totalLocacoesPeriodo,
					'totalItensUnicos' => count($top10Itens),
					'quantidadeTop10' => $somaTop10,
					'quantidadeOutros' => $quantidadeOutros
				],
				'ranking' => $ranking,
				'grafico' => $grafico
			];
		} catch (\Throwable $error) {
			throw new \DominioException("Erro ao gerar relatório de itens mais alugados: " . $error->getMessage());
		}
	}

	/**
	 * Valida o formato das datas informadas
	 */
	private function validarFormatoDatas(string $dataInicial, string $dataFinal): void {
		$formatoEsperado = 'Y-m-d';

		$dataInicialObj = \DateTime::createFromFormat($formatoEsperado, $dataInicial);
		$dataFinalObj = \DateTime::createFromFormat($formatoEsperado, $dataFinal);

		if (!$dataInicialObj || $dataInicialObj->format($formatoEsperado) !== $dataInicial) {
			throw new \InvalidArgumentException("Data inicial deve estar no formato Y-m-d");
		}

		if (!$dataFinalObj || $dataFinalObj->format($formatoEsperado) !== $dataFinal) {
			throw new \InvalidArgumentException("Data final deve estar no formato Y-m-d");
		}

		if ($dataInicialObj > $dataFinalObj) {
			throw new \InvalidArgumentException("Data inicial deve ser menor ou igual à data final");
		}
	}
}