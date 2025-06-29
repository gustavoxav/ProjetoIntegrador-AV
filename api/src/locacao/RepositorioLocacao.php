<?php

interface RepositorioLocacao {
    /**
     * Salva uma locação no repositório
     * @param Locacao $locacao A locação a ser salva
     * @return array<string,mixed> A locação salva com código gerado
     * @throws PDOException erro
     */
    public function salvar(Locacao $locacao);
    
    /**
     * Obtém uma locação pelo código
     * @param int $filtro O código da locação ou CPF do cliente
     * @return array<int,array<string,mixed>> A locação encontrada ou array vazio se não existir
     * @throws PDOException erro
     */
    public function obterPorFiltro($filtro);
    
    /**
     * Obtém uma locação pelo ID
     * @param int $id O código da locação
     * @return array<string,mixed>|null A locação encontrada ou null se não existir
     * @throws PDOException erro
     */
    public function obterPorId($id);
    
    /**
     * Obtém todas as locações ou filtra por cliente ou funcionário
     * @param string|null $filtro Filtro opcional por código do cliente ou funcionário
     * @return array<int,array<string,mixed>> Lista de locações
     * @throws PDOException erro
     */
    public function obterTodos($filtro = null);
}
