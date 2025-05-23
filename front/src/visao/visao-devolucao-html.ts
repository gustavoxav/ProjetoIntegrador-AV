import type { VisaoDevolucao } from "./visao-devolucao.js";
import { ControladoraDevolucao } from "../controladora/controladora-devolucao.js";
import type { RespostaDevolucao, RespostaLocacao } from "../types/types.js";
import { formatarDataHora } from "../infra/utils.js";

export class VisaoDevolucaoEmHTML implements VisaoDevolucao {
  private readonly controladora: ControladoraDevolucao;
  private isSubmitting = false;
  private locacaoSelecionada: RespostaLocacao | null = null;

  constructor() {
    this.controladora = new ControladoraDevolucao(this);
    document
      .getElementById("btn-buscar-locacoes")
      ?.addEventListener("click", () => this.controladora.buscarLocacoes());
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
    const cliente = this.locacaoSelecionada?.cliente.codigo ?? "";

    return {
      funcionario: {
        codigo: Number(funcionario),
      },
      cliente: {
        codigo: Number(cliente),
      },
      locacao: {
        codigo: 0,
      },
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
      <td class="text-start align-middle">${
        this.locacaoSelecionada?.codigo
      } ${this.locacaoSelecionada?.horasContratadas === 1 ? 'hora' : 'horas'}</td>
      <td class="text-start align-middle">${
        this.locacaoSelecionada?.cliente.nomeCompleto
      }</td>
      <td class="text-start align-middle">${devolucao.valorTotal}</td>
    `;

      tbody.appendChild(row);
    }
  }

  filtroLocacao() {
    const button = document.getElementById(
      "input-buscar-locacao"
    ) as HTMLButtonElement;
    const valor = button ? button.value : undefined;
    return { filtro: valor };
  }

  mostrarLocacoes(locacoes: RespostaLocacao[] | undefined) {
    const container = document.getElementById("tabela-locacoes-list");
    if (!container) return;
    container.innerHTML = "";
    console.log("LOC LIST: ", locacoes);
    if (!locacoes || locacoes.length === 0) {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td colspan="7" class="text-center">Nenhuma locação encontrada.</td>
    `;
      container.appendChild(linha);
      return;
    }

    locacoes.forEach((locacao) => {
      const tr = document.createElement("tr");

      const botaoSelecionar =
        locacoes.length === 1
          ? `<button class="btn btn-sm btn-success" disabled>Selecionado</button>`
          : `<button class="btn btn-sm btn-primary btn-selecionar" type="button" data-id="${locacao.codigo}">Selecionar</button>`;

      tr.innerHTML = `
      <td>${locacao.codigo}</td>
      <td>${locacao.horasContratadas}</td>
      <td>${locacao.horasContratadas}</td>
      <td>${locacao.dataHoraEntregaPrevista}</td>
      <td>${locacao.cliente.nomeCompleto}</td>
      <td>${locacao.cliente.telefone}</td>
      <td>${botaoSelecionar}</td>
    `;
      container.appendChild(tr);
    });

    if (locacoes.length === 1) {
      this.selecionarLocacao(locacoes[0]);
    }

    if (locacoes.length > 1) {
      document.querySelectorAll(".btn-selecionar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const id = Number(target.dataset.id);
          const loc = locacoes.find((l) => l.codigo === id);
          if (loc) this.selecionarLocacao(loc);
        });
      });
    }
  }

  selecionarLocacao(locacao: RespostaLocacao) {
    console.log("Locação selecionada:", locacao);
    document.querySelectorAll("#tabela-locacoes-list tr").forEach((tr) => {
      tr.classList.remove("selecionado");
      const btn = tr.querySelector(".btn-selecionar") as HTMLButtonElement;
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Selecionar";
        btn.classList.remove("btn-success");
        btn.classList.add("btn-primary");
      }
    });

    const linhaSelecionada = Array.from(
      document.querySelectorAll("#tabela-locacoes-list tr")
    ).find((tr) => {
      const id = tr.querySelector(".btn-selecionar")?.getAttribute("data-id");
      return Number(id) === locacao.codigo;
    });

    if (linhaSelecionada) {
      linhaSelecionada.classList.add("selecionado");
      const btn = linhaSelecionada.querySelector(
        ".btn-selecionar"
      ) as HTMLButtonElement;
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Selecionado";
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-success");
      }
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
