import { Cliente } from "../types/types";

export interface VisaoCliente {
  filtroClientes(): { filtro: string };

  exibirMensagens(mensagens: string[]): void;
  retornarClientes(clientes: Cliente): void;
}
