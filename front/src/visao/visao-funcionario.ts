import type { Funcionario } from "../types/types";

export interface VisaoFuncionario {
  filtroFuncionario(): { filtro: string };

  exibirMensagens(mensagens: string[]): void;
  retornarFuncionarios(funcionarios: Funcionario): void;
  mostrarTodosFuncionarios(funcionarios: Funcionario[]): void;
}
