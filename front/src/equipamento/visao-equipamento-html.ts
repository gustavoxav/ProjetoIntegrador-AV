import type {
  Equipamento,
  RespostaRelatorioEquipamento,
} from "../types/types.js";
import { ControladoraEquipamento } from "./controladora-equipamento.js";
import type { VisaoEquipamento } from "./visao-equipamento.js";
import { bordas, cores, formatarDataHora } from "../infra/utils.js";
import {
  calcularValores,
  calcularValorIndividual,
  formatarValorComSimbolo,
} from "../infra/calculadora-valores.js";
import { Chart, ChartItem, registerables } from "chart.js";

export class VisaoEquipamentoEmHTML implements VisaoEquipamento {
  private readonly controladora: ControladoraEquipamento;
  private equipamentosSelecionados: Equipamento[] = [];
  private todosEquipamentos: Equipamento[] = [];
  private grafico: Chart | null = null;

  constructor() {
    this.controladora = new ControladoraEquipamento(this);
    document
      .getElementById("btn-buscar-equipamento")
      ?.addEventListener("click", () => this.controladora.buscarEquipamento());

    const equipamentoInput = document.getElementById(
      "equipamento"
    ) as HTMLInputElement;
    equipamentoInput?.addEventListener("click", () => {
      if (this.todosEquipamentos.length === 0) {
        this.controladora.buscarTodosEquipamentos();
      } else {
        this.displayEquipamentoDropdown(this.todosEquipamentos);
      }
    });

    equipamentoInput?.addEventListener("input", () => {
      const filtro = equipamentoInput.value.trim();
      if (filtro === "") {
        this.displayEquipamentoDropdown(this.todosEquipamentos);
      } else if (this.todosEquipamentos.length > 0) {
        const filtrado = this.todosEquipamentos.filter(
          (eq) =>
            eq.codigo.toString().includes(filtro) ||
            eq.descricao.toLowerCase().includes(filtro.toLowerCase())
        );
        this.displayEquipamentoDropdown(filtrado);
      }
    });

    document.getElementById("hora")?.addEventListener("change", () => {
      this.atualizarSubtotal();
      this.atualizarDatas();
    });

    document.getElementById("hora")?.addEventListener("input", () => {
      this.atualizarSubtotal();
      this.atualizarDatas();
    });

    document.getElementById("cancelar")?.addEventListener("click", () => {
      window.history.back();
    });

    this.atualizarDatas();
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

      await this.controladora?.buscarDadosRelatorio(dataInicio, dataFim);
    });

    btnBuscar.click();
  }

  public exibirRelatorio(retorno: RespostaRelatorioEquipamento) {
    const { ranking, grafico, resumo } = retorno.relatorio;
    const canvas = document.getElementById("grafico-itens-alugados");
    const totalGeralSpan = document.getElementById("resumo-total-geral");
    const qtdItens = document.getElementById("resumo-qtd-itens");
    const qtdTop10 = document.getElementById("resumo-qtd-top10");
    const qtdOutros = document.getElementById("resumo-qtd-outros");
    const output = document.querySelector("output");

    if (qtdItens && totalGeralSpan && qtdTop10 && qtdOutros) {
      totalGeralSpan.textContent = resumo.totalLocacoesPeriodo.toString();
      qtdItens.textContent = resumo.totalItensUnicos.toString();
      qtdTop10.textContent = resumo.quantidadeTop10.toString();
      qtdOutros.textContent = resumo.quantidadeOutros.toString();
    }

    if (!grafico || grafico.length === 0) {
      this.exibirMensagemErro(
        "Nenhum dado encontrado para o período selecionado."
      );
      return;
    }
    output?.classList.add("d-none");
    const labels = grafico.map((d) => d.label);
    const valores = grafico.map((d) => d.valor);
    const coresUsadas = cores.slice(0, valores.length);
    const bordasUsadas = bordas.slice(0, valores.length);

    Chart.register(...registerables);
    if (this.grafico instanceof Chart) {
      this.grafico.destroy();
    }

    this.grafico = new Chart(canvas as ChartItem, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Qtd. locações",
            data: valores,
            backgroundColor: coresUsadas,
            borderColor: bordasUsadas,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label} - Qtd. locações: ${value} (${percentage}%)`;
              }
            }
          },
          legend: {
            position: 'bottom' as const,
            align: 'center' as const,
            labels: {
              padding: 5,
            }
          },
        }
      },
    });

    const tbody = document.getElementById("tabela-itens-selecionados");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (!ranking || ranking.length === 0) {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td colspan="6" class="text-center">Nenhum item encontrada.</td>
    `;
      tbody.appendChild(linha);
      return;
    }

    for (const eq of ranking) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td class="text-start align-middle">${eq.posicao}</td>
      <td class="text-start align-middle">${eq.equipamentoId}</td>
      <td class="text-start align-middle">${eq.descricao}</td>
      <td class="text-start align-middle">${eq.modelo}</td>
      <td class="text-start align-middle">${eq.quantidadeLocacoes}</td>
      <td class="text-start align-middle">${eq.percentual}</td>
    `;

      tbody.appendChild(row);
    }
  }

  registrarAvaria(equipamento: Equipamento): void {
    // this.controladora.registrarAvaria(equipamento);
  }

  retornarDadosAvaria(): {
    codigo: number;
    descricao: string;
  } {
    const codigoInput = document.getElementById(
      "codigo-equipamento"
    ) as HTMLInputElement;
    const descricaoInput = document.getElementById(
      "descricao-avaria"
    ) as HTMLInputElement;

    return {
      codigo: Number(codigoInput.value),
      descricao: descricaoInput.value.trim(),
    };
  }

  exibirEquipamentosDevolucao(equipamento: Equipamento[], horas: number): void {
    this.equipamentosSelecionados = equipamento;
    this.atualizarSubtotal(equipamento, horas, true);
  }

  filtroEquipamento(): { filtro: string } {
    const valor = (document.getElementById("equipamento") as HTMLInputElement)
      .value;
    return { filtro: valor };
  }

  retornarTodosEquipamentos(equipamentos: Equipamento[]): void {
    this.todosEquipamentos = equipamentos;
    this.displayEquipamentoDropdown(equipamentos);
  }

  private displayEquipamentoDropdown(equipamentos: Equipamento[]): void {
    const ul = document.getElementById("mostrar-equipamento");
    if (!ul) return;

    ul.innerHTML = "";
    ul.style.display = "block";
    ul.style.maxHeight = "300px";
    ul.style.overflowY = "auto";

    if (equipamentos.length === 0) {
      const li = document.createElement("li");
      li.className = "list-group-item text-muted";
      li.textContent = "Nenhum equipamento encontrado";
      ul.appendChild(li);
      return;
    }

    for (const equipamento of equipamentos) {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex align-items-center gap-3";
      li.style.cursor = "pointer";

      const textoContainer = document.createElement("div");
      textoContainer.className = "flex-grow-1";

      const titulo = document.createElement("div");
      titulo.textContent = `${equipamento.codigo} - ${equipamento.descricao}`;
      titulo.className = "fw-bold";

      const infoSecundaria = document.createElement("div");
      infoSecundaria.className = "small";
      infoSecundaria.innerHTML = `R$ ${equipamento.valorHora}/h • 
        <span class="${
          equipamento.disponivel ? "text-success" : "text-danger"
        }">
          ${equipamento.disponivel ? "Disponível" : "Indisponível"}
        </span>`;

      const avariasInfo = document.createElement("div");
      avariasInfo.className = "small text-muted";
      avariasInfo.textContent = `Avarias: ${
        equipamento.avarias ? equipamento.avarias : "Sem avarias"
      }`;

      textoContainer.appendChild(titulo);
      textoContainer.appendChild(infoSecundaria);
      textoContainer.appendChild(avariasInfo);

      const btnContainer = document.createElement("div");

      const btnAdicionar = document.createElement("button");
      btnAdicionar.className = "btn btn-sm btn-primary";
      btnAdicionar.textContent = "Adicionar";

      if (!equipamento.disponivel) {
        btnAdicionar.disabled = true;
        btnAdicionar.className = "btn btn-sm btn-secondary";
        btnAdicionar.title = "Equipamento indisponível";
      } else {
        const itemJaSelecionado = this.equipamentosSelecionados.some(
          (eq) => eq.codigo === equipamento.codigo
        );

        if (itemJaSelecionado) {
          btnAdicionar.disabled = true;
          btnAdicionar.className = "btn btn-sm btn-success";
          btnAdicionar.textContent = "Adicionado";
        } else {
          btnAdicionar.addEventListener("click", (e) => {
            e.stopPropagation();
            this.adicionarEquipamento(equipamento);
          });
        }
      }

      btnContainer.appendChild(btnAdicionar);

      li.appendChild(textoContainer);
      li.appendChild(btnContainer);

      li.addEventListener("click", () => {
        (document.getElementById("equipamento") as HTMLInputElement).value =
          equipamento.codigo.toString();
        this.retornarEquipamento(equipamento);
      });

      ul.appendChild(li);
    }

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement;
        const equipamentoInput = document.getElementById("equipamento");
        const mostrarEquipamento = document.getElementById(
          "mostrar-equipamento"
        );

        if (
          target !== equipamentoInput &&
          !mostrarEquipamento?.contains(target) &&
          target.id !== "btn-buscar-equipamento"
        ) {
          if (mostrarEquipamento) {
            mostrarEquipamento.style.display = "none";
          }
        }
      },
      { capture: true }
    );
  }

  retornarEquipamento(equipamento: Equipamento): void {
    const ul = document.getElementById("mostrar-equipamento");
    if (!ul) return;

    ul.innerHTML = "";
    ul.style.display = "block";

    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-3";

    const textoContainer = document.createElement("div");

    const descricao = document.createElement("div");
    descricao.textContent = equipamento.descricao;
    const avarias = document.createElement("div");
    avarias.textContent = `Avarias: ${
      equipamento.avarias ? equipamento.avarias : "Sem avarias"
    }`;
    const valorHora = document.createElement("div");
    valorHora.textContent = `Valor por hora: R$ ${equipamento.valorHora}`;
    const disponibilidade = document.createElement("div");
    disponibilidade.textContent = `Status: ${
      equipamento.disponivel ? "Disponível" : "Indisponível"
    }`;
    disponibilidade.className = equipamento.disponivel
      ? "text-success"
      : "text-danger";

    textoContainer.appendChild(descricao);
    textoContainer.appendChild(avarias);
    textoContainer.appendChild(valorHora);
    textoContainer.appendChild(disponibilidade);

    const selecaoContainer = document.createElement("div");
    selecaoContainer.className = "ms-auto";

    const btnAdicionar = document.createElement("button");
    btnAdicionar.className = "btn btn-primary";
    btnAdicionar.textContent = "Adicionar";

    if (!equipamento.disponivel) {
      btnAdicionar.disabled = true;
      btnAdicionar.className = "btn btn-secondary";
      btnAdicionar.title = "Equipamento indisponível";
    } else {
      const itemJaSelecionado = this.equipamentosSelecionados.some(
        (eq) => eq.codigo === equipamento.codigo
      );

      if (itemJaSelecionado) {
        btnAdicionar.disabled = true;
        btnAdicionar.className = "btn btn-success";
        btnAdicionar.textContent = "Adicionado";
      } else {
        btnAdicionar.addEventListener("click", () =>
          this.adicionarEquipamento(equipamento)
        );
      }
    }

    selecaoContainer.appendChild(btnAdicionar);

    li.appendChild(textoContainer);
    li.appendChild(selecaoContainer);
    ul.appendChild(li);
  }

  adicionarEquipamento(equipamento: Equipamento): void {
    if (!equipamento.disponivel) return;

    const itemJaSelecionado = this.equipamentosSelecionados.some(
      (eq) => eq.codigo === equipamento.codigo
    );

    if (itemJaSelecionado) return;

    this.equipamentosSelecionados.push(equipamento);

    const btnAdicionar = document.querySelector("#mostrar-equipamento button");
    if (btnAdicionar) {
      btnAdicionar.textContent = "Adicionado";
      btnAdicionar.className = "btn btn-success";
      (btnAdicionar as HTMLButtonElement).disabled = true;
    }

    const ultimosEquipamentosExibidos = document.querySelectorAll(
      "#mostrar-equipamento li"
    );
    if (ultimosEquipamentosExibidos.length > 1) {
      this.displayEquipamentoDropdown(this.todosEquipamentos);
    }

    this.atualizarSubtotal();
  }

  removerEquipamento(codigo: number): void {
    this.equipamentosSelecionados = this.equipamentosSelecionados.filter(
      (eq) => eq.codigo !== codigo
    );

    this.atualizarSubtotal();

    const equipamentoAtual = document.querySelector(
      "#mostrar-equipamento"
    ) as HTMLElement;
    if (equipamentoAtual && equipamentoAtual.style.display !== "none") {
      const mostrarEquipamento = document.getElementById("mostrar-equipamento");
      if (mostrarEquipamento) {
        const singleItem = mostrarEquipamento.querySelector(
          `li[equip-codigo="${codigo}"]`
        );
        if (singleItem) {
          const btn = singleItem.querySelector("button");
          if (btn) {
            btn.textContent = "Adicionar";
            btn.className = "btn btn-primary";
            (btn as HTMLButtonElement).disabled = false;
          }
        }
      }
    }
  }

  private obterHorasLocacao(): number {
    const horaInput = document.getElementById("hora") as HTMLInputElement;
    if (!horaInput || !horaInput.value) return 2;

    return Number(horaInput.value);
  }

  atualizarSubtotal(
    equipamentos?: Equipamento[],
    horas?: number,
    somenteVisualizacao = false
  ): void {
    const horasLocacao = horas ?? this.obterHorasLocacao();
    const equipamentosToUse = equipamentos || this.equipamentosSelecionados;
    this.atualizarHorasNaTela(horasLocacao);
    if (!somenteVisualizacao) {
      this.atualizarValoresTotais(equipamentosToUse, horasLocacao);
    }
    this.atualizarTabelaEquipamentos(
      equipamentosToUse,
      horasLocacao,
      somenteVisualizacao
    );
  }

  private atualizarHorasNaTela(horas: number): void {
    const horasContratadasEl = document.getElementById("horas-contratadas");
    if (horasContratadasEl) horasContratadasEl.textContent = horas.toString();

    const horasTextoEl = document.getElementById("horas-texto");
    if (horasTextoEl) horasTextoEl.textContent = horas === 1 ? "hora" : "horas";
  }

  private atualizarValoresTotais(
    equipamentos: Equipamento[],
    horasLocacao: number
  ): void {
    const resultado = calcularValores(equipamentos, horasLocacao);

    const subtotalEl = document.getElementById("subtotal-itens");
    const descontoEl = document.getElementById("desconto");
    const totalEl = document.getElementById("valor-total");

    if (subtotalEl)
      subtotalEl.textContent = resultado.subtotal.toFixed(2).replace(".", ",");
    if (descontoEl)
      descontoEl.textContent = resultado.desconto.toFixed(2).replace(".", ",");
    if (totalEl)
      totalEl.textContent = resultado.valorTotal.toFixed(2).replace(".", ",");
  }

  private atualizarTabelaEquipamentos(
    equipamentos: Equipamento[],
    horas: number,
    somenteVisualizacao = false
  ): void {
    const tabelaEquipamentos = document.getElementById("tabela-equipamentos");
    if (!tabelaEquipamentos) return;

    this.atualizarCabecalhoTabela(somenteVisualizacao);
    if (equipamentos.length === 0) {
      tabelaEquipamentos.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">Nenhum equipamento selecionado</td>
      </tr>
    `;
      return;
    }

    tabelaEquipamentos.innerHTML = "";
    for (const equipamento of equipamentos) {
      const tr = this.criarLinhaEquipamento(
        equipamento,
        horas,
        somenteVisualizacao
      );
      tabelaEquipamentos.appendChild(tr);
    }
  }

  private criarLinhaEquipamento(
    equipamento: Equipamento,
    horas: number,
    somenteVisualizacao = false
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

    const tdAcoes = document.createElement("td");
    if (!somenteVisualizacao) {
      const btnRemover = this.criarBotaoRemover(equipamento.codigo);
      tdAcoes.appendChild(btnRemover);
    }
    tr.appendChild(tdAcoes);
    return tr;
  }

  private criarCelula(texto: string): HTMLTableCellElement {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
  }

  private criarBotaoRemover(codigo: number): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-danger";
    btn.textContent = "Remover";
    btn.addEventListener("click", () => this.removerEquipamento(codigo));
    return btn;
  }

  private atualizarCabecalhoTabela(somenteVisualizacao: boolean): void {
    const thAcoes = document.getElementById("acoes-coluna");
    if (thAcoes) {
      if (somenteVisualizacao) {
        thAcoes.remove();
      }
    }
  }

  atualizarDatas(): void {
    const agora = new Date();

    const agoraCalculo = new Date(agora);
    agoraCalculo.setSeconds(0, 0);

    const horasLocacao = this.obterHorasLocacao();

    const dataDevolucaoCalculo = new Date(
      agoraCalculo.getTime() + horasLocacao * 60 * 60 * 1000
    );

    const dataDevolucao = new Date(dataDevolucaoCalculo);
    dataDevolucao.setSeconds(agora.getSeconds(), agora.getMilliseconds());

    const dataLocacaoEl = document.getElementById("data-locacao");
    const dataDevolucaoEl = document.getElementById("data-devolucao");

    if (dataLocacaoEl)
      dataLocacaoEl.textContent = formatarDataHora(agora.toString());
    if (dataDevolucaoEl)
      dataDevolucaoEl.textContent = formatarDataHora(dataDevolucao.toString());
  }

  obterEquipamentosSelecionados(): Equipamento[] {
    return [...this.equipamentosSelecionados];
  }

  exibirMensagens(mensagens: string[]) {
    const outputElement = document.querySelector("output");
    if (outputElement) {
      outputElement.innerText = mensagens.join("\n");
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
