declare const bootstrap: any;

import type { VisaoDevolucao } from "./visao-devolucao.js";
import type {
  DadosAvariaVisao,
  DevolucaoComFuncionario,
  Equipamento,
  RespostaDevolucao,
  RespostaLocacao,
  RespostaRelatorioDevolucao,
  RespostaSimulacaoDevolucao,
} from "../types/types.js";
import {
  formatarDataHora,
  calcularHorasUtilizadas,
  calcularHorasCobranca,
  formatarData,
} from "../infra/utils.js";
import {
  calcularValores,
  calcularValorIndividual,
  formatarValorComSimbolo,
} from "../infra/calculadora-valores.js";
import { ControladoraDevolucao } from "./controladora-devolucao.js";
import { VisaoFuncionarioEmHTML } from "../funcionario/visao-funcionario-html.js";
import { VisaoEquipamentoEmHTML } from "../equipamento/visao-equipamento-html.js";
import { ControladoraFuncionario } from "../funcionario/controladora-funcionario.js";
import { Chart, ChartItem, registerables } from "chart.js";

export class VisaoDevolucaoEmHTML implements VisaoDevolucao {
  private devolucaoData: RespostaSimulacaoDevolucao | null = null;
  private callbackSelecionarLocacao?: (locacao: RespostaLocacao) => void;
  private readonly controladoraFuncionario: ControladoraFuncionario =
    new ControladoraFuncionario(new VisaoFuncionarioEmHTML());
  private readonly controladoraDevolucao: ControladoraDevolucao | null =
    new ControladoraDevolucao(
      this,
      new VisaoFuncionarioEmHTML(),
      new VisaoEquipamentoEmHTML()
    );
  private grafico: Chart | null = null;
  private idItemAvaria: { codigo: number; valorOriginal: number } | null = null;

  public iniciarAdd(): void {
    document
      .getElementById("salvar-devolucao")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        this.controladoraDevolucao?.registrarDevolucao();
        return false;
      });

    document
      .getElementById("btn-salvar-avarias")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        this.controladoraDevolucao?.registrarAvarias();
        return false;
      });

    this.aoSelecionarLocacao((locacao) => {
      this.controladoraDevolucao?.obterSimulacao(locacao.codigo);
    });

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
    const addButton = document.getElementById("addButton");

    if (
      this.controladoraFuncionario.obterFuncionarioLogado()?.cargo ===
      "Mecanico"
    ) {
      addButton?.classList.add("d-none");
      return;
    }

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

  public iniciarRelatorio(): void {
    const inputInicio = document.getElementById(
      "start-date"
    ) as HTMLInputElement;
    const inputFim = document.getElementById("end-date") as HTMLInputElement;
    const btnBuscar = document.getElementById("btn-buscar-relatorio");

    if (!inputInicio || !inputFim || !btnBuscar) return;
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    inputInicio.value = primeiroDia.toISOString().split("T")[0];
    inputFim.value = ultimoDia.toISOString().split("T")[0];

    btnBuscar.addEventListener("click", async () => {
      const dataInicio = inputInicio.value;
      const dataFim = inputFim.value;

      if (!dataInicio || !dataFim) return;

      await this.controladoraDevolucao?.buscarDadosRelatorio(
        dataInicio,
        dataFim
      );
    });

    btnBuscar.click();
  }

  public exibirRelatorio(retorno: RespostaRelatorioDevolucao) {
    const { dados, periodo, resumo } = retorno.relatorio;
    const canvas = document.getElementById("grafico-gevolucao");
    const resumoContainer = document.getElementById("resumo-relatorio");
    const totalGeralSpan = document.getElementById("resumo-total-geral");
    const qtdLocacoesSpan = document.getElementById("resumo-qtd-locacoes");
    const qtdDiasSpan = document.getElementById("resumo-qtd-dias");
    const output = document.querySelector("output");

    if (resumoContainer && totalGeralSpan && qtdLocacoesSpan && qtdDiasSpan) {
      totalGeralSpan.textContent = `R$ ${resumo.valorTotalGeral
        .toFixed(2)
        .replace(".", ",")}`;
      qtdLocacoesSpan.textContent = resumo.quantidadeLocacoesGeral.toString();
      qtdDiasSpan.textContent = resumo.quantidadeDias.toString();
    }

    if (!dados || dados.length === 0) {
      this.exibirMensagemErro(
        "Nenhum dado encontrado para o período selecionado."
      );
      return;
    }
    output?.classList.add("d-none");
    const labels = dados.map((d) => formatarData(d.data));
    const valores = dados.map((d) => d.valorTotalPago);
    Chart.register(...registerables);
    if (this.grafico instanceof Chart) {
      this.grafico.destroy();
    }

    this.grafico = new Chart(canvas as ChartItem, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Valor pago na devolução (R$)",
            data: valores,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Valor pago (R$)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Data da locação",
            },
          },
        },
      },
    });
  }

  obterDadosAvarias(): DadosAvariaVisao | null {
    const descricao = (
      document.getElementById("descricao-avaria") as HTMLTextAreaElement
    )?.value.trim();
    const valorPago = parseFloat(
      (document.getElementById("valor-avaria") as HTMLInputElement)?.value
    );

    const fotoInput = document.getElementById(
      "foto-avaria"
    ) as HTMLInputElement;
    const foto = fotoInput?.files?.[0] ?? null;

    console.log(
      "Dados Avaria:",
      this.idItemAvaria,
      descricao,
      valorPago,
      foto,
      !foto
    );

    if (!foto) {
      return null;
    }

    return {
      equipamento: this.idItemAvaria,
      avaliadorId: 0,
      descricao,
      locacaoId: this.devolucaoData?.locacao.codigo,
      valorCobrar: valorPago,
      foto,
    };
  }

  obterDadosDevolucao() {
    const totalEl = document.getElementById("valor-total");
    const texto = totalEl?.textContent?.trim() ?? "0";
    const valorNumerico = parseFloat(
      texto.replace("R$", "").replace(/\./g, "").replace(",", ".")
    );

    return {
      ...this.devolucaoData,
      valorPago: valorNumerico,
      registradoPor: this.controladoraFuncionario.obterFuncionarioLogado(),
    } as DevolucaoComFuncionario;
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

    const isAtendente =
      this.controladoraFuncionario.obterFuncionarioLogado()?.cargo ===
      "Atendente";

    const tr = document.createElement("tr");
    tr.setAttribute("equip-codigo", equipamento.codigo.toString());
    tr.appendChild(
      this.criarCelula(`${equipamento.codigo} - ${equipamento.descricao}`)
    );
    tr.appendChild(
      this.criarCelula(formatarValorComSimbolo(equipamento.valorHora))
    );
    const tdValorTotal = this.criarCelula(formatarValorComSimbolo(valorTotal));
    tr.appendChild(tdValorTotal);

    const tdDesconto = this.criarCelula(formatarValorComSimbolo(desconto));
    if (temDesconto) tdDesconto.className = "text-success";
    tr.appendChild(tdDesconto);

    const tdAva = document.createElement("td");
    const tdLimp = document.createElement("td");
    const textLimp = document.createElement("span");
    textLimp.textContent = " + 10%";
    tdLimp.appendChild(this.checkLimpeza(valorTotal, tdValorTotal));
    tdLimp.appendChild(textLimp);
    tr.appendChild(tdLimp);

    if (!isAtendente) {
      const btnAvaria = this.criarBotaoAvaria(
        equipamento.codigo,
        equipamento.valorHora * horas
      );
      tdAva.appendChild(btnAvaria);
      tr.appendChild(tdAva);
    }
    return tr;
  }

  private criarCelula(texto: string): HTMLTableCellElement {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
  }

  private checkLimpeza(
    valorOriginal: number,
    celulaValor: HTMLTableCellElement
  ): HTMLInputElement {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input";

    checkbox.addEventListener("change", () => {
      const novoValor = checkbox.checked ? valorOriginal * 1.1 : valorOriginal;
      celulaValor.textContent = formatarValorComSimbolo(novoValor);

      const subtotalEl = document.getElementById("subtotal-itens");
      if (subtotalEl) {
        const texto = subtotalEl.textContent?.trim() ?? "0";
        const valorNumerico = parseFloat(
          texto.replace("R$", "").replace(/\./g, "").replace(",", ".")
        );
        const novoTotal = checkbox.checked
          ? novoValor - valorOriginal + valorNumerico
          : valorNumerico - valorOriginal * 0.1;

        subtotalEl.textContent = novoTotal.toFixed(2).replace(".", ",");
      }

      const totalEl = document.getElementById("valor-total");
      if (totalEl) {
        const texto = totalEl.textContent?.trim() ?? "0";
        const valorNumerico = parseFloat(
          texto.replace("R$", "").replace(/\./g, "").replace(",", ".")
        );
        const novoTotal = checkbox.checked
          ? novoValor - valorOriginal + valorNumerico
          : valorNumerico - valorOriginal * 0.1;
        totalEl.textContent = novoTotal.toFixed(2).replace(".", ",");
      }
    });
    return checkbox;
  }

  public fecharModalAvaria(): void {
    const modalElement = document.getElementById("modalAvarias");
    if (modalElement) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }

  private criarBotaoAvaria(codigo: number, valor: number): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-danger";
    btn.textContent = "Adicionar Avaria";
    btn.setAttribute("data-bs-toggle", "modal");
    btn.setAttribute("data-bs-target", "#modalAvarias");
    btn.setAttribute("data-codigo-item", codigo.toString());

    btn.addEventListener("click", () => {
      this.idItemAvaria = { codigo, valorOriginal: valor };
      const inputDescricao = document.getElementById(
        "input-avarias"
      ) as HTMLTextAreaElement;
      const inputImagem = document.getElementById(
        "add-image"
      ) as HTMLInputElement;

      if (inputDescricao) inputDescricao.value = "";
      if (inputImagem) inputImagem.value = "";
    });
    return btn;
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
