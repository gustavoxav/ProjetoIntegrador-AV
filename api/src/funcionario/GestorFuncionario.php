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
    public function login(string $cpf, string $senha): array {
        try {
            if (empty($cpf) || empty($senha)) {
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

            $dadosFuncionario = [
                'codigo' => $funcionario->codigo,
                'nome' => $funcionario->nome,
                'cpf' => $funcionario->cpf,
                'cargo' => $funcionario->cargo
            ];

            AuthHelper::iniciarSessao($dadosFuncionario);

            return $dadosFuncionario;
        } catch (\Throwable $error) {
            throw new ErroLoginException($error->getMessage());
        }
    }

    /**
     * Realiza logout do funcionário autenticado
     *
     * @return array<string, string> Mensagem de sucesso
     */
    public function logout(): array {
        try {
            AuthHelper::destruirSessao();
            return ['mensagem' => 'Logout realizado com sucesso.'];
        } catch (\Throwable $error) {
            throw new \DominioException("Erro ao realizar logout: " . $error->getMessage());
        }
    }

    /**
     * Verifica se o funcionário está autenticado e retorna seus dados
     *
     * @return array<string, mixed>|null Dados do funcionário autenticado ou null
     */
    public function verificarAutenticacao(): array|null {
        try {
            if (!AuthHelper::estaAutenticado()) {
                return null;
            }

            return AuthHelper::obterFuncionarioLogado();
        } catch (\Throwable $error) {
            throw new \DominioException("Erro ao verificar autenticação: " . $error->getMessage());
        }
    }

    /**
     * Verifica se o funcionário logado tem permissão para determinado cargo
     *
     * @param string $cargoRequerido
     * @return bool
     */
    public function temPermissao(string $cargoRequerido): bool {
        try {
            return AuthHelper::temPermissao($cargoRequerido);
        } catch (\Throwable $error) {
            return false;
        }
    }
}
