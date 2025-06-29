import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorFuncionario } from "../src/funcionario/gestor-funcionario";
import { ErroDominio } from "../src/infra/ErroDominio";

describe("GestorFuncionario", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve retornar um funcionario corretamente", async () => {
    const mockFuncionario = {
      codigo: 1,
      nome: "João Silva",
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockFuncionario,
    });

    const gestor = new GestorFuncionario();
    const funcionario = await gestor.obterTodosFuncionarios();

    expect(funcionario).toEqual(mockFuncionario);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/funcionarios"),
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
      status: 500,
      json: async () => ({}),
    });

    const gestor = new GestorFuncionario();

    await expect(gestor.obterTodosFuncionarios()).rejects.toBeInstanceOf(ErroDominio);
  });

  it("Deve retornar uma lista de funcionários", async () => {
    const mockFuncionarios = [
      {
        codigo: 1,
        nome: "João Silva",
      },
      {
        codigo: 2,
        nome: "João Silva 2",
      },
    ];

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockFuncionarios,
    });

    const gestor = new GestorFuncionario();
    const funcionarios = await gestor.obterTodosFuncionarios();

    expect(funcionarios).toEqual(mockFuncionarios);
    expect(funcionarios).toHaveLength(2);
  });
});
