import { ErroDominio } from "../infra/ErroDominio";
import type { Funcionario } from "../types/types.js";

export class GestorFuncionario {
  private readonly urlApi: string = import.meta.env.VITE_API_URL ?? "";

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

  async loginFuncionario(cpf: string, senha: string): Promise<Funcionario> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ cpf, senha }),
    };

    const response = await fetch(`${this.urlApi}/login`, options);

    if (!response.ok) {
      let mensagem = `Erro ao realizar login. Status: ${response.status}`;
      try {
        const erro = await response.json();
        if (erro?.mensagem) mensagem = erro.mensagem;
      } catch (_) {}

      throw ErroDominio.comProblemas([mensagem]);
    }

    const funcionario = await response.json();
    return funcionario;
  }

  async obterFuncionarioLogado(): Promise<Funcionario> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/auth/me`, options);

    if (!response.ok) {
      let mensagem = `Erro ao buscar dados do usuário. Status: ${response.status}`;
      try {
        const erro = await response.json();
        if (erro?.erro) mensagem = erro.erro;
      } catch (_) {}

      throw ErroDominio.comProblemas([mensagem]);
    }

    const data = await response.json();
    console.log(data);
    return data.funcionario;
  }

  async logoutFuncionario(): Promise<void> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    const response = await fetch(`${this.urlApi}/logout`, options);

    if (!response.ok) {
      let mensagem = `Erro ao realizar logout. Status: ${response.status}`;
      try {
        const erro = await response.json();
        if (erro?.mensagem) mensagem = erro.mensagem;
      } catch (_) {}

      throw ErroDominio.comProblemas([mensagem]);
    }
  }
}
