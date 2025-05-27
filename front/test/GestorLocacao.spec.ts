import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorLocacao } from "../src/gestor/gestor-locacao";
import type { DadosLocacao, RespostaLocacao } from "../src/types/types";
import { ErroDominio } from "../src/infra/ErroDominio";

describe("Teste da classe Gestor Locacao", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  const mockLocacao: RespostaLocacao[] = [
    {
      codigo: 1,
      dataHoraLocacao: "2025-05-20T15:55:14Z",
      horasContratadas: 4,
      dataHoraEntregaPrevista: "2025-05-20T17:55:14Z",
      desconto: 10,
      valorTotal: 90,
      devolvida: false,
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
            modelo: "FD-2000",
            fabricante: "Bosch",
            descricao: "Furadeira",
            valorHora: 10,
            avarias: "",
            disponivel: true,
            numeroSeguro: "SEG001",
          },
        },
      ],
    },
  ];
  it("Deve retornar uma lista de locações corretamente", async () => {
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

  it("Deve retornar locações com base em um filtro", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockLocacao,
    });

    const gestor = new GestorLocacao();
    const filtro = 1;
    const locacoes = await gestor.obterLocacoes(filtro);

    expect(locacoes).toEqual(mockLocacao);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/locacoes/${filtro}`),
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
            modelo: "FD-2000",
            fabricante: "Bosch",
            descricao: "Furadeira",
            valorHora: 10,
            avarias: "",
            disponivel: true,
            numeroSeguro: "SEG001",
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
      devolvida: false,
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
            modelo: "FD-2000",
            fabricante: "Bosch",
            descricao: "Furadeira",
            valorHora: 10,
            avarias: "",
            disponivel: true,
            numeroSeguro: "SEG001",
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

  it("Deve lançar erro quando falha ao obter locações", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ erro: "Erro interno do servidor" }),
    });

    const gestor = new GestorLocacao();

    await expect(gestor.obterLocacoes()).rejects.toBeInstanceOf(ErroDominio);
  });

  it("Deve lançar erro quando falha ao obter locações com filtro", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    const gestor = new GestorLocacao();

    await expect(gestor.obterLocacoes(999)).rejects.toBeInstanceOf(ErroDominio);
  });

  it("Deve lançar erro quando falha ao registrar locação", async () => {
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
            modelo: "FD-2000",
            fabricante: "Bosch",
            descricao: "Furadeira",
            valorHora: 10,
            avarias: "",
            disponivel: true,
            numeroSeguro: "SEG001",
          },
        },
      ],
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ erro: "Dados inválidos" }),
    });

    const gestor = new GestorLocacao();

    await expect(gestor.registrarLocacao(dadosLocacao)).rejects.toBeInstanceOf(ErroDominio);
  });
});
