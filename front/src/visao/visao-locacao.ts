import type { RespostaLocacao } from "../types/types";

export interface VisaoLocacao {
  obterDadosLocacao(): {
    horas: number;
    equipamentos: Array<{
      codigo: number;
      descricao: string;
      valor: number;
    }>;
    subtotal: string;
    desconto: string;
    valorTotal: string;
    dataLocacao: string;
    dataDevolucao: string;
  };

  exibirListagemLocacao(locacoes: RespostaLocacao[] | undefined): void;

  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
}
