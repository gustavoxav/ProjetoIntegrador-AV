import type { RespostaDevolucao } from "../types/types";

export interface VisaoDevolucao {
  obterDadosDevolucao(): {
    locacao: {
      codigo: number;
    };
    cliente: {
      codigo: number;
    };
    funcionario: {
      codigo: number;
    };
  };
  exibirListagemDevolucao(devolucoes: RespostaDevolucao[] | undefined): void;

  salvar(): Promise<void>;
  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
}
