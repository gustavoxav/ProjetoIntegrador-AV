import type { VisaoDevolucao } from "./visao-devolucao.js";
import { ControladoraDevolucao } from "../controladora/controladora-devolucao.js";
import type { RespostaDevolucao } from "../types/types.js";
import { formatarDataHora } from "../infra/utils.js";

export class VisaoDevolucaoEmHTML implements VisaoDevolucao {
  private readonly controladora: ControladoraDevolucao;
  private isSubmitting = false;

  constructor() {
    this.controladora = new ControladoraDevolucao(this);
  }

  public async salvar(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      await this.controladora.registrarDevolucao();
    } catch (error) {
      console.error("Erro ao registrar devolução:", error);
    } finally {
      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
    }
  }

  obterDadosDevolucao() {
    const funcionario =
      (document.getElementById("funcionario") as HTMLSelectElement)?.value ||
      "";
    const cliente =
      (document.getElementById("cliente") as HTMLInputElement)?.value || "";

    return {
      funcionario: {
        codigo: Number(funcionario),
      },
      cliente: {
        codigo: Number(cliente),
      },
      locacao: {
        codigo: 0
      }
    };
  }

  public exibirListagemDevolucao(
    devolucoes: RespostaDevolucao[] | undefined
  ): void {
    const tbody = document.getElementById("tabela-devolucao");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (!devolucoes || devolucoes.length === 0) {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td colspan="7" class="text-center">Nenhuma devolucao encontrada.</td>
    `;
      tbody.appendChild(linha);
      return;
    }
    for (const devolucao of devolucoes) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td class="text-start align-middle">${devolucao.codigo}</td>
      <td class="text-start align-middle">${formatarDataHora(
        formatarDataHora(devolucao.dataHoraLocacao)
      )}</td>
      <td class="text-start align-middle">${devolucao.locacao.codigo} horas</td>
      <td class="text-start align-middle">${devolucao.cliente.nomeCompleto}</td>
      <td class="text-start align-middle">${devolucao.valorTotal}</td>
    `;

      tbody.appendChild(row);
    }
  }

  exibirMensagemSucesso(x: string): void {
    const output = document.querySelector("output");
    if (output) {
      output.className = "alert alert-success mt-3 d-block";
      output.textContent = x;
    }
  }

  exibirMensagemErro(x: string): void {
    const output = document.querySelector("output");
    if (output) {
      output.className = "alert alert-danger mt-3 d-block";
      output.textContent = x;
    }
  }
}
