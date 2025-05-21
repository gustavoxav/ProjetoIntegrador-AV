import type { Cliente } from "../types/types.js";
import { ControladoraCliente } from "../controladora/controladora-cliente.js";
import type { VisaoCliente } from "./visao-clientes.js";

export class VisaoClienteEmHTML implements VisaoCliente {
  private controladora: ControladoraCliente;
  private clienteSelecionado: Cliente | null = null;

  constructor() {
    this.controladora = new ControladoraCliente(this);
    document
      .getElementById("btn-buscar-clientes")
      ?.addEventListener("click", () => this.controladora.buscarClientes());
    
    const clienteInput = document.getElementById("cliente") as HTMLInputElement;
    clienteInput?.addEventListener("input", () => {
      const filtro = clienteInput.value.trim();
      if (filtro.length === 11 || (Number.isFinite(Number(filtro)) && Number(filtro) > 0)) {
        this.controladora.buscarClientes();
      }
    });
  }

  filtroClientes(): { filtro: string } {
    const valor = (document.getElementById("cliente") as HTMLInputElement)
      .value;
    return { filtro: valor };
  }

  retornarClientes(cliente: Cliente): void {
    console.log("aq1: ", cliente);
    this.selecionarCliente(cliente);
    
    const clienteInput = document.getElementById("cliente") as HTMLInputElement;
    if (clienteInput) {
      clienteInput.value = cliente.codigo.toString();
    }
  }

  selecionarCliente(cliente: Cliente): void {
    this.clienteSelecionado = cliente;
    
    const ul = document.getElementById("mostrar-clientes");
    if (ul) {
      ul.innerHTML = "";
      const li = document.createElement("li");
      li.className = "list-group-item d-flex align-items-center gap-3";

      const avatar = document.createElement("img");
      avatar.src = cliente.foto;
      avatar.alt = "Foto de Avatar";
      avatar.width = 150;
      avatar.height = 150;
      avatar.style.borderRadius = "20%";
      avatar.style.objectFit = "cover";

      const textoContainer = document.createElement("div");

      const nome = document.createElement("div");
      nome.textContent = cliente.nomeCompleto;
      nome.className = "fw-bold";
      const cpf = document.createElement("div");
      cpf.textContent = `CPF: ${cliente.cpf}`;
      cpf.className = "fw-bold";

      textoContainer.appendChild(nome);
      textoContainer.appendChild(cpf);
      
      li.appendChild(avatar);
      li.appendChild(textoContainer);
      ul.appendChild(li);
      ul.style.display = "block";
    }
  }

  getClienteSelecionado(): Cliente | null {
    return this.clienteSelecionado;
  }

  exibirMensagens(mensagens: string[]) {
    const outputElement = document.querySelector("output");
    if (outputElement) {
      outputElement.innerText = mensagens.join("\n");
    }
  }
}
