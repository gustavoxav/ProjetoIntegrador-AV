import { Equipamento } from "../types/types.js";
import { ControladoraEquipamento } from "../controladora/controladora-equipamento.js";
import { VisaoEquipamento } from "./visao-equipamento.js";

export class VisaoEquipamentoEmHTML implements VisaoEquipamento {
  private controladora: ControladoraEquipamento;
  private equipamentosSelecionados: Equipamento[] = [];

  constructor() {
    this.controladora = new ControladoraEquipamento(this);
    document
      .getElementById("btn-buscar-equipamento")
      ?.addEventListener("click", () => this.controladora.buscarEquipamento());
  }

  filtroEquipamento(): { filtro: string } {
    const valor = (document.getElementById("equipamento") as HTMLInputElement)
      .value;
    console.log("equipamento", { filtro: valor });
    return { filtro: valor };
  }

  retornarEquipamento(equipamento: Equipamento): void {
    const ul = document.getElementById("mostrar-equipamento");
    if (!ul) return;
    
    ul.innerHTML = "";
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-3";

    const textoContainer = document.createElement("div");

    const descricao = document.createElement("div");
    descricao.textContent = equipamento.descricao;
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
        eq => eq.codigo === equipamento.codigo
      );
      
      if (itemJaSelecionado) {
        btnAdicionar.disabled = true;
        btnAdicionar.className = "btn btn-success";
        btnAdicionar.textContent = "Adicionado";
      } else {
        btnAdicionar.addEventListener("click", () => this.adicionarEquipamento(equipamento));
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
      eq => eq.codigo === equipamento.codigo
    );
    
    if (itemJaSelecionado) return;
    
    this.equipamentosSelecionados.push(equipamento);
    
    const btnAdicionar = document.querySelector("#mostrar-equipamento button");
    if (btnAdicionar) {
      btnAdicionar.textContent = "Adicionado";
      btnAdicionar.className = "btn btn-success";
      (btnAdicionar as HTMLButtonElement).disabled = true;
    }
    
    this.atualizarListaEquipamentosSelecionados();
  }
  
  removerEquipamento(codigo: number): void {
    this.equipamentosSelecionados = this.equipamentosSelecionados.filter(
      eq => eq.codigo !== codigo
    );
    
    this.atualizarListaEquipamentosSelecionados();
    
    const equipamentoAtual = document.querySelector("#mostrar-equipamento");
    if (equipamentoAtual) {
      this.controladora.buscarEquipamento();
    }
  }
  
  atualizarListaEquipamentosSelecionados(): void {
    const listaEquipamentos = document.getElementById("equipamentos-selecionados-lista");
    if (!listaEquipamentos) return;
    
    listaEquipamentos.innerHTML = "";
    
    if (this.equipamentosSelecionados.length === 0) {
      const mensagem = document.createElement("li");
      mensagem.className = "list-group-item text-muted";
      mensagem.textContent = "Nenhum equipamento selecionado";
      listaEquipamentos.appendChild(mensagem);
      return;
    }
    
    for (const equipamento of this.equipamentosSelecionados) {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between align-items-center";
      
      const textoContainer = document.createElement("div");
      textoContainer.textContent = `${equipamento.descricao} - R$ ${equipamento.valorHora}/h`;
      
      const btnRemover = document.createElement("button");
      btnRemover.className = "btn btn-sm btn-danger";
      btnRemover.textContent = "Remover";
      btnRemover.addEventListener("click", () => this.removerEquipamento(equipamento.codigo));
      
      item.appendChild(textoContainer);
      item.appendChild(btnRemover);
      listaEquipamentos.appendChild(item);
    }
  }
  
  getEquipamentosSelecionados(): Equipamento[] {
    return this.equipamentosSelecionados;
  }

  exibirMensagens(mensagens: string[]) {
    const outputElement = document.querySelector("output");
    if (outputElement) {
      outputElement.innerText = mensagens.join("\n");
    }
  }
}
