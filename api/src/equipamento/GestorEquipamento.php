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
     * @return Equipamento|null
     */
    public function obterEquipamentos(int $filtro): Equipamento|null
    {
        try {
            return $this->repositorioEquipamento->buscarEquipamentoFiltro($filtro);
        } catch (\Throwable $error) {
            throw $error;
        }
    }
}
