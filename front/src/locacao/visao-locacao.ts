import type { Funcionario, RespostaLocacao } from "../types/types";

export interface VisaoLocacao {
  obterDadosLocacao(): {
    horas: number;
    subtotal: string;
    desconto: string;
    valorTotal: string;
    dataLocacao: string;
    dataDevolucao: string;
    registradoPor: Funcionario | null;
  };

  exibirListagemLocacao(locacoes: RespostaLocacao[] | undefined): void;

  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
}
