import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorFuncionario } from "./gestor-funcionario.js";
import { FuncionarioLogado } from "../infra/AuthMiddleware.js";
import type { VisaoFuncionario } from "./visao-funcionario.js";
import type { Funcionario } from "../types/types.js";

export class ControladoraFuncionario {
  private readonly gestor: GestorFuncionario = new GestorFuncionario();
  constructor(private readonly visao: VisaoFuncionario) {}

  public iniciarFiltro() {
    this.buscarTodosFuncionarios();
  }

  public async buscarTodosFuncionarios() {
    try {
      const response = await this.gestor.obterTodosFuncionarios();
      this.visao.mostrarTodosFuncionarios(response);
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens([
          "Erro desconhecido ao buscar funcionários",
        ]);
      }
    }
  }

  public async login(): Promise<void> {
    try {
      const dadosLogin = this.visao.obterDadosLogin();
      if (!dadosLogin?.cpf || !dadosLogin?.senha) {
        this.visao.exibirMensagemErro("Por favor, preencha todos os campos!");
        return;
      }
      await this.gestor.loginFuncionario(dadosLogin.cpf, dadosLogin.senha);

      await this.carregarDadosFuncionario();

      this.visao.exibirMensagemSucesso("Login realizado com sucesso!");
      window.location.href = "/locacao-list";
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao realizar login";
        this.visao.exibirMensagemErro(errorMessage);
      }
    }
  }

  public isRotaAllowed(): boolean {
    try {
      const rota = window.location.pathname;
      if (rota === "/" || rota === "/login") {
        return true;
      }
      const funcionario = FuncionarioLogado.obter();
      const cargo = funcionario?.cargo ?? "";
      const rotasValidas = [
        "/locacao-list",
        "/locacao-add",
        "/devolucao-list",
        "/devolucao-add",
        "/relatorio-devolucoes",
        "/relatorio-itens",
      ];
      if (!rotasValidas.includes(rota)) {
        return false;
      }
      const acessosPorCargo: Record<string, string[]> = {
        Gerente: [
          "/locacao-list",
          "/locacao-add",
          "/devolucao-list",
          "/devolucao-add",
          "/relatorio-devolucoes",
          "/relatorio-itens",
        ],
        Atendente: [
          "/locacao-list",
          "/locacao-add",
          "/devolucao-list",
          "/devolucao-add",
          "/relatorio-itens",
        ],
        Mecanico: ["/locacao-list", "/devolucao-list"],
      };
      const rotasPermitidas = acessosPorCargo[cargo] || [];

      return rotasPermitidas.includes(rota);
    } catch (error) {
      console.error("Erro ao verificar acesso à rota:", error);
      return false;
    }
  }

  public async carregarDadosFuncionario(): Promise<void> {
    try {
      const funcionario = await this.gestor.obterFuncionarioLogado();
      FuncionarioLogado.definir(funcionario);
    } catch (error: unknown) {
      console.error("Erro ao carregar dados do funcionário:", error);
    }
  }

  public obterFuncionarioLogado(): Funcionario | null {
    const func = FuncionarioLogado.obter();
    return func;
  }

  public obterNomeECargoFuncionarioLogado(): string {
    const nome = FuncionarioLogado.obterNome();
    const cargo = FuncionarioLogado.obterCargo();
    return cargo ? `${nome} - ${cargo}` : nome;
  }

  public async logout(): Promise<void> {
    try {
      await this.gestor.logoutFuncionario();
      FuncionarioLogado.limpar();
      window.location.href = "/";
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao realizar logout";
        this.visao.exibirMensagemErro(errorMessage);
      }
      FuncionarioLogado.limpar();
      window.location.href = "/";
    }
  }
}
