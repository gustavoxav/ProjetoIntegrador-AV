import type { VisaoDevolucao } from "./visao-devolucao.js";
import type {
  Equipamento,
  RespostaDevolucao,
  RespostaLocacao,
  RespostaSimulacaoDevolucao,
} from "../types/types.js";
import {
  formatarDataHora,
  calcularHorasUtilizadas,
  calcularHorasCobranca,
} from "../infra/utils.js";
import {
  calcularValores,
  calcularValorIndividual,
  formatarValorComSimbolo,
} from "../infra/calculadora-valores.js";
import { ControladoraDevolucao } from "./controladora-devolucao.js";
import { VisaoFuncionarioEmHTML } from "../funcionario/visao-funcionario-html.js";
import { VisaoEquipamentoEmHTML } from "../equipamento/visao-equipamento-html.js";

export class VisaoDevolucaoEmHTML implements VisaoDevolucao {
  private devolucaoData: RespostaSimulacaoDevolucao | null = null;
  private callbackSelecionarLocacao?: (locacao: RespostaLocacao) => void;

  private controladoraDevolucao: ControladoraDevolucao | null = null;

  public iniciarAdd(): void {
    this.controladoraDevolucao = new ControladoraDevolucao(
      this,
      new VisaoFuncionarioEmHTML(),
      new VisaoEquipamentoEmHTML()
    );
    const salvarButton = document.getElementById("salvar-devolucao");
    if (salvarButton) {
      const newButton = salvarButton.cloneNode(true);
      salvarButton.parentNode?.replaceChild(newButton, salvarButton);

      newButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.controladoraDevolucao?.registrarDevolucao();
        return false;
      });
    }

    document
      .getElementById("btn-buscar-locacoes")
      ?.addEventListener("click", () =>
        this.controladoraDevolucao?.buscarLocacoes()
      );

    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get("codigo");

    if (codigo) {
      const input = document.getElementById(
        "input-buscar-locacao"
      ) as HTMLElement;
      input.setAttribute("value", codigo);
    }
  }

  public iniciarList(): void {
    this.controladoraDevolucao?.buscarDevolucoes();
    this.aoSelecionarLocacao((locacao) => {
      this.controladoraDevolucao?.obterSimulacao(locacao.codigo);
    });

    const addButton = document.getElementById("addButton");
    if (addButton) {
      addButton.addEventListener("click", () => {
        window.history.pushState({}, "", "/devolucao-add");
        window.dispatchEvent(
          new CustomEvent("routeChange", {
            detail: { path: "/devolucao-add" },
          })
        );
      });
    }
  }

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
      <td class="text-start align-middle">${formatarValorComSimbolo(
        devolucao.valorPago
      )}</td>
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

      let button: string;
      if (locacao.devolvida) {
        button = `<button class="btn btn-sm btn-success" style="pointer-events: none; cursor: default;width: 92.63px" disable type="button">Devolvida</button>`;
      } else if (locacoes.length === 1) {
        button = `<button class="btn btn-sm btn-dark" disabled>Selecionado</button>`;
      } else {
        button = `<button class="btn btn-sm btn-outline-dark btn-selecionar" style="width: 92.63px" type="button" data-id="${locacao.codigo}">Selecionar</button>`;
      }

      tr.innerHTML = `
      <td>${locacao.codigo}</td>
      <td>${formatarDataHora(locacao.dataHoraLocacao)}</td>
      <td>${locacao.horasContratadas} ${
        locacao.horasContratadas === 1 ? "hora" : "horas"
      }</td>
      <td>${formatarDataHora(locacao.dataHoraEntregaPrevista)}</td>
      <td>${locacao.cliente.nomeCompleto}</td>
      <td>${locacao.cliente.telefone}</td>
      <td>${button}</td>
    `;
      container.appendChild(tr);
    }

    if (locacoes.length === 1) {
      this.selecionarLocacao(locacoes[0]);
    }

    if (locacoes.length > 1) {
      for (const btn of document.querySelectorAll(".btn-selecionar")) {
        (btn as HTMLButtonElement).addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const id = Number(target.dataset.id);
          const loc = locacoes.find((l) => l.codigo === id);
          if (loc) this.selecionarLocacao(loc);
        });
      }
    }
  }

  public preencherDevolucao(devolucao: RespostaSimulacaoDevolucao) {
    this.devolucaoData = devolucao;

    const horasUtilizadas = calcularHorasUtilizadas(
      devolucao.locacao.dataHoraLocacao,
      devolucao.dataHoraDevolucao
    );

    const horasCobranca = calcularHorasCobranca(
      devolucao.locacao.dataHoraLocacao,
      devolucao.dataHoraDevolucao
    );

    const horasParaCalculo = Math.max(
      horasCobranca,
      devolucao.locacao.horasContratadas
    );

    const equipamentos = devolucao.locacao.itens.map(
      (item) => item.equipamento
    );

    this.atualizarValoresTotais(
      equipamentos,
      horasParaCalculo,
      devolucao.valorPago
    );

    this.atualizarTabelaEquipamentos(equipamentos, horasParaCalculo);

    this.atualizarHorasNaTela(devolucao.locacao.horasContratadas);

    const dataLocacaoEl = document.getElementById("data-locacao");
    if (dataLocacaoEl) {
      dataLocacaoEl.textContent = formatarDataHora(devolucao.dataHoraDevolucao);
    }

    const horasUtilizadasEl = document.getElementById("horas-utilizadas");
    if (horasUtilizadasEl) {
      const horaTexto = horasUtilizadas.horas === 1 ? "hora" : "horas";
      const minutoTexto = horasUtilizadas.minutos === 1 ? "minuto" : "minutos";
      horasUtilizadasEl.textContent = `${horasUtilizadas.horas} ${horaTexto} e ${horasUtilizadas.minutos} ${minutoTexto}`;
    }

    const avisoEl = document.getElementById("aviso-valor-minimo");
    if (avisoEl) {
      if (horasCobranca < devolucao.locacao.horasContratadas) {
        avisoEl.classList.remove("d-none");
      } else {
        avisoEl.classList.add("d-none");
      }
    }
  }

  selecionarLocacao(locacao: RespostaLocacao) {
    this.callbackSelecionarLocacao?.(locacao);
    for (const tr of document.querySelectorAll("#tabela-locacoes-list tr")) {
      tr.classList.remove("selecionado");
      const btn = tr.querySelector(".btn-selecionar") as HTMLButtonElement;
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Selecionar";
        btn.classList.remove("btn-outline-dark");
        btn.classList.add("btn-dark");
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
        btn.classList.remove("btn-warning");
        btn.classList.add("btn-dark");
      }
    }
  }

  private atualizarValoresTotais(
    equipamentos: Equipamento[],
    horas: number,
    valorTotalSimulacao?: number
  ): void {
    const resultado = calcularValores(equipamentos, horas);

    const subtotalEl = document.getElementById("subtotal-itens");
    const descontoEl = document.getElementById("desconto");
    const totalEl = document.getElementById("valor-total");

    if (subtotalEl)
      subtotalEl.textContent = resultado.subtotal.toFixed(2).replace(".", ",");
    if (descontoEl)
      descontoEl.textContent = resultado.desconto.toFixed(2).replace(".", ",");
    if (totalEl) {
      const valorTotal = valorTotalSimulacao ?? resultado.valorTotal;
      totalEl.textContent = valorTotal.toFixed(2).replace(".", ",");
    }
  }

  private atualizarHorasNaTela(horas: number): void {
    const horasContratadasEl = document.getElementById("horas-contratadas");
    if (horasContratadasEl) horasContratadasEl.textContent = horas.toString();

    const horasTextoEl = document.getElementById("horas-texto");
    if (horasTextoEl) horasTextoEl.textContent = horas === 1 ? "hora" : "horas";
  }

  private atualizarTabelaEquipamentos(
    equipamentos: Equipamento[],
    horas: number
  ): void {
    const tabelaEquipamentos = document.getElementById("tabela-equipamentos");
    if (!tabelaEquipamentos) return;

    if (equipamentos.length === 0) {
      tabelaEquipamentos.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">Nenhum equipamento foi encontrado</td>
      </tr>
    `;
      return;
    }

    tabelaEquipamentos.innerHTML = "";
    for (const equipamento of equipamentos) {
      const tr = this.criarLinhaEquipamento(equipamento, horas);
      tabelaEquipamentos.appendChild(tr);
    }
  }

  private criarLinhaEquipamento(
    equipamento: Equipamento,
    horas: number
  ): HTMLTableRowElement {
    const { valorTotal, desconto, temDesconto } = calcularValorIndividual(
      equipamento,
      horas
    );

    const tr = document.createElement("tr");
    tr.setAttribute("equip-codigo", equipamento.codigo.toString());
    tr.appendChild(
      this.criarCelula(`${equipamento.codigo} - ${equipamento.descricao}`)
    );
    tr.appendChild(
      this.criarCelula(formatarValorComSimbolo(equipamento.valorHora))
    );
    tr.appendChild(this.criarCelula(formatarValorComSimbolo(valorTotal)));

    const tdDesconto = this.criarCelula(formatarValorComSimbolo(desconto));
    if (temDesconto) tdDesconto.className = "text-success";
    tr.appendChild(tdDesconto);

    return tr;
  }

  private criarCelula(texto: string): HTMLTableCellElement {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
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
