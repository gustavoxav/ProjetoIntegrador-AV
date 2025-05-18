import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorFuncionario } from "../src/gestor/gestor-funcionario";

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
});
