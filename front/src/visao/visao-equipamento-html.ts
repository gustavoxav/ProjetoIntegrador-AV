import type { Equipamento } from "../types/types.js";
import { ControladoraEquipamento } from "../controladora/controladora-equipamento.js";
import type { VisaoEquipamento } from "./visao-equipamento.js";

export class VisaoEquipamentoEmHTML implements VisaoEquipamento {
  private controladora: ControladoraEquipamento;
  private equipamentosSelecionados: Equipamento[] = [];
  private todosEquipamentos: Equipamento[] = [];

  constructor() {
    this.controladora = new ControladoraEquipamento(this);
    document
      .getElementById("btn-buscar-equipamento")
      ?.addEventListener("click", () => this.controladora.buscarEquipamento());
    
    const equipamentoInput = document.getElementById("equipamento") as HTMLInputElement;
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
        const filtrado = this.todosEquipamentos.filter(eq => 
          eq.codigo.toString().includes(filtro) || 
          eq.descricao.toLowerCase().includes(filtro.toLowerCase())
        );
        this.displayEquipamentoDropdown(filtrado);
      }
    });
    
    document
      .getElementById("hora")
      ?.addEventListener("change", () => this.atualizarSubtotal());
    
    document
      .getElementById("cancelar")
      ?.addEventListener("click", () => {
        window.history.back();
      });
    
    this.atualizarDatas();
  }

  filtroEquipamento(): { filtro: string } {
    const valor = (document.getElementById("equipamento") as HTMLInputElement)
      .value;
    console.log("equipamento", { filtro: valor });
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
        <span class="${equipamento.disponivel ? 'text-success' : 'text-danger'}">
          ${equipamento.disponivel ? 'Disponível' : 'Indisponível'}
        </span>`;
      
      textoContainer.appendChild(titulo);
      textoContainer.appendChild(infoSecundaria);
      
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
          eq => eq.codigo === equipamento.codigo
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
    
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const equipamentoInput = document.getElementById("equipamento");
      const mostrarEquipamento = document.getElementById("mostrar-equipamento");
      
      if (target !== equipamentoInput && 
          !mostrarEquipamento?.contains(target) && 
          target.id !== "btn-buscar-equipamento") {
        if (mostrarEquipamento) {
          mostrarEquipamento.style.display = "none";
        }
      }
    }, { capture: true });
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
    
    const ultimosEquipamentosExibidos = document.querySelectorAll("#mostrar-equipamento li");
    if (ultimosEquipamentosExibidos.length > 1) {
      this.displayEquipamentoDropdown(this.todosEquipamentos);
    }
    
    this.atualizarListaEquipamentosSelecionados();
    this.atualizarSubtotal();
  }
  
  removerEquipamento(codigo: number): void {
    this.equipamentosSelecionados = this.equipamentosSelecionados.filter(
      eq => eq.codigo !== codigo
    );
    
    this.atualizarListaEquipamentosSelecionados();
    this.atualizarSubtotal();
    
    const equipamentoAtual = document.querySelector("#mostrar-equipamento");
    if (equipamentoAtual) {
      const mostrarEquipamento = document.getElementById("mostrar-equipamento");
      if (mostrarEquipamento && mostrarEquipamento.querySelectorAll("li").length > 1) {
        this.displayEquipamentoDropdown(this.todosEquipamentos);
      } else {
        this.controladora.buscarEquipamento();
      }
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
    
    const horasLocacao = this.obterHorasLocacao();
    const temDesconto = horasLocacao > 2;
    
    for (const equipamento of this.equipamentosSelecionados) {
      const subtotalItem = equipamento.valorHora * horasLocacao;
      const descontoItem = temDesconto ? subtotalItem * 0.1 : 0;
      const valorComDesconto = subtotalItem - descontoItem;
      
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between align-items-center";
      item.setAttribute('equip-codigo', equipamento.codigo.toString());
      
      const textoContainer = document.createElement("div");
      
      const infoEquipamento = document.createElement("div");
      infoEquipamento.textContent = `${equipamento.codigo} - ${equipamento.descricao} - R$ ${equipamento.valorHora}/h`;
      
      const subtotalInfo = document.createElement("div");
      subtotalInfo.className = "text-muted mt-1";
      
      if (temDesconto) {
        subtotalInfo.innerHTML = `<small>Subtotal (${horasLocacao.toFixed(2)}h): 
          <span style="text-decoration: line-through;">R$ ${subtotalItem.toFixed(2).replace('.', ',')}</span> 
          R$ ${valorComDesconto.toFixed(2).replace('.', ',')} (10% desconto)</small>`;
      } else {
        subtotalInfo.innerHTML = `<small>Subtotal (${horasLocacao.toFixed(2)}h): 
          R$ ${subtotalItem.toFixed(2).replace('.', ',')}</small>`;
      }
      
      textoContainer.appendChild(infoEquipamento);
      textoContainer.appendChild(subtotalInfo);
      
      const btnRemover = document.createElement("button");
      btnRemover.className = "btn btn-sm btn-danger";
      btnRemover.textContent = "Remover";
      btnRemover.addEventListener("click", () => this.removerEquipamento(equipamento.codigo));
      
      item.appendChild(textoContainer);
      item.appendChild(btnRemover);
      listaEquipamentos.appendChild(item);
    }
  }
  
  private obterHorasLocacao(): number {
    const horaInput = document.getElementById("hora") as HTMLInputElement;
    if (!horaInput || !horaInput.value) return 2;
    
    // const [horas, minutos] = horaInput.value.split(':').map(Number);
    // return horas + (minutos / 60);
    return Number(horaInput.value); // considera apenas a hora
  }
  
  atualizarSubtotal(): void {
    const horasLocacao = this.obterHorasLocacao();
    
    const horasContratadasEl = document.getElementById("horas-contratadas");
    if (horasContratadasEl) horasContratadasEl.textContent = horasLocacao.toString();
    
    const tabelaEquipamentos = document.getElementById("tabela-equipamentos");
    if (tabelaEquipamentos) {
      if (this.equipamentosSelecionados.length === 0) {
        tabelaEquipamentos.innerHTML = `
          <tr>
            <td colspan="3" class="text-center text-muted">Nenhum equipamento selecionado</td>
          </tr>
        `;
      } else {
        tabelaEquipamentos.innerHTML = "";
        
        for (const equipamento of this.equipamentosSelecionados) {
          const valorTotal = equipamento.valorHora * horasLocacao;
          
          const tr = document.createElement("tr");
          tr.setAttribute('equip-codigo', equipamento.codigo.toString());
          const tdEquipamento = document.createElement("td");
          tdEquipamento.textContent = `${equipamento.codigo} - ${equipamento.descricao}`;
          
          const tdValorHora = document.createElement("td");
          tdValorHora.textContent = `R$ ${equipamento.valorHora.toFixed(2).replace('.', ',')}`;
          
          const tdValorTotal = document.createElement("td");
          tdValorTotal.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
          
          tr.appendChild(tdEquipamento);
          tr.appendChild(tdValorHora);
          tr.appendChild(tdValorTotal);
          
          tabelaEquipamentos.appendChild(tr);
        }
      }
    }
    
    let subtotal = 0;
    for (const equipamento of this.equipamentosSelecionados) {
      subtotal += equipamento.valorHora * horasLocacao;
    }
    
    const temDesconto = horasLocacao > 2;
    const valorDesconto = temDesconto ? (subtotal * 0.1) : 0;
    const valorTotal = subtotal - valorDesconto;
    
    const subtotalEl = document.getElementById("subtotal-itens");
    const descontoEl = document.getElementById("desconto");
    const totalEl = document.getElementById("valor-total");
    
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',');
    if (descontoEl) descontoEl.textContent = valorDesconto.toFixed(2).replace('.', ',');
    if (totalEl) totalEl.textContent = valorTotal.toFixed(2).replace('.', ',');
    
    this.atualizarListaEquipamentosSelecionados();
    
    this.atualizarDatas();
  }
  
  atualizarDatas(): void {
    const agora = new Date();
    const horasLocacao = this.obterHorasLocacao();
    
    const dataDevolucao = new Date(agora.getTime() + (horasLocacao * 60 * 60 * 1000));
    
    const formatarData = (data: Date): string => {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(data);
    };
    
    const dataLocacaoEl = document.getElementById("data-locacao");
    const dataDevolucaoEl = document.getElementById("data-devolucao");
    
    if (dataLocacaoEl) dataLocacaoEl.textContent = formatarData(agora);
    if (dataDevolucaoEl) dataDevolucaoEl.textContent = formatarData(dataDevolucao);
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
}
