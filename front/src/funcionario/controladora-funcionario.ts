import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorFuncionario } from "./gestor-funcionario.js";
import type { VisaoFuncionario } from "./visao-funcionario.js";

export class ControladoraFuncionario {
  private readonly gestor: GestorFuncionario = new GestorFuncionario();
  constructor(private visao: VisaoFuncionario) {}

  public iniciarFiltro() {
    this.buscarTodosFuncionarios();
  }

  public iniciarLogin() {
    const navbarElement = document.getElementById("navbar-container");
    if (navbarElement) {
      navbarElement.style.display = "none";
    }
    const footerElement = document.getElementById("footer-container");
    if (footerElement) {
      footerElement.style.display = "none";
    }

    const loginButton = document.getElementById("realizar-login");
    if (loginButton) {
      const newButton = loginButton.cloneNode(true);
      loginButton.parentNode?.replaceChild(newButton, loginButton);

      newButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.login();
        return false;
      });
    }
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
}
