import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorCliente } from "../gestor/gestor-cliente.js";
import type { VisaoCliente } from "../visao/visao-clientes.js";

export class ControladoraCliente {
  constructor(private visao: VisaoCliente) {}

  public async buscarClientes() {
    const visaoFilter = this.visao.filtroClientes();
    const gestor = new GestorCliente();
    try {
      const response = await gestor.obterClientes(Number.parseInt(visaoFilter.filtro));
      this.visao.retornarClientes(response);
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
