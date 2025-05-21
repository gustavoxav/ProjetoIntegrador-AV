import type { RespostaLocacao } from "../types/types";

export interface VisaoLocacao {
  obterDadosLocacao(): {
    funcionario: string;
    cliente: string;
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
  filtroLocacao(): {
    filtro: string | undefined;
  };
  exibirListagemLocacao(locacoes: RespostaLocacao[]|undefined): void;
  selecionarLocacao(locacao: RespostaLocacao): void;
  mostrarLocacoes(locacoes: RespostaLocacao[]|undefined): void;

  salvar(): Promise<void>;
  exibirMensagemSucesso(x: string): void;
  exibirMensagemErro(x: string): void;
}
