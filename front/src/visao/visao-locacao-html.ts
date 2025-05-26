import type { VisaoLocacao } from "./visao-locacao.js";
import type { RespostaLocacao } from "../types/types.js";
import { formatarDataHora } from "../infra/utils.js";

export class VisaoLocacaoEmHTML implements VisaoLocacao {

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
      <td class="text-start align-middle">${locacao.horasContratadas} ${locacao.horasContratadas === 1 ? 'hora' : 'horas'}</td>
      <td class="text-start align-middle">${formatarDataHora(
        locacao.dataHoraEntregaPrevista
      )}</td>
      <td class="text-start align-middle">${locacao.cliente.nomeCompleto}</td>
      <td class="text-start align-middle">${locacao.cliente.telefone}</td>
      <td class="text-start align-middle">
        ${acaoColuna}
      </td>
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
