import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorCliente } from "../src/gestor/gestor-cliente";
import { ErroDominio } from "../src/infra/ErroDominio";

describe("GestorCliente", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve retornar um cliente corretamente", async () => {
    const mockCliente = {
      id: 1,
      nomeCompleto: "Gustavo Xavier",
      cpf: "12345678900",
      foto: "https://url-foto.com",
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockCliente,
    });

    const gestor = new GestorCliente();
    const cliente = await gestor.obterClientes(1);

    expect(cliente).toEqual(mockCliente);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/clientes/1"),
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

  //   it("Deve lançar erro se a requisição falhar", async () => {
  //     (fetch as any).mockResolvedValueOnce({
  //       ok: false,
  //       status: 500,
  //       json: async () => ({}),
  //     });

  //     const gestor = new GestorCliente();

  //     await expect(gestor.obterClientes(1)).rejects.toBeInstanceOf(ErroDominio);
  //     await expect(gestor.obterClientes(1)).rejects.toMatchObject({
  //       getProblemas: expect.any(Function),
  //     });
  //   });
});
