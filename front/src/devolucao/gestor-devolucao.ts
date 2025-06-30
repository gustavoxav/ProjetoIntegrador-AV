import { ErroDominio } from "../infra/ErroDominio.js";
import type {
  DadosAvaria,
  DadosDevolucao,
  RespostaDevolucao,
  RespostaRelatorioDevolucao,
  RespostaSimulacaoDevolucao,
} from "../types/types.js";

export class GestorDevolucao {
  private readonly urlApi: string = import.meta.env.VITE_API_URL || "";

  async registrarDevolucao(dadosDevolucao: DadosDevolucao): Promise<any> {
    if (!dadosDevolucao.registradoPor?.codigo) {
      throw ErroDominio.comProblemas(["Funcionário não informado"]);
    }

    if (!dadosDevolucao.locacaoId) {
      throw ErroDominio.comProblemas(["Locação não informada"]);
    }

    const reqBody = JSON.stringify(dadosDevolucao);

    try {
      const response = await fetch(`${this.urlApi}/devolucoes`, {
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
          errorData.erro ?? `Erro ao registrar Devolução (${response.status})`,
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

  async registrarAvaria(dadosAvaria: DadosAvaria): Promise<any> {
    const formData = new FormData();
    formData.append('avaliadorId', dadosAvaria.avaliadorId.toString());
    formData.append('descricao', dadosAvaria.descricao);
    formData.append('valorCobrar', dadosAvaria.valorCobrar.toString());
    formData.append('equipamentoId', dadosAvaria.equipamentoId.toString());
    if (dadosAvaria.locacaoId) {
      formData.append('locacaoId', dadosAvaria.locacaoId.toString());
    }
    formData.append('foto', dadosAvaria.foto);

    try {
      const response = await fetch(`${this.urlApi}/avarias`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Erro na resposta da API:", response);
        const errorData = await response
          .json()
          .catch(() => ({ erro: "Erro no servidor" }));
        throw ErroDominio.comProblemas([
          errorData.erro ?? `Erro ao registrar Avarias (${response.status})`,
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

  async obterDevolucoes(): Promise<RespostaDevolucao[]> {
    try {
      const response = await fetch(`${this.urlApi}/devolucoes`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar devoluções (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      throw ErroDominio.comProblemas([
        error instanceof Error ? error.message : "Erro ao buscar devoluções",
      ]);
    }
  }

  async obterSimulacaoDevolucoes(
    locacaoId: number
  ): Promise<RespostaSimulacaoDevolucao> {
    try {
      const response = await fetch(
        `${this.urlApi}/devolucoes/simulacao/${locacaoId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar simulação da decolução (${response.status})`
        );
      }

      return await response.json();
    } catch (error) {
      throw ErroDominio.comProblemas([
        error instanceof Error
          ? error.message
          : "Erro ao buscar simulação devoluções",
      ]);
    }
  }

  async relatorioDevolucao(
    dataInicial: string,
    dataFinal: string
  ): Promise<RespostaRelatorioDevolucao> {
    try {
      const response = await fetch(
        `${this.urlApi}/relatorios/locacoes-devolvidas?dataInicial=${dataInicial}&dataFinal=${dataFinal}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar relatório de devoluções (${response.status})`
        );
      }

      return await response.json();
    } catch (error) {
      throw ErroDominio.comProblemas([
        error instanceof Error
          ? error.message
          : "Erro ao buscar relatório de devoluções",
      ]);
    }
  }
}
