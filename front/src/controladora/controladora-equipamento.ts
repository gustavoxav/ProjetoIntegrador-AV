import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorEquipamento } from "../gestor/gestor-equipamento.js";
import { VisaoEquipamento } from "../visao/visao-equipamento.js";

export class ControladoraEquipamento {
  constructor(private visao: VisaoEquipamento) {}

  public async buscarEquipamento() {
    const visaoFilter = this.visao.filtroEquipamento();
    const gestor = new GestorEquipamento();
    try {
      const response = await gestor.obterEquipamento(parseInt(visaoFilter.filtro));
      this.visao.retornarEquipamento(response);
    } catch (error: any) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else {
        this.visao.exibirMensagens([error.message]);
      }
    }
  }
}
