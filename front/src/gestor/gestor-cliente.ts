import { ErroDominio } from "../infra/ErroDominio";

export class GestorCliente {
 private readonly urlApi: string = import.meta.env.VITE_API_URL ?? "";

  async obterClientes(id: number): Promise<any> {
    const options: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/clientesFiltro/${id}`, options);

    if (!response.ok) {
      throw ErroDominio.comProblemas([
        "Erro ao buscar Clientes. Status: " + response.status,
      ]);
    }

    const data = await response.json();
    return data;
  }
}
