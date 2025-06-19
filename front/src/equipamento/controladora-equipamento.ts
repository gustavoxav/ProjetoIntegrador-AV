import { VisaoFuncionarioEmHTML } from "../funcionario/visao-funcionario-html.js";
import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorEquipamento } from "./gestor-equipamento.js";
import type { VisaoEquipamento } from "./visao-equipamento.js";

export class ControladoraEquipamento {
  private readonly visaoFuncionario = new VisaoFuncionarioEmHTML();

  constructor(private readonly visao: VisaoEquipamento) {}

  public async buscarEquipamento() {
    const visaoFilter = this.visao.filtroEquipamento();
    const gestor = new GestorEquipamento();
    try {
      const response = await gestor.obterEquipamento(
        Number.parseInt(visaoFilter.filtro)
      );
      this.visao.retornarEquipamento(response);
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens(["Erro desconhecido"]);
      }
    }
  }

  public async buscarTodosEquipamentos() {
    const gestor = new GestorEquipamento();
    try {
      const response = await gestor.obterTodosEquipamentos();
      this.visao.retornarTodosEquipamentos(response);
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens(["Erro desconhecido"]);
      }
    }
  }

  public async registrarAvarias() {
    const gestor = new GestorEquipamento();
    try {
      const dadosAvarias = this.visao.retornarDadosAvaria();
      await gestor.registrarAvaria({
        ...dadosAvarias,
        registradoPor: this.visaoFuncionario.obterDadosFuncionario(),
      });
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens(["Erro desconhecido"]);
      }
    }
  }
}
