import type { Cliente } from "../types/types";

export interface VisaoCliente {
  filtroClientes(): { filtro: string };
  obterDadosCliente(): number | null;
  exibirMensagens(mensagens: string[]): void;
  retornarClientes(clientes: Cliente): void;
}
