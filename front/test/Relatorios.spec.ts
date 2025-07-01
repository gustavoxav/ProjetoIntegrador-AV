import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ErroDominio } from "../src/infra/ErroDominio";
import { RespostaRelatorioDevolucao } from "../src/types/types";
import { GestorDevolucao } from "../src/devolucao/gestor-devolucao";
import { GestorEquipamento } from "../src/equipamento/gestor-equipamento";

describe("Relatório de Devoluções", () => {
  let gestor: GestorDevolucao;

  beforeEach(() => {
    global.fetch = vi.fn();
    gestor = new GestorDevolucao();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve retornar relatório de devoluções com sucesso", async () => {
    const mockResposta: RespostaRelatorioDevolucao = {
      relatorio: {
        periodo: {
          dataInicial: "2025-01-01",
          dataFinal: "2025-01-31",
          dataInicialFormatada: "01/01/2025",
          dataFinalFormatada: "31/01/2025",
        },
        resumo: {
          valorTotalGeral: 5000,
          quantidadeLocacoesGeral: 10,
          quantidadeDias: 31,
        },
        dados: [
          {
            data: "2025-01-15",
            dataFormatada: "15/01/2025",
            valorTotalPago: 2000,
            quantidadeLocacoes: 4,
          },
        ],
      },
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResposta,
    });

    const resposta = await gestor.relatorioDevolucao(
      "2025-01-01",
      "2025-01-31"
    );
    expect(resposta).toEqual(mockResposta);
  });

  it("Deve lançar erro quando API retorna status diferente de 200", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(
      gestor.relatorioDevolucao("2025-01-01", "2025-01-31")
    ).rejects.toBeInstanceOf(ErroDominio);
  });

  it("Deve lançar erro se ocorrer exceção da chamada", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        throw new Error("Falha de rede");
      }
    );

    try {
      await gestor.relatorioDevolucao("2025-01-01", "2025-01-31");
      throw new Error("Erro não lançado");
    } catch (e) {
      expect(e).toBeInstanceOf(ErroDominio);
      const erro = e as ErroDominio;
      expect(erro.getProblemas()).toContain("Falha de rede");
    }
  });
});

describe("Relatório de Equipamentos", () => {
  let gestor: GestorEquipamento;

  beforeEach(() => {
    global.fetch = vi.fn();
    gestor = new GestorEquipamento();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("Deve retornar relatório de equipamentos com sucesso", async () => {
    const mockRespostaEquipamento = {
      relatorio: [
        {
          id: 1,
          nome: "Bicicleta1",
          modelo: "2 rodas",
          quantidadeLocacoes: 5,
          percentualLocacoes: 25,
        },
        {
          id: 2,
          nome: "Bicicleta2",
          modelo: "3 rodas",
          quantidadeLocacoes: 3,
          percentualLocacoes: 15,
        },
      ],
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockRespostaEquipamento,
    });

    const resposta = await gestor.relatorioEquipamento(
      "2025-01-01",
      "2025-01-31"
    );
    expect(resposta).toEqual(mockRespostaEquipamento);
  });

  it("Deve lançar erro quando API de equipamento retorna status diferente de 200", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(
      gestor.relatorioEquipamento("2025-01-01", "2025-01-31")
    ).rejects.toBeInstanceOf(ErroDominio);
  });

  it("Deve lançar erro se ocorrer exceção na chamada de equipamento", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        throw new Error("Falha de rede");
      }
    );

    try {
      await gestor.relatorioEquipamento("2025-01-01", "2025-01-31");
      throw new Error("Erro não lançado");
    } catch (e) {
      expect(e).toBeInstanceOf(ErroDominio);
      const erro = e as ErroDominio;
      expect(erro.getProblemas()).toContain("Falha de rede");
    }
  });
});
