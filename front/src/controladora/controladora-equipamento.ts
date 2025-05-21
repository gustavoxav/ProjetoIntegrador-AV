import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorEquipamento } from "../gestor/gestor-equipamento.js";
import type { VisaoEquipamento } from "../visao/visao-equipamento.js";

export class ControladoraEquipamento {
  constructor(private visao: VisaoEquipamento) {}

  public async buscarEquipamento() {
    const visaoFilter = this.visao.filtroEquipamento();
    const gestor = new GestorEquipamento();
    try {
      const response = await gestor.obterEquipamento(Number.parseInt(visaoFilter.filtro));
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
}
