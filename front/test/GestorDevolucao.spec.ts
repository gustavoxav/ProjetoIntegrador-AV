import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorDevolucao } from "../src/devolucao/gestor-devolucao";
import { ErroDominio } from "../src/infra/ErroDominio";
import type {
  DadosDevolucao,
  RespostaDevolucao,
  RespostaSimulacaoDevolucao,
} from "../src/types/types";

describe("Teste da classe Gestor Devolucao", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockDadosDevolucao: DadosDevolucao = {
    locacaoId: 1,
    registradoPor: {
      codigo: 201,
      nome: "Funcionário",
    },
    dataHoraDevolucao: "2025-05-20T17:55:14Z",
    valorPago: 90,
  };

  const mockRespostaDevolucao: RespostaDevolucao = {
    codigo: 1,
    dataHoraDevolucao: "2025-05-20T17:55:14Z",
    valorPago: 4.0,
    registradoPor: {
      codigo: 201,
      nome: "Funcionário",
    },
    locacao: {
      codigo: 1,
      dataHoraLocacao: "2025-05-20T17:55:14Z",
      horasContratadas: 2,
      dataHoraEntregaPrevista: "2025-05-20T17:55:14Z",
      cliente: {
        codigo: 3,
        nomeCompleto: "teste ",
        cpf: "1111111111",
      },
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
        expect.stringContaining("/devolucoes"),
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

      await expect(
        gestor.registrarDevolucao(dadosInvalidos)
      ).rejects.toBeInstanceOf(ErroDominio);
      await expect(
        gestor.registrarDevolucao(dadosInvalidos)
      ).rejects.toMatchObject({
        getProblemas: expect.any(Function),
      });
    });

    it("Deve lançar erro quando locação não é informada", async () => {
      const dadosInvalidos = {
        ...mockDadosDevolucao,
        locacao: {},
      } as DadosDevolucao;

      const gestor = new GestorDevolucao();

      await expect(
        gestor.registrarDevolucao(dadosInvalidos)
      ).rejects.toBeInstanceOf(ErroDominio);
    });
  });

  describe("obterDevolucoes", () => {
    const mockDevolucoes: RespostaDevolucao[] = [
      mockRespostaDevolucao,
      {
        ...mockRespostaDevolucao,
        codigo: 2,
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

      await expect(gestor.obterDevolucoes()).rejects.toBeInstanceOf(
        ErroDominio
      );
    });
  });
});

describe("obterSimulacaoDevolucoes", () => {
  const gestor = new GestorDevolucao();

  const mockSimulacao: RespostaSimulacaoDevolucao = {
    locacao: {
      codigo: 1,
      dataHoraLocacao: "2025-07-01T12:00:00Z",
      horasContratadas: 4,
      dataHoraEntregaPrevista: "2025-07-01T16:00:00Z",
      desconto: 5,
      valorTotal: 100,
      cliente: {
        codigo: 123,
        nomeCompleto: "João da Silva",
        telefone: "99999-9999",
      },
      registradoPor: {
        codigo: 201,
        nome: "Funcionário A",
      },
      itens: [
        {
          codigo: 10,
          tempoContratado: 2,
          subtotal: 50,
          equipamento: {
            codigo: 555,
            modelo: "Shimanno",
            descricao: "Bike elétrica",
            avarias: "Nenhuma",
            disponivel: true,
            valorCompra: 20000,
            fabricante: "Fabricante A",
            numeroSeguro: "123456789",
            valorHora: 25,
          },
        },
      ],
    },
    dataHoraDevolucao: "2025-07-01T18:00:00Z",
    valorPago: 120,
  };

  it("Deve retornar simulação de devolução com sucesso", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockSimulacao,
    });

    const resposta = await gestor.obterSimulacaoDevolucoes(1);

    expect(resposta).toEqual(mockSimulacao);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/devolucoes/simulacao/1"),
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

  it("Deve lançar erro se a API retornar status diferente de 200", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const gestor = new GestorDevolucao();

    try {
      await gestor.obterSimulacaoDevolucoes(1);
    } catch (erro) {
      expect((erro as ErroDominio).getProblemas()[0]).toMatch(
        /Erro ao buscar simulação da decolução/i
      );
    }
  });
});
