import type {
  RespostaDevolucao,
  RespostaLocacao,
  RespostaSimulacaoDevolucao,
  DevolucaoComFuncionario,
  RespostaRelatorioDevolucao,
  DadosAvariaVisao,
  RespostaAvaria,
} from "../types/types";

export interface VisaoDevolucao {
  obterDadosDevolucao(): DevolucaoComFuncionario | null;
  exibirListagemDevolucao(devolucoes: RespostaDevolucao[] | undefined): void;
  selecionarLocacao(locacao: RespostaLocacao): void;
  aoSelecionarLocacao(callback: (locacao: RespostaLocacao) => void): void;
  mostrarLocacoes(locacoes: RespostaLocacao[] | undefined): void;
  filtroLocacao(): {
    filtro: string | undefined;
  };
  preencherDevolucao(devolucao: RespostaSimulacaoDevolucao): void;
  obterTaxasLimpezaSelecionadas(): Record<number, boolean>;
  exibirRelatorio(relatorio: RespostaRelatorioDevolucao): void;
  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
  obterDadosAvarias(): DadosAvariaVisao | null;
  fecharModalAvaria(): void;
  adicionarListagemAvarias(avaria: RespostaAvaria | null): void;
}
