<?php

class GestorEquipamento
{

    public function __construct(
        private RepositorioEquipamento $repositorioEquipamento
    ) {}

    /**
     * Buscar um Equipamento por Código.
     *
     * @param int $filtro
     * @return Equipamento
     */
    public function obterEquipamentos(int $filtro): Equipamento
    {
        try {
            return $this->repositorioEquipamento->buscarEquipamentoFiltro($filtro);
        } catch (\Throwable $error) {
            throw $error;
        }
    }
}
