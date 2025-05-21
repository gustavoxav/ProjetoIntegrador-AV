<?php

interface RepositorioLocacao {
    /**
     * Salva uma locação no repositório
     * @param Locacao $locacao A locação a ser salva
     * @return Locacao A locação salva com código gerado
     */
    public function salvar(Locacao $locacao);
    
    /**
     * Obtém uma locação pelo código
     * @param int $filtro O código da locação ou CPF do cliente
     * @return Locacao[]|null A locação encontrada ou null se não existir
     */
    public function obterPorFiltro($filtro);
    
    /**
     * Obtém todas as locações ou filtra por cliente ou funcionário
     * @param string|null $filtro Filtro opcional por código do cliente ou funcionário
     * @return array Lista de locações
     */
    public function obterTodos($filtro = null);
}
