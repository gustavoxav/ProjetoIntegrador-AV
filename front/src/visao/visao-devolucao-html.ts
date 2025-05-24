import type { VisaoDevolucao } from "./visao-devolucao.js";
import type {
  Equipamento,
  RespostaDevolucao,
  RespostaLocacao,
  RespostaSimulacaoDevolucao,
} from "../types/types.js";
import { formatarDataHora } from "../infra/utils.js";

export class VisaoDevolucaoEmHTML implements VisaoDevolucao {
  private devolucaoData: RespostaSimulacaoDevolucao | null = null;
  private callbackSelecionarLocacao?: (locacao: RespostaLocacao) => void;

  obterDadosDevolucao() {
    return this.devolucaoData;
  }

  aoSelecionarLocacao(callback: (locacao: RespostaLocacao) => void): void {
    this.callbackSelecionarLocacao = callback;
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
      <td colspan="6" class="text-center">Nenhuma devolução encontrada.</td>
    `;
      tbody.appendChild(linha);
      return;
    }

    for (const devolucao of devolucoes) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td class="text-start align-middle">${devolucao.codigo}</td>
      <td class="text-start align-middle">${formatarDataHora(
        devolucao.dataHoraDevolucao
      )}</td>
      <td class="text-start align-middle">${devolucao.locacao.codigo}</td>
      <td class="text-start align-middle">${
        devolucao.locacao.cliente.nomeCompleto
      }</td>
      <td class="text-start align-middle">${devolucao.registradoPor.nome}</td>
      <td class="text-start align-middle">R$ ${devolucao.valorPago}</td>
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

    for (const locacao of locacoes) {
      const tr = document.createElement("tr");

      const botaoSelecionar =
        locacoes.length === 1
          ? `<button class="btn btn-sm btn-success" disabled>Selecionado</button>`
          : `<button class="btn btn-sm btn-primary btn-selecionar" type="button" data-id="${locacao.codigo}">Selecionar</button>`;

      tr.innerHTML = `
      <td>${locacao.codigo}</td>
      <td>${formatarDataHora(locacao.dataHoraLocacao)}</td>
      <td>${locacao.horasContratadas} Horas</td>
      <td>${formatarDataHora(locacao.dataHoraEntregaPrevista)}</td>
      <td>${locacao.cliente.nomeCompleto}</td>
      <td>${locacao.cliente.telefone}</td>
      <td>${botaoSelecionar}</td>
    `;
      container.appendChild(tr);
    }

    if (locacoes.length === 1) {
      this.selecionarLocacao(locacoes[0]);
    }

    if (locacoes.length > 1) {
      for (const btn of document.querySelectorAll(".btn-selecionar")) {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const id = Number(target.dataset.id);
          const loc = locacoes.find((l) => l.codigo === id);
          if (loc) this.selecionarLocacao(loc);
        });
      }
    }
  }

  public preencherDevolucao(devolucao: RespostaSimulacaoDevolucao) {
    console.log("Preenchendo devolução:", devolucao);
    this.devolucaoData = devolucao;
    this.atualizarValoresTotais({
      horasContratadas: devolucao.locacao.horasContratadas,
      desconto: devolucao.locacao.desconto,
      valorTotal: devolucao.locacao.valorTotal,
      equipamentos: devolucao.locacao.itens.map((item) => item.equipamento),
    });
  }

  selecionarLocacao(locacao: RespostaLocacao) {
    console.log("Locação selecionada:", locacao);
    this.callbackSelecionarLocacao?.(locacao);
    for (const tr of document.querySelectorAll("#tabela-locacoes-list tr")) {
      tr.classList.remove("selecionado");
      const btn = tr.querySelector(".btn-selecionar") as HTMLButtonElement;
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Selecionar";
        btn.classList.remove("btn-success");
        btn.classList.add("btn-primary");
      }
    }

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

  private atualizarValoresTotais(devolucaoData: {
    desconto: number;
    valorTotal: number;
    horasContratadas: number;
    equipamentos: Equipamento[];
  }): void {
    const subtotalEl = document.getElementById("subtotal-itens");
    const descontoEl = document.getElementById("desconto");
    const totalEl = document.getElementById("valor-total");
    const subtotal = devolucaoData.equipamentos.reduce(
      (acc, equipamento) => acc + equipamento.valorHora * (devolucaoData.horasContratadas ?? 0),
      0
    );
    if (subtotalEl)
      subtotalEl.textContent = subtotal.toFixed(2).replace(".", ",");
    if (descontoEl)
      descontoEl.textContent = devolucaoData.desconto
        .toFixed(2)
        .replace(".", ",");
    if (totalEl)
      totalEl.textContent = devolucaoData.valorTotal
        .toFixed(2)
        .replace(".", ",");
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
