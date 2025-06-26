import type { VisaoLocacao } from "./visao-locacao.js";
import type { RespostaLocacao } from "../types/types.js";
import { formatarDataHora } from "../infra/utils.js";
import { ControladoraLocacao } from "./controladora-locacao.js";
import { VisaoClienteEmHTML } from "../cliente/visao-cliente-html.js";
import { VisaoEquipamentoEmHTML } from "../equipamento/visao-equipamento-html.js";
import { VisaoFuncionarioEmHTML } from "../funcionario/visao-funcionario-html.js";
import { ControladoraFuncionario } from "../funcionario/controladora-funcionario.js";

export class VisaoLocacaoEmHTML implements VisaoLocacao {
  private readonly controladoraFuncionario: ControladoraFuncionario =
    new ControladoraFuncionario(new VisaoFuncionarioEmHTML());

  public iniciarAdd(): void {
    const controladoraLocacao = new ControladoraLocacao(
      new VisaoLocacaoEmHTML(),
      new VisaoClienteEmHTML(),
      new VisaoFuncionarioEmHTML(),
      new VisaoEquipamentoEmHTML()
    );
    const output = document.querySelector("output");
    if (output) output.innerHTML = "";
    const form = document.querySelector("form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        return false;
      };
    }

    const salvarButton = document.getElementById("salvar");
    if (salvarButton) {
      const newButton = salvarButton.cloneNode(true);
      salvarButton.parentNode?.replaceChild(newButton, salvarButton);

      newButton.addEventListener("click", (e) => {
        e.preventDefault();
        controladoraLocacao?.registrarLocacao();
        return false;
      });
    }

    document.getElementById("equipamento")?.addEventListener("change", (e) => {
      const input = e.target as HTMLInputElement;
      if (input.value) {
        const equipamentoId = input.value;
        const tabela = document.getElementById("tabela-equipamentos");
        if (tabela) {
          tabela.setAttribute("data-ultimo-equipamento", equipamentoId);
        }
      }
    });
  }

  public iniciarList(): void {
    const controladoraLocacao = new ControladoraLocacao(this);
    controladoraLocacao.buscarLocacoes();

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
        window.history.pushState({}, "", "/locacao-add");
        window.dispatchEvent(
          new CustomEvent("routeChange", {
            detail: { path: "/locacao-add" },
          })
        );
      });
    }
  }

  obterDadosLocacao() {
    const horas =
      Number((document.getElementById("hora") as HTMLInputElement)?.value) || 0;
    return {
      horas,
      subtotal:
        document.getElementById("subtotal-itens")?.textContent ?? "0,00",
      desconto: document.getElementById("desconto")?.textContent ?? "0,00",
      valorTotal: document.getElementById("valor-total")?.textContent ?? "0,00",
      dataLocacao: document.getElementById("data-locacao")?.textContent ?? "-",
      dataDevolucao:
        document.getElementById("data-devolucao")?.textContent ?? "-",
      registradoPor: this.controladoraFuncionario.obterFuncionarioLogado(),
    };
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

      const isMecanico =
        this.controladoraFuncionario.obterFuncionarioLogado()?.cargo ===
        "Mecanico";

      const acaoColuna = locacao.devolvida
        ? `<span class="btn btn-sm btn-success" style="pointer-events: none; cursor: default; width: 92.63px">Devolvida</span>`
        : `<a 
            href="/devolucao-add?codigo=${locacao.codigo}" 
            class="btn btn-sm btn-outline-dark"
            data-route
            style="width: 92.63px"
          >
            Devolver
          </a>`;

      row.innerHTML = `
      <td class="text-start align-middle">${locacao.codigo}</td>
      <td class="text-start align-middle">${formatarDataHora(
        locacao.dataHoraLocacao
      )}</td>
      <td class="text-start align-middle">${locacao.horasContratadas} ${
        locacao.horasContratadas === 1 ? "hora" : "horas"
      }</td>
      <td class="text-start align-middle">${formatarDataHora(
        locacao.dataHoraEntregaPrevista
      )}</td>
      <td class="text-start align-middle">${locacao.cliente.nomeCompleto}</td>
      <td class="text-start align-middle">${locacao.cliente.telefone}</td>
      ${
        !isMecanico
          ? `<td class="text-start align-middle">${acaoColuna}</td>`
          : ""
      }
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
