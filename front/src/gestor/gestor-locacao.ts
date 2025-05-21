import { ErroDominio } from "../infra/ErroDominio.js";
import type { DadosLocacao, RespostaLocacao } from "../types/types.js";

export class GestorLocacao {
  private readonly urlApi: string = import.meta.env.VITE_API_URL || "";

  async registrarLocacao(dadosLocacao: DadosLocacao): Promise<any> {
    if (!dadosLocacao.cliente?.codigo) {
      throw ErroDominio.comProblemas(["Cliente não informado"]);
    }

    if (!dadosLocacao.registradoPor?.codigo) {
      throw ErroDominio.comProblemas(["Funcionário não informado"]);
    }

    if (!dadosLocacao.horasContratadas || dadosLocacao.horasContratadas <= 0) {
      throw ErroDominio.comProblemas(["Horas contratadas inválidas"]);
    }

    if (!Array.isArray(dadosLocacao.itens) || dadosLocacao.itens.length === 0) {
      console.error("Erro: itens inválidos ou vazios:", dadosLocacao.itens);
      throw ErroDominio.comProblemas(["Nenhum equipamento selecionado"]);
    }

    const todosValidos = dadosLocacao.itens.every(
      (item) =>
        item.equipamento &&
        typeof item.equipamento.codigo === "number" &&
        item.equipamento.codigo > 0
    );

    if (!todosValidos) {
      console.error(
        "Alguns equipamentos são inválidos:",
        dadosLocacao.itens.map((i) => i.equipamento?.codigo || "sem código")
      );
      throw ErroDominio.comProblemas(["Há equipamentos inválidos na seleção"]);
    }

    // console.log(
    //   "Equipamentos a enviar:",
    //   dadosLocacao.itens.map(
    //     (i) => `${i.equipamento.descricao} (${i.equipamento.codigo})`
    //   )
    // );

    const reqBody = JSON.stringify(dadosLocacao);
    // console.log("Enviando dados para API:", reqBody);

    try {
      const response = await fetch(`${this.urlApi}/locacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: reqBody,
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Erro na resposta da API:", response);
        const errorData = await response
          .json()
          .catch(() => ({ erro: "Erro no servidor" }));
        throw ErroDominio.comProblemas([
          errorData.erro ?? `Erro ao registrar locação (${response.status})`,
        ]);
      }

      const data = await response.json();
      return data;
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

  async obterLocacoes(filtro?: number): Promise<RespostaLocacao[]> {
    try {
      const filtroLocacao = filtro ? `/${filtro}` : "";
      // console.log("Filtro de locação:", filtroLocacao);
      const response = await fetch(`${this.urlApi}/locacoes${filtroLocacao}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // console.log("Resposta bruta da API:", response);

      if (!response.ok) {
        throw new Error(`Erro ao buscar locações (${response.status})`);
      }

      const data = await response.json();
      // console.log("Resposta parseada da API:", data);

      return data;
    } catch (error) {
      throw ErroDominio.comProblemas([
        error instanceof Error ? error.message : "Erro ao buscar locações",
      ]);
    }
  }
}
