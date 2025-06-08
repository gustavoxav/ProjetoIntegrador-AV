import type { DadosLogin, Funcionario } from "../types/types";

export interface VisaoFuncionario {
  obterDadosLogin(): DadosLogin | null;
  filtroFuncionario(): { filtro: string };
  obterDadosFuncionario(): {
    codigo: number;
    nome: string;
  };
  exibirMensagens(mensagens: string[]): void;
  mostrarTodosFuncionarios(funcionarios: Funcionario[]): void;
  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
}
