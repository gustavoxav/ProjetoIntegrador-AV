import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorDevolucao } from "./gestor-devolucao.js";
import type { VisaoDevolucao } from "./visao-devolucao.js";
import { GestorLocacao } from "../locacao/gestor-locacao.js";
import { VisaoEquipamento } from "../equipamento/visao-equipamento.js";
import { VisaoFuncionario } from "../funcionario/visao-funcionario.js";
import { ControladoraFuncionario } from "../funcionario/controladora-funcionario.js";

export class ControladoraDevolucao {
  private readonly gestor: GestorDevolucao;

  constructor(
    private readonly visao: VisaoDevolucao,
    private readonly visaoFuncionario: VisaoFuncionario | null = null,
    private readonly visaoEquipamento: VisaoEquipamento | null = null
  ) {
    this.gestor = new GestorDevolucao();
    if (this.visaoFuncionario) {
      new ControladoraFuncionario(this.visaoFuncionario).iniciarFiltro();
    }
  }

  public async registrarDevolucao(): Promise<void> {
    try {
      const dadosSimulacao = this.visao.obterDadosDevolucao();
      if (!dadosSimulacao?.locacao.codigo) {
        this.visao.exibirMensagemErro("Selecione uma locação existente");
        return;
      }

      if (!dadosSimulacao?.registradoPor) {
        this.visao.exibirMensagemErro(
          "Selecione um funcionário responsável pela devolução"
        );
        return;
      }
      const dadosDevolucaoFormatado = {
        locacaoId: Number(dadosSimulacao?.locacao.codigo),
        registradoPor: dadosSimulacao.registradoPor,
        dataHoraDevolucao: dadosSimulacao?.dataHoraDevolucao,
        valorPago: dadosSimulacao?.valorPago,
      };

      try {
        await this.gestor.registrarDevolucao(dadosDevolucaoFormatado);

        this.visao.exibirMensagemSucesso("Devolução registrada com sucesso!");

        window.location.href = "/devolucao-list";
      } catch (apiError) {
        console.error("Erro na API:", apiError);
        if (apiError instanceof ErroDominio) {
          this.visao.exibirMensagemErro(apiError.getProblemas()[0]);
        } else {
          this.visao.exibirMensagemErro("Erro ao processar requisição");
        }
      }
    } catch (error: unknown) {
      console.error("Erro ao processar devolução:", error);
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao registrar devolução";
        this.visao.exibirMensagemErro(errorMessage);
      }
    }
  }

  public async buscarDevolucoes() {
    try {
      const response = await this.gestor.obterDevolucoes();
      this.visao.exibirListagemDevolucao(response);
    } catch (error: any) {
      this.visao.exibirListagemDevolucao(undefined);

      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        this.visao.exibirMensagemErro(error.message);
      }
    }
  }

  public async buscarLocacoes() {
    const filtroValor = this.visao.filtroLocacao().filtro;
    const filtro = filtroValor ? parseInt(filtroValor as string) : undefined;
    const gestor = new GestorLocacao();
    try {
      const response = await gestor.obterLocacoes(filtro);

      this.visao.mostrarLocacoes(response);
    } catch (error: any) {
      this.visao.mostrarLocacoes(undefined);

      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        this.visao.exibirMensagemErro(error.message);
      }
    }
  }

  public async obterSimulacao(locacaoId: number) {
    try {
      const response = await this.gestor.obterSimulacaoDevolucoes(locacaoId);
      const equipamentos = response.locacao.itens.map(
        (item) => item.equipamento
      );
      this.visaoEquipamento?.exibirEquipamentosDevolucao(
        equipamentos,
        response.locacao.horasContratadas
      );

      this.visao.preencherDevolucao(response);
    } catch (error: any) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        this.visao.exibirMensagemErro(error.message);
      }
    }
  }

  public async buscarDadosRelatorio(inicio: string, fim: string) {
    try {
      const response = await this.gestor.relatorioDevolucao(inicio, fim);
      this.visao.exibirRelatorio(response);
    } catch (error: any) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        this.visao.exibirMensagemErro(error.message);
      }
    }
  }
}
