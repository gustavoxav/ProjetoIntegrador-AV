import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorFuncionario } from "./gestor-funcionario.js";
import type { VisaoFuncionario } from "./visao-funcionario.js";

export class ControladoraFuncionario {
  private readonly gestor: GestorFuncionario = new GestorFuncionario();
  constructor(private visao: VisaoFuncionario) {}

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
      this.visao.exibirMensagemSucesso("Devolução registrada com sucesso!");
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

  public async obterNomeFuncionarioLogado(): Promise<string> {
    try {
      const funcionario = await this.gestor.obterFuncionarioLogado();
      return `Olá, ${funcionario.nome}!`;
    } catch (error: unknown) {
      console.error("Erro ao carregar dados do usuário:", error);
      return "";
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.gestor.logoutFuncionario();
      window.location.href = "/";
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao realizar logout";
        this.visao.exibirMensagemErro(errorMessage);
      }
      window.location.href = "/";
    }
  }
}
