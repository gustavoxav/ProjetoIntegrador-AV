import { ErroDominio } from "../infra/ErroDominio";

export class GestorEquipamento {
 private readonly urlApi: string = import.meta.env.VITE_API_URL ?? "";

  async obterEquipamento(id: number): Promise<any> {
    const options: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/equipamentoFiltro/${id}`, options);

    if (!response.ok) {
      throw ErroDominio.comProblemas([
        "Erro ao buscar Equipamento. Status: " + response.status,
      ]);
    }

    const data = await response.json();
    return data;
  }
}
