<?php
class AuthHelper {
    private const TIMEOUT_SESSAO = 600; // 10 minutos

    /**
     * Obtém o PEPPER do arquivo .env
     */
    private static function obterPepper(): string {
        return $_ENV['PEPPER'] ?? 'projetoI123456';
    }

    /**
     * Verifica se a senha fornecida corresponde ao hash armazenado
     */
    public static function verificarSenha(string $senha, string $salt, string $senha_hash): bool {
        return self::gerarHashSenha($senha, $salt) === $senha_hash;
    }

    /**
     * Inicia uma sessão para o funcionário autenticado
     */
    public static function iniciarSessao(array $funcionario): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $_SESSION['funcionario'] = $funcionario;
        $_SESSION['ultimo_acesso'] = time();
        
        session_regenerate_id(true);
    }

    /**
     * Verifica se o usuário está autenticado e se a sessão não expirou
     */
    public static function estaAutenticado(): bool {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['funcionario']) || !isset($_SESSION['ultimo_acesso'])) {
            return false;
        }

        if (time() - $_SESSION['ultimo_acesso'] > self::TIMEOUT_SESSAO) {
            self::destruirSessao();
            return false;
        }

        $_SESSION['ultimo_acesso'] = time();
        return true;
    }

    /**
     * Obtém os dados do funcionário logado
     */
    public static function obterFuncionarioLogado(): array|null {
        if (!self::estaAutenticado()) {
            return null;
        }

        return $_SESSION['funcionario'];
    }

    /**
     * Destrói a sessão atual (logout)
     */
    public static function destruirSessao(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        session_destroy();
    }

    /**
     * Verifica se o funcionário tem permissão para acessar determinado recurso
     */
    public static function temPermissao(string $cargoRequerido): bool {
        $funcionario = self::obterFuncionarioLogado();
        
        if (!$funcionario) {
            return false;
        }

        $hierarquia = [
            'Mecânico' => 1,
            'Atendente' => 2,
            'Gerente' => 3
        ];

        $cargoAtual = $funcionario['cargo'] ?? '';
        
        return isset($hierarquia[$cargoAtual]) && 
            isset($hierarquia[$cargoRequerido]) &&
            $hierarquia[$cargoAtual] >= $hierarquia[$cargoRequerido];
    }

    /**
     * Gera um hash SHA-512 para uma senha com sal e pimenta
     */
    public static function gerarHashSenha(string $senha, string $salt): string {
        return hash('sha512', $salt . $senha . self::obterPepper());
    }
}
