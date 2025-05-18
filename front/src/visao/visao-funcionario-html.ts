import type { Funcionario } from "../types/types.js";
import { ControladoraFuncionario } from "../controladora/controladora-funcionario.js";
import type { VisaoFuncionario } from "./visao-funcionario.js";

export class VisaoFuncionarioEmHTML implements VisaoFuncionario {
  private controladora: ControladoraFuncionario;

  constructor() {
    this.controladora = new ControladoraFuncionario(this);
  }

  filtroFuncionario(): { filtro: string } {
    const selectedRadio = document.querySelector('input[name="funcionario"]:checked') as HTMLInputElement;
    return { filtro: selectedRadio ? selectedRadio.value : '' };
  }

  retornarFuncionarios(funcionario: Funcionario): void {
    console.log("Funcionário encontrado:", funcionario);
  }

  mostrarTodosFuncionarios(funcionarios: Funcionario[]): void {
    console.log("Carregando todos os funcionários", funcionarios);
    const container = document.getElementById("funcionarios-container");
    
    if (!container) return;
    
    container.innerHTML = "";
    
    for (const funcionario of funcionarios) {
      const radioDiv = document.createElement("div");
      radioDiv.className = "form-check";
      
      const input = document.createElement("input");
      input.className = "form-check-input";
      input.type = "radio";
      input.name = "funcionario";
      input.id = `funcionario${funcionario.codigo}`;
      input.value = funcionario.codigo.toString();
      
      const label = document.createElement("label");
      label.className = "form-check-label";
      label.htmlFor = `funcionario${funcionario.codigo}`;
      label.textContent = `${funcionario.codigo} - ${funcionario.nome}`;
      
      radioDiv.appendChild(input);
      radioDiv.appendChild(label);
      container.appendChild(radioDiv);
    }
  }

  exibirMensagens(mensagens: string[]) {
    const output = document.querySelector("output");
    if (output) {
      output.innerText = mensagens.join("\n");
    }
  }
}
