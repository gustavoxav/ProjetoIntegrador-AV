import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorDevolucao } from "./gestor-devolucao.js";
import type { VisaoDevolucao } from "./visao-devolucao.js";
import { GestorLocacao } from "../locacao/gestor-locacao.js";
import { VisaoEquipamento } from "../equipamento/visao-equipamento.js";
import { VisaoFuncionario } from "../funcionario/visao-funcionario.js";
import { ControladoraFuncionario } from "../funcionario/controladora-funcionario.js";
import { DadosAvaria } from "../types/types.js";

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

  public async registrarAvarias(): Promise<void> {
    try {
      const dadosAvaria = this.visao.obterDadosAvarias();
      const dadosFuncionario = this.visaoFuncionario?.obterDadosFuncionario();
      console.log(
        "Dados Avaria teste:",
        dadosAvaria,
        dadosAvaria &&
          dadosAvaria?.valorCobrar <=
            (dadosAvaria.equipamento?.valorOriginal ?? 0)
      );
      console.log("Dados Funcionário:", dadosFuncionario);
      if (!dadosFuncionario?.codigo) {
        this.visao.exibirMensagemErro(
          "Selecione um funcionário responsável pela devolução"
        );
        return;
      }

      if (!dadosAvaria?.descricao) {
        this.visao.exibirMensagemErro("Adicione uma descrição para a avaria!");
        return;
      }

      if (!dadosAvaria?.foto) {
        this.visao.exibirMensagemErro("Adicione uma imagem para a avaria!");
        return;
      }

      const nomeArquivo = dadosAvaria.foto.name.toLowerCase();
      if (!nomeArquivo.endsWith(".jpg")) {
        this.visao.exibirMensagemErro("A imagem deve estar no formato .jpg!");
        return;
      }

      if (!dadosAvaria?.valorCobrar) {
        this.visao.exibirMensagemErro("O valor da avaria é obrigatório!");
        return;
      }
      if (
        dadosAvaria?.valorCobrar > (dadosAvaria.equipamento?.valorOriginal ?? 0)
      ) {
        this.visao.exibirMensagemErro(
          "O valor da avaria não pode ser maior que o valor do item!"
        );
        return;
      }
      console.log("Dados Avaria pre:", dadosAvaria);
      const dadosAvariaFormatado: DadosAvaria = {
        valorCobrar: dadosAvaria?.valorCobrar,
        avaliadorId: dadosFuncionario.codigo,
        descricao: dadosAvaria?.descricao,
        equipamentoId: dadosAvaria?.equipamento?.codigo ?? 0,
        locacaoId: dadosAvaria?.locacaoId,
        foto: dadosAvaria?.foto,
      };
      console.log("Dados Avaria pos:", dadosAvariaFormatado);

      try {
        const response = await this.gestor.registrarAvaria(
          dadosAvariaFormatado
        );

        if (response && response.sucesso && response.avaria) {
          this.visao.exibirMensagemSucesso("Avaria registrada com sucesso!");
          this.visao.adicionarListagemAvarias(response.avaria);
          this.visao.fecharModalAvaria();
        } else {
          console.error("Resposta da API não tem a estrutura esperada:", response);
          this.visao.exibirMensagemSucesso("Avaria registrada com sucesso!");
          this.visao.fecharModalAvaria();
        }
      } catch (apiError) {
        console.error("Erro na API:", apiError);
        if (apiError instanceof ErroDominio) {
          this.visao.exibirMensagemErro(apiError.getProblemas()[0]);
        } else {
          this.visao.exibirMensagemErro("Erro ao processar requisição");
        }
      }
    } catch (error: unknown) {
      console.error("Erro ao processar avaria:", error);
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao registrar avaria";
        this.visao.exibirMensagemErro(errorMessage);
      }
    }
  }
}
