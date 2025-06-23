<?php

class AuthMiddleware {
  /**
   * Verifica se o usuário está autenticado
   * Retorna 401 se não estiver
   */
  public static function verificarAutenticacao($req, $res, $next) {
    try {
      if (!AuthHelper::estaAutenticado()) {
        return $res->status(401)->json([
          'sucesso' => false,
          'erro' => 'Acesso negado. Faça login para continuar.',
          'codigo' => 'NAO_AUTENTICADO'
        ]);
      }

      return $next($req, $res);
    } catch (Exception $e) {
      return $res->status(500)->json([
        'sucesso' => false,
        'erro' => 'Erro interno do servidor ao verificar autenticação.',
        'codigo' => 'ERRO_INTERNO'
      ]);
    }
  }

  /**
   * Verifica se o usuário tem permissão específica (cargo)
   */
  public static function verificarPermissao(string $cargoRequerido) {
    return function ($req, $res, $next) use ($cargoRequerido) {
      try {
        if (!AuthHelper::estaAutenticado()) {
          return $res->status(401)->json([
            'sucesso' => false,
            'erro' => 'Acesso negado. Faça login para continuar.',
            'codigo' => 'NAO_AUTENTICADO'
          ]);
        }

        if (!AuthHelper::temPermissao($cargoRequerido)) {
          return $res->status(403)->json([
            'sucesso' => false,
            'erro' => 'Acesso negado. Você não tem permissão para acessar este recurso.',
            'codigo' => 'SEM_PERMISSAO'
          ]);
        }

        return $next($req, $res);
      } catch (Exception $e) {
        return $res->status(500)->json([
          'sucesso' => false,
          'erro' => 'Erro interno do servidor ao verificar permissões.',
          'codigo' => 'ERRO_INTERNO'
        ]);
      }
    };
  }

  /**
   * Verifica se é Gerente
   */
  public static function verificarGerente($req, $res, $next) {
    return self::verificarPermissao('Gerente')($req, $res, $next);
  }

  /**
   * Verifica se é Atendente ou superior
   */
  public static function verificarAtendente($req, $res, $next) {
    return self::verificarPermissao('Atendente')($req, $res, $next);
  }

  /**
   * Verifica se é Mecânico ou superior
   */
  public static function verificarMecanico($req, $res, $next) {
    return self::verificarPermissao('Mecânico')($req, $res, $next);
  }
} 