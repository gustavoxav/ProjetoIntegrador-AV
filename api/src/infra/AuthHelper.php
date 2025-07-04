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
     * Configura parâmetros seguros para cookies de sessão
     */
    private static function configurarCookiesSessao(): void {
        if (!headers_sent()) {
            session_set_cookie_params([
                'lifetime' => self::TIMEOUT_SESSAO,
                'path' => '/',
                'domain' => '',
                'secure' => false,
                'httponly' => false,
            ]);
        }
    }

    /**
     * Inicia uma sessão para o funcionário autenticado
     * @param array{codigo: int, nome: string, cpf: string, cargo: string} $funcionario
     */
    public static function iniciarSessao(array $funcionario): void {
        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            self::configurarCookiesSessao();
            session_start();
        }

        $_SESSION['funcionario'] = $funcionario;
        $_SESSION['ultimo_acesso'] = time();
        
        if (!headers_sent()) {
            session_regenerate_id(true);
        }
    }

    /**
     * Verifica se o usuário está autenticado e se a sessão não expirou
     */
    public static function estaAutenticado(): bool {
        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            self::configurarCookiesSessao();
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
     * @return array{codigo: int, nome: string, cpf: string, cargo: string}|null
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
        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            self::configurarCookiesSessao();
            session_start();
        }

        $_SESSION = array();

        if (ini_get("session.use_cookies") && !headers_sent()) {
            $params = session_get_cookie_params();
            $sessionName = session_name();
            if ($sessionName !== false) {
                    setcookie($sessionName, '', time() - 42000,
                        $params["path"], $params["domain"],
                        $params["secure"], $params["httponly"]
                    );
            }
        }

        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
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
