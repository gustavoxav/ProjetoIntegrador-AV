import type { VisaoLocacao } from "./visao-locacao.js";
import { ControladoraLocacao } from "../controladora/controladora-locacao.js";
import type { RespostaLocacao } from "../types/types.js";
import { formatarDataHora } from "../infra/utils.js";

export class VisaoLocacaoEmHTML implements VisaoLocacao {
  private readonly controladora: ControladoraLocacao;
  private isSubmitting = false;

  constructor() {
    this.controladora = new ControladoraLocacao(this);
    document
      .getElementById("btn-buscar-locacoes")
      ?.addEventListener("click", () => this.controladora.buscarLocacoes());
  }

  public async salvar(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      await this.controladora.registrarLocacao();
    } catch (error) {
      console.error("Erro ao registrar locação:", error);
    } finally {
      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
    }
  }

  obterDadosLocacao() {
    const funcionario =
      (document.getElementById("funcionario") as HTMLSelectElement)?.value ||
      "";
    const cliente =
      (document.getElementById("cliente") as HTMLInputElement)?.value || "";
    const horas =
      Number((document.getElementById("hora") as HTMLInputElement)?.value) || 0;

    const equipamentos = this.obterEquipamentos();
    console.log(`Equips selecionados: ${equipamentos.length}`, equipamentos);

    return {
      funcionario,
      cliente,
      horas,
      equipamentos,
      subtotal:
        document.getElementById("subtotal-itens")?.textContent ?? "0,00",
      desconto: document.getElementById("desconto")?.textContent ?? "0,00",
      valorTotal: document.getElementById("valor-total")?.textContent ?? "0,00",
      dataLocacao: document.getElementById("data-locacao")?.textContent ?? "-",
      dataDevolucao:
        document.getElementById("data-devolucao")?.textContent ?? "-",
    };
  }

  private obterEquipamentos(): Array<{
    codigo: number;
    descricao: string;
    valor: number;
  }> {
    type EquipamentoTemp = { codigo: number; descricao: string; valor: number };
    const equipamentos: EquipamentoTemp[] = [];

    console.log("Buscando equipamentos na tabela");

    const tabela = document.getElementById("tabela-equipamentos");
    console.log("Tabela de equipamentos encontrada?", !!tabela);

    if (tabela) {
      const linhas = tabela.querySelectorAll("tbody tr");
      console.log(
        `Encontradas ${linhas.length} linhas na tabela de equipamentos`
      );

      for (const linha of Array.from(linhas)) {
        if (linha.querySelector("th") || linha.querySelector("td[colspan]")) {
          continue;
        }

        try {
          const colunas = linha.querySelectorAll("td");
          if (colunas.length >= 2) {
            const descricao = colunas[0].textContent?.trim() ?? "";

            const valorTexto = colunas[1].textContent ?? "";
            const valorMatch = valorTexto.match(/R\$ ([\d.,]+)/);
            const valor = valorMatch
              ? Number(valorMatch[1].replace(",", "."))
              : 0;

            const codigo = Number(linha.getAttribute("equip-codigo")) || 0;

            console.log(
              `Processando linha: "${descricao}" -> código ${codigo}, valor ${valor}`
            );

            if (codigo > 0) {
              equipamentos.push({
                codigo,
                descricao,
                valor,
              });
              console.log(
                `Equipamento adicionado: ${descricao} (código ${codigo})`
              );
            }
          }
        } catch (err) {
          console.error("Erro ao processar linha:", err);
        }
      }
    }
    return equipamentos;
  }

  public exibirListagemLocacao(locacoes: RespostaLocacao[] | undefined): void {
    const tbody = document.getElementById("tabela-locacoes");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (!locacoes || locacoes.length === 0) {
      const linha = document.createElement("tr");
      linha.innerHTML = `
      <td colspan="7" class="text-center">Nenhuma locação encontrada.</td>
    `;
      tbody.appendChild(linha);
      return;
    }
    for (const locacao of locacoes) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td class="text-start align-middle">${locacao.codigo}</td>
      <td class="text-start align-middle">${formatarDataHora(
        locacao.dataHoraLocacao
      )}</td>
      <td class="text-start align-middle">${locacao.horasContratadas} horas</td>
      <td class="text-start align-middle">${formatarDataHora(
        locacao.dataHoraEntregaPrevista
      )}</td>
      <td class="text-start align-middle">${locacao.cliente.nomeCompleto}</td>
      <td class="text-start align-middle">${locacao.cliente.telefone}</td>
      <td class="text-start align-middle">
        <a 
          href="/devolucao-add?codigo=${locacao.codigo}" 
          class="btn btn-sm btn-outline-dark"
          data-route
        >
          Devolver
        </a>
      </td>
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
