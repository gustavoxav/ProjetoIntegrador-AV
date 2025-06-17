import { ErroDominio } from "../infra/ErroDominio";
import { DadosResgitroAvaria } from "../types/types";
import type { Equipamento } from "./Equipamento";

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

  async registrarAvaria(dadosEquipamento: DadosResgitroAvaria): Promise<any> {
    if (!dadosEquipamento.codigo) {
      throw ErroDominio.comProblemas(["Equipamento não informado"]);
    }

    if (!dadosEquipamento.descricao) {
      throw ErroDominio.comProblemas(["Descrição não informada"]);
    }

    const reqBody = JSON.stringify({
      descricao: dadosEquipamento.descricao,
    });
    try {
      const response = await fetch(
        `${this.urlApi}/registrarAvaria${dadosEquipamento.codigo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: reqBody,
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Erro na resposta da API:", response);
        const errorData = await response
          .json()
          .catch(() => ({ erro: "Erro no servidor" }));
        throw ErroDominio.comProblemas([
          errorData.erro ?? `Erro ao registrar avaria: (${response.status})`,
        ]);
      }
    } catch (error) {
      if (error instanceof ErroDominio) {
        throw error;
      }
      throw ErroDominio.comProblemas([
        error instanceof Error
          ? error.message
          : "Erro ao conectar com o servidor",
      ]);
    }
  }
}
