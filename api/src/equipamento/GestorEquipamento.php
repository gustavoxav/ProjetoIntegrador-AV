<?php

class GestorEquipamento
{

    public function __construct(
        private RepositorioEquipamento $repositorioEquipamento
    ) {}

    /**
     * Buscar um Equipamento por Código. Caso não tenha nenhum filtro, retorna todos os equipamentos.
     *
     * @param int|null $filtro
     * @return Equipamento[]
     */
    public function obterEquipamentos(int|null $filtro): array|Equipamento|null
    {
        try {
            if (is_null($filtro)) {
                return $this->repositorioEquipamento->buscarEquipamentos();
            }
            return $this->repositorioEquipamento->buscarEquipamentoFiltro($filtro);
        } catch (\Throwable $error) {
            throw $error;
        }
    }
}
