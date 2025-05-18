import { Equipamento } from "../types/types.js";
import { ControladoraEquipamento } from "../controladora/controladora-equipamento.js";
import { VisaoEquipamento } from "./visao-equipamento.js";

export class VisaoEquipamentoEmHTML implements VisaoEquipamento {
  private controladora: ControladoraEquipamento;

  constructor() {
    this.controladora = new ControladoraEquipamento(this);
    document
      .getElementById("btn-buscar-equipamento")!
      .addEventListener("click", () => this.controladora.buscarEquipamento());
  }

  filtroEquipamento(): { filtro: string } {
    const valor = (document.getElementById("equipamento") as HTMLInputElement)
      .value;
      console.log("equipamento", { filtro: valor });
    return { filtro: valor };
  }

  retornarEquipamento(equipamento: Equipamento): void {
    const ul = document.getElementById("mostrar-equipamento")!;
    ul.innerHTML = "";
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-3";

    const textoContainer = document.createElement("div");

    const descriao = document.createElement("div");
    descriao.textContent = equipamento.descricao;
    const avarias = document.createElement("div");
    avarias.textContent = `Avarias: ${equipamento.avarias}`;
    const valorHora = document.createElement("div");
    valorHora.textContent = `valor Hora: R$ ${equipamento.valorHora}`;
    const disponibilidade = document.createElement("div");
    disponibilidade.textContent = `Status: ${
      equipamento.disponivel ? "Disponível" : "Indisponível"
    }`;
    disponibilidade.className = equipamento.disponivel
      ? "text-success"
      : "text-danger";

    textoContainer.appendChild(descriao);
    textoContainer.appendChild(avarias);
    textoContainer.appendChild(valorHora);
    textoContainer.appendChild(disponibilidade);
    li.appendChild(textoContainer);
    ul.appendChild(li);
  }

  exibirMensagens(mensagens: string[]) {
    document.querySelector("output")!.innerText = mensagens.join("\n");
  }
}
