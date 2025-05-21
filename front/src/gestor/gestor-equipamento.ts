import { ErroDominio } from "../infra/ErroDominio";
import type { Equipamento } from "../models/Equipamento";

export class GestorEquipamento {
 private readonly urlApi: string = import.meta.env.VITE_API_URL ?? "";

  async obterEquipamento(id: number): Promise<Equipamento> {
    const options: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/equipamentos/${id}`, options);

    if (!response.ok) {
      throw ErroDominio.comProblemas([
        `Erro ao buscar Equipamento. Status: ${response.status}`,
      ]);
    }

    const data = await response.json();
    return data;
  }

  async obterTodosEquipamentos(): Promise<Equipamento[]> {
    const options: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/equipamentos`, options);

    if (!response.ok) {
      throw ErroDominio.comProblemas([
        `Erro ao buscar Equipamentos. Status: ${response.status}`,
      ]);
    }

    const data = await response.json();
    return data;
  }
}
