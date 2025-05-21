import type { Funcionario } from "../types/types.js";
import { ControladoraFuncionario } from "../controladora/controladora-funcionario.js";
import type { VisaoFuncionario } from "./visao-funcionario.js";

export class VisaoFuncionarioEmHTML implements VisaoFuncionario {
  private controladora: ControladoraFuncionario;

  constructor() {
    this.controladora = new ControladoraFuncionario(this);
  }

  filtroFuncionario(): { filtro: string } {
    const selectElement = document.getElementById("funcionario") as HTMLSelectElement;
    return { filtro: selectElement ? selectElement.value : '' };
  }

  retornarFuncionarios(funcionario: Funcionario): void {
    console.log("Funcionário encontrado:", funcionario);
  }

  mostrarTodosFuncionarios(funcionarios: Funcionario[]): void {
    console.log("Carregando todos os funcionários", funcionarios);
    const container = document.getElementById("funcionarios-container");
    
    if (!container) return;
    
    container.innerHTML = "";
    
    const selectElement = document.createElement("select");
    selectElement.className = "form-select";
    selectElement.id = "funcionario";
    selectElement.name = "funcionario";
    
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecione um funcionário";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    
    for (const funcionario of funcionarios) {
      const option = document.createElement("option");
      option.value = funcionario.codigo.toString();
      option.text = `${funcionario.codigo} - ${funcionario.nome}`;
      selectElement.appendChild(option);
    }
    
    container.appendChild(selectElement);
  }

  exibirMensagens(mensagens: string[]) {
    const output = document.querySelector("output");
    if (output) {
      output.innerText = mensagens.join("\n");
    }
  }
}
