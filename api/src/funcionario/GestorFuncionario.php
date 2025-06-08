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

    /**
     * Realiza o login de um funcionário com base no CPF e senha.
     *
     * @param string $cpf
     * @param string $senha
     * @return array<string, mixed> Dados do funcionário autenticado
     * @throws \Throwable Em caso de erro ao buscar o funcionário
     */
    public function login(string $cpf, string $senha)
    {
        try {
            if (is_null($cpf) || is_null($senha)) {
                throw new \CredenciaisInvalidasException("CPF e senha são obrigatórios para o login.");
            }
            if (strlen($cpf) !== 11) {
                throw new \CredenciaisInvalidasException("CPF inválido. Deve conter 11 dígitos.");
            }

            $funcionario = $this->repositorioFuncionario->buscarFuncionarioFiltro($cpf);

            if (!$funcionario) {
                throw new CredenciaisInvalidasException("CPF ou senha inválidos");
            }

            if (!AuthHelper::verificarSenha($senha, $funcionario->salt, $funcionario->senha_hash)) {
                throw new CredenciaisInvalidasException("CPF ou senha inválidos");
            }

            $funcionario = [
                'codigo' => $funcionario->codigo,
                'nome' => $funcionario->nome,
                'cpf' => $funcionario->cpf,
                'cargo' => $funcionario->cargo
            ];

            return $funcionario;
        } catch (\Throwable $error) {
            throw new ErroLoginException($error);
        }
    }
}
