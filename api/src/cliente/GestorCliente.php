<?php

class GestorCliente
{

    public function __construct(
        private RepositorioCliente $repositorioCliente
    ) {}

    /**
     * Buscar um Cliente por CPF ou Código. Caso não tenha nenhum filtro, retorna todos os clientes.
     *
     * @param int|string|null $filtro
     * @return Cliente[]
     */
    public function obterClientes(int|string|null $filtro): array|Cliente|null
    {
        try {
            if (is_null($filtro)) {
                // echo "caso 1 all";
                return $this->repositorioCliente->buscarClientes();
            }
            return $this->repositorioCliente->buscarClienteFiltro($filtro);
        } catch (\Throwable $error) {
            throw $error;
        }
    }
}
