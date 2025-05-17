<?php

interface RepositorioFuncionario
{
/**
 * Buscar um funcionario pelo código ou nome e retorna-lo. Retorna null caso não encontre.
 *
 * @param string|int $parametro Código (int) ou nome (string)
 * @throws \RepositorioException
 * @return Funcionario|null
 */
public function buscarFuncionarioFiltro(string|int $parametro): Funcionario|null;

/**
 * Buscar todos os funcionarios. Retorna null caso não encontre.
 *
 * @throws \RepositorioException
 * @return Funcionario|null
 */
public function buscarFuncionarios(): array|null;
}

?>