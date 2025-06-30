<?php

interface RepositorioDevolucao {
    /**
     * Salva uma devolução no repositório
     * @param Devolucao $devolucao A devolução a ser salva
     * @return array<string,mixed> A devolução salva com código gerado
     */
    public function salvar(Devolucao $devolucao);
    
    /**
     * Obtém uma devolução pelo código
     * @param int $codigo O código da devolução
     * @return array<string,mixed>|null A devolução encontrada ou null se não existir
     */
    public function obterPorId($codigo);
    
    /**
     * Obtém todas as devoluções ou filtra por locação ou funcionário
     * @param string|null $filtro Filtro opcional por código da locação ou funcionário
     * @param bool $apenasLocacaoId Se true, busca apenas por locacao_id
     * @return array<int,array<string,mixed>> Lista de devoluções
     */
    public function obterTodos($filtro = null, $apenasLocacaoId = false);
}
