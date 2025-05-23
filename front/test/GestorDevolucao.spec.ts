import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorDevolucao } from "../src/gestor/gestor-devolucao";
import { ErroDominio } from "../src/infra/ErroDominio";
import type { DadosDevolucao, RespostaDevolucao } from "../src/types/types";

describe("Teste da classe Gestor Devolucao", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockDadosDevolucao: DadosDevolucao = {
    locacao: {
      codigo: 1,
    },
    registradoPor: {
      codigo: 201,
    },
  };

  const mockRespostaDevolucao: RespostaDevolucao = {
    codigo: 1,
    dataHoraLocacao: "2025-05-20T15:55:14Z",
    horasContratadas: 4,
    dataHoraEntregaPrevista: "2025-05-20T17:55:14Z",
    desconto: 10,
    valorTotal: 90,
    cliente: {
      codigo: 101,
      nomeCompleto: "João Silva",
    },
    registradoPor: {
      codigo: 201,
      nome: "Funcionário",
    },
    locacao: {
      codigo: 1,
    },
  };

  describe("registrarDevolucao", () => {
    it("Deve registrar uma devolução corretamente", async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockRespostaDevolucao,
      });

      const gestor = new GestorDevolucao();
      const resposta = await gestor.registrarDevolucao(mockDadosDevolucao);

      expect(resposta).toEqual(mockRespostaDevolucao);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/devolucao"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(mockDadosDevolucao),
        })
      );
    });

    it("Deve lançar erro quando funcionário não é informado", async () => {
      const dadosInvalidos = {
        ...mockDadosDevolucao,
        registradoPor: {},
      } as DadosDevolucao;

      const gestor = new GestorDevolucao();

      await expect(gestor.registrarDevolucao(dadosInvalidos)).rejects.toBeInstanceOf(ErroDominio);
      await expect(gestor.registrarDevolucao(dadosInvalidos)).rejects.toMatchObject({
        getProblemas: expect.any(Function),
      });
    });

    it("Deve lançar erro quando locação não é informada", async () => {
      const dadosInvalidos = {
        ...mockDadosDevolucao,
        locacao: {},
      } as DadosDevolucao;

      const gestor = new GestorDevolucao();

      await expect(gestor.registrarDevolucao(dadosInvalidos)).rejects.toBeInstanceOf(ErroDominio);
    });
  });

  describe("obterDevolucoes", () => {
    const mockDevolucoes: RespostaDevolucao[] = [
      mockRespostaDevolucao,
      {
        ...mockRespostaDevolucao,
        codigo: 2,
        cliente: {
          codigo: 102,
          nomeCompleto: "Maria Santos",
        },
      },
    ];

    it("Deve retornar uma lista de devoluções corretamente", async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockDevolucoes,
      });

      const gestor = new GestorDevolucao();
      const devolucoes = await gestor.obterDevolucoes();

      expect(devolucoes).toEqual(mockDevolucoes);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/devolucoes"),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("Deve lançar erro quando a requisição falha", async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const gestor = new GestorDevolucao();

      await expect(gestor.obterDevolucoes()).rejects.toBeInstanceOf(ErroDominio);
    });
  });
}); 