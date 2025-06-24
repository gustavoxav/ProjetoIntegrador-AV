import page from "page";
import type { Funcionario } from "../types/types.js";

export class FuncionarioLogado {
  private static funcionario: Funcionario | null = null;
  
  public static definir(funcionario: Funcionario): void {
    this.funcionario = funcionario;
    sessionStorage.setItem('funcionarioLogado', JSON.stringify(funcionario));
  }
  
  public static obter(): Funcionario | null {
    if (this.funcionario) {
      return this.funcionario;
    }
    
    const dados = sessionStorage.getItem('funcionarioLogado');
    if (dados) {
      this.funcionario = JSON.parse(dados);
      return this.funcionario;
    }
    
    return null;
  }
  
  public static limpar(): void {
    this.funcionario = null;
    sessionStorage.removeItem('funcionarioLogado');
  }
  
  public static obterNome(): string {
    const funcionario = this.obter();
    return funcionario ? funcionario.nome : '';
  }
  
  public static obterCargo(): string {
    const funcionario = this.obter();
    return funcionario?.cargo || '';
  }
}

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
   * - Se tem: continua na rota e inicializa dados do usuário
   */
  public static protegerRota(ctx: any, next: () => void): void {
    if (!AuthMiddleware.verificarCookieSessao()) {
      page.redirect('/');
      return;
    }
    
    AuthMiddleware.inicializarDadosUsuario().then(() => {
      next();
    });
  }

  /**
   * Inicializa os dados do usuário se não tiver
   */
  private static async inicializarDadosUsuario(): Promise<void> {
    if (!FuncionarioLogado.obter() && AuthMiddleware.verificarCookieSessao()) {
      try {
        const { ControladoraFuncionario } = await import("../funcionario/controladora-funcionario.js");
        const { VisaoFuncionarioEmHTML } = await import("../funcionario/visao-funcionario-html.js");
        
        const controladora = new ControladoraFuncionario(new VisaoFuncionarioEmHTML());
        await controladora.carregarDadosFuncionario();
      } catch (error) {
        console.error("Erro ao inicializar dados do usuário:", error);
      }
    }
  }
} 