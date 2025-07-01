<?php

interface RepositorioCliente
{
    /**
     * Buscar um cliente pelo código ou CPF e retorna-lo. Retorna null caso não encontre.
     *
     * @param string|int $parametro Código (int) ou CPF (string)
     * @throws \RepositorioException
     * @return Cliente|null
     */
    public function buscarClienteFiltro(string|int $parametro): Cliente|null;

    /**
     * Buscar todos os clientes. Retorna null caso não encontre.
     *
     * @throws \RepositorioException
     * @return Cliente[]|null
     */
    public function buscarClientes(): array|null;

  /**
   * Salva um novo cliente no banco de dados.
   * 
   * @param Cliente $cliente O cliente a ser salvo
   * @return Cliente O cliente salvo (inclusive com ID)
   * @throws RepositorioException Em caso de erro de persistência
   */
    public function salvar(Cliente $cliente): Cliente;
}
