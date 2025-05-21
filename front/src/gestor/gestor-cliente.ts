import { ErroDominio } from "../infra/ErroDominio";
import type { Cliente } from "../types/types";

// pra tirar o erro do import.meta.env
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
      [key: string]: string | undefined;
    }
  }
}

export class GestorCliente {
 private readonly urlApi: string = import.meta.env.VITE_API_URL ?? "";

  async obterClientes(id: number): Promise<Cliente> {
    const options: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/clientes/${id}`, options);

    if (!response.ok) {
      throw ErroDominio.comProblemas([
        `Erro ao buscar cliente. Status: ${response.status}`,
      ]);
    }

    const data = await response.json();
    return data;
  }
}
