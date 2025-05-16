import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorCliente } from "../gestor/gestor-cliente.js";
import { VisaoCliente } from "../visao/visao-clientes.js";

export class ControladoraCliente {
  constructor(private visao: VisaoCliente) {}

  public async buscarClientes() {
    const visaoFilter = this.visao.filtroClientes();
    const gestor = new GestorCliente();
    try {
      const response = await gestor.obterClientes(parseInt(visaoFilter.filtro));
      this.visao.retornarClientes(response);
    } catch (error: any) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else {
        this.visao.exibirMensagens([error.message]);
      }
    }
  }
}
