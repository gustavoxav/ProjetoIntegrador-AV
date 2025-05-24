import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorDevolucao } from "../gestor/gestor-devolucao.js";
import type { VisaoDevolucao } from "../visao/visao-devolucao.js";
import { GestorLocacao } from "../gestor/gestor-locacao.js";
import { VisaoEquipamento } from "../visao/visao-equipamento.js";
import { VisaoFuncionario } from "../visao/visao-funcionario.js";

export class ControladoraDevolucao {
  private readonly gestor: GestorDevolucao;

  constructor(
    private readonly visao: VisaoDevolucao,
    private readonly visaoFuncionario: VisaoFuncionario | null = null,
    private readonly visaoEquipamento: VisaoEquipamento | null = null
  ) {
    this.gestor = new GestorDevolucao();
    this.buscarDevolucoes();
    this.visao.aoSelecionarLocacao((locacao) => {
      this.obterSimulacao(locacao.codigo);
    });
  }

  public async registrarDevolucao(): Promise<void> {
    try {
      const dadosDevolucao = {
        locacaoId: this.visao.obterLocacaoId(),
        funcionario: this.visaoFuncionario?.obterDadosFuncionario(),
      };
      console.log("Dados devolução obtidos:", dadosDevolucao);

      if (!dadosDevolucao.locacaoId) {
        this.visao.exibirMensagemErro("Selecione uma locação existente");
        return;
      }

      if (!dadosDevolucao.funcionario) {
        this.visao.exibirMensagemErro(
          "Selecione um funcionário responsável pela devolução"
        );
        return;
      }

      const dadosFormatados = {
        locacaoId: Number(dadosDevolucao.locacaoId),
        registradoPor: dadosDevolucao.funcionario,
        dataHoraDevolucao: "2025-05-24 01:46:00",
        valorPago: 0,
      };

      console.log(
        "Enviando para API:",
        JSON.stringify(
          {
            locacaoId: Number(dadosDevolucao.locacaoId),
            registradoPor: dadosDevolucao.funcionario,
          },
          null,
          2
        )
      );

      try {
        const resultado = await this.gestor.registrarDevolucao(dadosFormatados);
        console.log("Cadastro realizado com sucesso:", resultado);

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
      console.log("Buscando devolucoes");

      const response = await this.gestor.obterDevolucoes();
      console.log("Devoluções obtidas:", response);
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
    console.log("Buscando locações...3", filtro);
    const gestor = new GestorLocacao();
    try {
      console.log("Buscando locações23");

      const response = await gestor.obterLocacoes(filtro);
      console.log("Locações obtidas 2:", response);

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
      console.log("Simulação da Devolução", response);
      const equipamentos = response.locacao.itens.map(
        (item) => item.equipamento
      );
        this.visaoEquipamento?.exibirEquipamentosDevolucao(equipamentos, response.locacao.horasContratadas);
      
      this.visao.preencherDevolucao(response);
    } catch (error: any) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        this.visao.exibirMensagemErro(error.message);
      }
    }
  }
}
