<?php

interface RepositorioRelatorio {
  /**
   * Busca dados para o relatório de locações devolvidas por período
   * 
   * @param string $dataInicial Data inicial no formato Y-m-d
   * @param string $dataFinal Data final no formato Y-m-d
   * @return array Array com dados agrupados por data
   */
  public function buscarLocacoesDevolvidasPorPeriodo(string $dataInicial, string $dataFinal): array;

  /**
   * Busca dados para o relatório de top 10 itens mais alugados
   * 
   * @param string $dataInicial Data inicial no formato Y-m-d
   * @param string $dataFinal Data final no formato Y-m-d
   * @return array Array com ranking de equipamentos mais alugados
   */
  public function buscarTop10ItensMaisAlugados(string $dataInicial, string $dataFinal): array;

  /**
   * Busca total de locações no período para cálculo de percentual
   * 
   * @param string $dataInicial Data inicial no formato Y-m-d
   * @param string $dataFinal Data final no formato Y-m-d
   * @return int Total de locações no período
   */
  public function buscarTotalLocacoesPeriodo(string $dataInicial, string $dataFinal): int;

  /**
   * Busca a quantidade de locações dos itens fora do TOP 10
   * 
   * @param string $dataInicial Data inicial no formato Y-m-d
   * @param string $dataFinal Data final no formato Y-m-d
   * @param array $top10Ids Array com IDs dos equipamentos do TOP 10
   * @return int Quantidade de locações dos outros itens
   */
  public function buscarQuantidadeOutrosItens(string $dataInicial, string $dataFinal, array $top10Ids): int;
} 