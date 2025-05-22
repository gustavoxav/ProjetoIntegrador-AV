import type { RespostaDevolucao, RespostaLocacao } from "../types/types";

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
  selecionarLocacao(locacao: RespostaLocacao): void;
  mostrarLocacoes(locacoes: RespostaLocacao[] | undefined): void;
  filtroLocacao(): {
    filtro: string | undefined;
  };
  salvar(): Promise<void>;
  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
}
