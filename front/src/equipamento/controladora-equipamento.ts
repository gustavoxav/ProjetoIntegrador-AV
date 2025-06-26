import { VisaoFuncionarioEmHTML } from "../funcionario/visao-funcionario-html.js";
import { ErroDominio } from "../infra/ErroDominio.js";
import { GestorEquipamento } from "./gestor-equipamento.js";
import type { VisaoEquipamento } from "./visao-equipamento.js";

export class ControladoraEquipamento {
  private readonly visaoFuncionario = new VisaoFuncionarioEmHTML();

  private readonly gestor: GestorEquipamento = new GestorEquipamento();
  constructor(private readonly visao: VisaoEquipamento) {}

  public async buscarEquipamento() {
    const visaoFilter = this.visao.filtroEquipamento();
    try {
      const response = await this.gestor.obterEquipamento(
        Number.parseInt(visaoFilter.filtro)
      );
      this.visao.retornarEquipamento(response);
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens(["Erro desconhecido"]);
      }
    }
  }

  public async buscarTodosEquipamentos() {
    try {
      const response = await this.gestor.obterTodosEquipamentos();
      this.visao.retornarTodosEquipamentos(response);
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens(["Erro desconhecido"]);
      }
    }
  }

  public async registrarAvarias() {
    try {
      const dadosAvarias = this.visao.retornarDadosAvaria();
      await this.gestor.registrarAvaria({
        ...dadosAvarias,
        registradoPor: this.visaoFuncionario.obterDadosFuncionario(),
      });
    } catch (error: unknown) {
      if (error instanceof ErroDominio) {
        this.visao.exibirMensagens(error.getProblemas());
      } else if (error instanceof Error) {
        this.visao.exibirMensagens([error.message]);
      } else {
        this.visao.exibirMensagens(["Erro desconhecido"]);
      }
    }
  }

  public async buscarDadosRelatorio(inicio: string, fim: string) {
    try {
      const response = await this.gestor.relatorioEquipamento(inicio, fim);
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
