import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorDevolucao } from "../gestor/gestor-devolucao.js";
import type { VisaoDevolucao } from "../visao/visao-devolucao.js";
import { GestorLocacao } from "../gestor/gestor-locacao.js";

export class ControladoraDevolucao {
  private gestor: GestorDevolucao;

  constructor(private visao: VisaoDevolucao) {
    this.gestor = new GestorDevolucao();
    this.buscarDevolucoes();
  }

  public async registrarDevolucao(): Promise<void> {
    try {
      const dadosDevolucao = this.visao.obterDadosDevolucao();
      console.log("Dados devolução obtidos:", dadosDevolucao);

      if (!dadosDevolucao.locacao.codigo) {
        this.visao.exibirMensagemErro("Selecione uma locação existente");
        return;
      }

      if (!dadosDevolucao.funcionario.codigo) {
        this.visao.exibirMensagemErro(
          "Selecione um funcionário responsável pela devolução"
        );
        return;
      }

      const dadosFormatados = {
        locacao: {
          codigo: Number(dadosDevolucao.locacao),
        },
        registradoPor: {
          codigo: Number(dadosDevolucao.funcionario.codigo),
        },
      };

      console.log(
        "Enviando para API:",
        JSON.stringify(
          {
            locacao: {
              codigo: Number(dadosDevolucao.locacao),
            },
            registradoPor: {
              codigo: Number(dadosDevolucao.funcionario),
            },
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
    const gestor = new GestorDevolucao();
    try {
      console.log("Buscando devolucoes");

      const response = await gestor.obterDevolucoes();
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
}
