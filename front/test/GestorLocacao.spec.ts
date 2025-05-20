import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorLocacao } from "../src/gestor/gestor-locacao";
import type { DadosLocacao, RespostaLocacao } from "../src/types/types";

describe("Teste da classe Gestor Locacao", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve retornar uma lista de locações corretamente", async () => {
    const mockLocacao: RespostaLocacao[] = [
      {
        codigo: 1,
        dataHoraLocacao: "2025-05-20T15:55:14Z",
        horasContratadas: 4,
        dataHoraEntregaPrevista: "2025-05-20T17:55:14Z",
        desconto: 10,
        valorTotal: 90,
        cliente: {
          codigo: 101,
          nomeCompleto: "João da Silva",
          telefone: "11999999999",
        },
        registradoPor: {
          codigo: 201,
          nome: "Funcionário A",
        },
        itens: [
          {
            codigo: 301,
            tempoContratado: 4,
            subtotal: 90,
            equipamento: {
              codigo: 401,
              descricao: "Furadeira",
              valorHora: 10,
              disponivel: true,
            },
          },
        ],
      },
    ];

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockLocacao,
    });

    const gestor = new GestorLocacao();
    const locacoes = await gestor.obterLocacoes();

    expect(locacoes).toEqual(mockLocacao);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/locacoes"),
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

  it("Deve cadastrar uma locação corretamente", async () => {
    const dadosLocacao: DadosLocacao = {
      cliente: {
        codigo: 101,
      },
      registradoPor: {
        codigo: 201,
      },
      horasContratadas: 3,
      itens: [
        {
          equipamento: {
            codigo: 401,
            descricao: "Furadeira",
            valorHora: 10,
            disponivel: true,
          },
        },
      ],
    };

    const respostaEsperada: RespostaLocacao = {
      codigo: 1,
      dataHoraLocacao: "2025-05-20T15:55:14Z",
      horasContratadas: 3,
      dataHoraEntregaPrevista: "2025-05-20T17:55:14Z",
      desconto: 0,
      valorTotal: 100,
      cliente: {
        codigo: 101,
        nomeCompleto: "João da Silva",
        telefone: "11999999999",
      },
      registradoPor: {
        codigo: 201,
        nome: "Funcionário A",
      },
      itens: [
        {
          codigo: 501,
          tempoContratado: 3,
          subtotal: 100,
          equipamento: {
            codigo: 401,
            descricao: "Furadeira",
            valorHora: 10,
            disponivel: true,
          },
        },
      ],
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => respostaEsperada,
    });

    const gestor = new GestorLocacao();
    const resposta = await gestor.registrarLocacao(dadosLocacao);

    expect(resposta).toEqual(respostaEsperada);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/locacoes"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(dadosLocacao),
      })
    );
  });
});
