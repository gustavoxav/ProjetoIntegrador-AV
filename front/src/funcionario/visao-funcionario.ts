import type { Funcionario } from "../types/types";

export interface VisaoFuncionario {
  filtroFuncionario(): { filtro: string };
  obterDadosFuncionario(): {
    codigo: number;
    nome: string;
  };
  exibirMensagens(mensagens: string[]): void;
  mostrarTodosFuncionarios(funcionarios: Funcionario[]): void;
}
