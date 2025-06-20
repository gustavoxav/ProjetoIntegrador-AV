import type {
  RespostaDevolucao,
  RespostaLocacao,
  RespostaSimulacaoDevolucao,
} from "../types/types";

export interface VisaoDevolucao {
  obterDadosDevolucao(): RespostaSimulacaoDevolucao | null;
  exibirListagemDevolucao(devolucoes: RespostaDevolucao[] | undefined): void;
  selecionarLocacao(locacao: RespostaLocacao): void;
  aoSelecionarLocacao(callback: (locacao: RespostaLocacao) => void): void;
  mostrarLocacoes(locacoes: RespostaLocacao[] | undefined): void;
  filtroLocacao(): {
    filtro: string | undefined;
  };
  preencherDevolucao(devolucao: RespostaSimulacaoDevolucao): void;
  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
}
