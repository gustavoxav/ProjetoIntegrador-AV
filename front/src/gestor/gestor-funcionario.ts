import { ErroDominio } from "../infra/ErroDominio";
import type { Funcionario } from "../types/types.js";

export class GestorFuncionario {
 private readonly urlApi: string = import.meta.env.VITE_API_URL ?? "";

  // async obterFuncionarios(id: number): Promise<Funcionario> {
  //   const options: RequestInit = {
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     method: "GET",
  //     credentials: "include",
  //   };

  //   const response = await fetch(`${this.urlApi}/funcionariosFiltro/${id}`, options);

  //   if (!response.ok) {
  //     throw ErroDominio.comProblemas([
  //       `Erro ao buscar Funcionarios. Status: ${response.status}`,
  //     ]);
  //   }

  //   const data = await response.json();
  //   return data;
  // }

  async obterTodosFuncionarios(): Promise<Funcionario[]> {
    const options: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/funcionarios`, options);

    if (!response.ok) {
      throw ErroDominio.comProblemas([
        `Erro ao buscar Funcionarios. Status: ${response.status}`,
      ]);
    }

    const data = await response.json();
    return data;
  }
}
