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
}
