<?php

interface RepositorioEquipamento
{
    /**
     * Buscar um equipamento pelo código retorna-lo. Retorna null caso não encontre.
     *
     * @param string|int $parametro Código (int)
     * @throws \RepositorioException
     * @return Equipamento|null
     */
    public function buscarEquipamentoFiltro(int $parametro): Equipamento|null;
}
