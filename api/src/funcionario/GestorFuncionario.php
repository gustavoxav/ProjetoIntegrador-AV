<?php

class GestorFuncionario
{

    public function __construct(
        private RepositorioFuncionario $repositorioFuncionario
    ) {}

    /**
     * Buscar um Funcionario por Código ou Nome. Caso não tenha nenhum filtro, retorna todos os funcionarios.
     *
     * @param int|string|null $filtro
     * @return Funcionario[]
     */
    public function obterFuncionarios(int|string|null $filtro): array|Funcionario|null
    {
        try {
            if (is_null($filtro)) {
                return $this->repositorioFuncionario->buscarFuncionarios();
            }
            return $this->repositorioFuncionario->buscarFuncionarioFiltro($filtro);
        } catch (\Throwable $error) {
            throw $error;
        }
    }
}
