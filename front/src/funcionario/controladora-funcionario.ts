import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorFuncionario } from "./gestor-funcionario.js";
import type { VisaoFuncionario } from "./visao-funcionario.js";

export class ControladoraFuncionario {
  constructor(private visao: VisaoFuncionario) {
    this.buscarTodosFuncionarios();
  }

  public async buscarTodosFuncionarios() {
    const gestor = new GestorFuncionario();
    try {
      const response = await gestor.obterTodosFuncionarios();
      this.visao.mostrarTodosFuncionarios(response);
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens(["Erro desconhecido ao buscar funcionários"]);
      }
    }
  }
}
