import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorLocacao } from "./gestor-locacao.js";
import type { VisaoLocacao } from "./visao-locacao.js";
import { VisaoCliente } from "../cliente/visao-clientes.js";
import { VisaoFuncionario } from "../funcionario/visao-funcionario.js";
import { VisaoEquipamento } from "../equipamento/visao-equipamento.js";
import { ControladoraFuncionario } from "../funcionario/controladora-funcionario.js";
import { Equipamento } from "../types/types.js";

export class ControladoraLocacao {
  private readonly gestor: GestorLocacao;

  constructor(
    private readonly visao: VisaoLocacao,
    private readonly visaoCliente?: VisaoCliente,
    private readonly visaoFuncionario?: VisaoFuncionario,
    private readonly visaoEquipamento?: VisaoEquipamento
  ) {
    this.gestor = new GestorLocacao();
    if (this.visaoFuncionario) {
      new ControladoraFuncionario(this.visaoFuncionario).iniciarFiltro();
    }
  }

  public async registrarLocacao(): Promise<void> {
    try {
      const dadosLocacao = {
        ...this.visao.obterDadosLocacao(),
        cliente: this.visaoCliente?.obterDadosCliente(),
        equipamentos:
          this.visaoEquipamento?.obterEquipamentosSelecionados() || [],
      };

      if (!dadosLocacao.cliente) {
        console.error("Dados do cliente não encontrados");
        this.visao.exibirMensagemErro("Informe o código ou CPF do cliente");
        return;
      }

      if (!dadosLocacao.registradoPor) {
        console.error("Dados do funcionário não encontrados");
        this.visao.exibirMensagemErro(
          "Selecione um funcionário responsável pela locação"
        );
        return;
      }

      if (!Array.isArray(dadosLocacao.equipamentos)) {
        console.error(
          "Equipamentos não é um array:",
          dadosLocacao.equipamentos
        );
        this.visao.exibirMensagemErro(
          "Erro ao processar equipamentos. Tente novamente."
        );
        return;
      }

      if (dadosLocacao.equipamentos.length === 0) {
        console.error("Nenhum equipamento foi selecionado");
        this.visao.exibirMensagemErro(
          "Selecione pelo menos um equipamento para a locação"
        );
        return;
      }

      const equipamentosInvalidos = dadosLocacao.equipamentos.filter(
        (e) => !e.codigo
      );
      if (equipamentosInvalidos.length > 0) {
        console.error("Equipamentos inválidos:", equipamentosInvalidos);
        this.visao.exibirMensagemErro("Há equipamentos inválidos na locação");
        return;
      }

      const dadosFormatados = {
        cliente: {
          codigo: Number(dadosLocacao.cliente),
        },
        registradoPor: {
          codigo: dadosLocacao.registradoPor.codigo,
        },
        horasContratadas: dadosLocacao.horas,
        itens: dadosLocacao.equipamentos.map((eq) => ({
          equipamento: {
            codigo: eq.codigo,
            descricao: eq.descricao,
            valorHora: eq.valorHora,
            disponivel: true,
            modelo: eq.modelo ?? "",
            fabricante: eq.fabricante ?? "",
            avarias: eq.avarias ?? "",
            numeroSeguro: eq.numeroSeguro ?? ""
          } as Equipamento,
        })),
      };

      try {
        await this.gestor.registrarLocacao(dadosFormatados);
        this.visao.exibirMensagemSucesso("Locação registrada com sucesso!");
        window.location.href = "/";
      } catch (apiError) {
        console.error("Erro na API:", apiError);
        if (apiError instanceof ErroDominio) {
          this.visao.exibirMensagemErro(apiError.getProblemas()[0]);
        } else {
          this.visao.exibirMensagemErro("Erro ao processar requisição");
        }
      }
    } catch (error: unknown) {
      console.error("Erro ao processar locação:", error);
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao registrar locação";
        this.visao.exibirMensagemErro(errorMessage);
      }
    }
  }

  public async buscarLocacoes() {
    const gestor = new GestorLocacao();
    try {
      const response = await gestor.obterLocacoes();

      this.visao.exibirListagemLocacao(response);
    } catch (error: any) {
      this.visao.exibirListagemLocacao(undefined);
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagemErro(error.getProblemas()[0]);
      } else {
        this.visao.exibirMensagemErro(error.message);
      }
    }
  }
}
