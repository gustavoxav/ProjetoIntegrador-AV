<?php

interface RepositorioEquipamento
{
    /**
     * Buscar um equipamento pelo código retorna-lo. Retorna null caso não encontre.
     *
     * @param int $parametro Código (int)
     * @throws \RepositorioException
     * @return Equipamento|null
     */
    public function buscarEquipamentoFiltro(int $parametro): Equipamento|null;

    /**
     * Buscar todos os equipamentos. Retorna null caso não encontre
     *
     * @throws \RepositorioException
     * @return Equipamento[]|null
     */
    public function buscarEquipamentos(): array|null;


    /**
     * Buscar todos os equipamentos. Retorna null caso não encontre
     * @param int $equipamentoId Código do equipamento
     * @param string $avarias Descrição das avarias
     * @throws \RepositorioException
     * @return void
     */
    public function adicionarAvarias(int $equipamentoId, string $avarias): void;
}
