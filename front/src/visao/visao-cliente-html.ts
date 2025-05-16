import { Cliente } from "../types/types.js";
import { ControladoraCliente } from "../controladora/controladora-cliente.js";
import { VisaoCliente } from "./visao-clientes.js";

export class VisaoClienteEmHTML implements VisaoCliente {
  private controladora: ControladoraCliente;

  constructor() {
    this.controladora = new ControladoraCliente(this);
    document
      .getElementById("btn-buscar-clientes")!
      .addEventListener("click", () => this.controladora.buscarClientes());
  }

  filtroClientes(): { filtro: string } {
    const valor = (document.getElementById("cliente") as HTMLInputElement)
      .value;
    return { filtro: valor };
  }

  retornarClientes(cliente: Cliente): void {
    console.log("aq: 1", cliente);
    const ul = document.getElementById("mostrar-clientes")!;
    ul.innerHTML = "";
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-3";

    const avatar = document.createElement("img");
    avatar.src = cliente.foto;
    avatar.alt = `Foto de Avatar`;
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
  }

  exibirMensagens(mensagens: string[]) {
    document.querySelector("output")!.innerText = mensagens.join("\n");
  }
}
