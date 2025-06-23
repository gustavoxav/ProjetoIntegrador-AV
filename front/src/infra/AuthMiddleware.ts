import page from "page";

export class AuthMiddleware {
  /**
   * Verifica se há cookie de sessão do usuário
   * @returns boolean indicando se há sessão ativa
   */
  public static verificarCookieSessao(): boolean {
    const cookies = document.cookie.split(';');
    const temSessao = cookies.some(cookie => 
      cookie.trim().startsWith('PHPSESSID=') && 
      cookie.trim().length > 'PHPSESSID='.length
    );
    
    return temSessao;
  }

  /**
   * Middleware de controle de login:
   * - Se tem cookie: vai para /locacao-list
   * - Se não tem: vai para /
   */
  public static controleLogin(ctx: any, next: () => void): void {
    if (AuthMiddleware.verificarCookieSessao()) {
      page.redirect('/locacao-list');
      return;
    }
    
    next();
  }

  /**
   * Middleware para rotas protegidas:
   * - Se não tem cookie: vai para /
   * - Se tem: continua na rota
   */
  public static protegerRota(ctx: any, next: () => void): void {
    if (!AuthMiddleware.verificarCookieSessao()) {
      page.redirect('/');
      return;
    }
    
    next();
  }
} 