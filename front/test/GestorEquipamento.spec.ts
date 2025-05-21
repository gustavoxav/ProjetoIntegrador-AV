import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorEquipamento } from "../src/gestor/gestor-equipamento";

describe("GestorEquipamento", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve retornar um equipamento corretamente", async () => {
    const mockEquipamento = {
      id: 1,
      descricao: "Descrição do Equipamento teste",
      avarias: "Nenhuma avaria",
      disponivel: true,
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockEquipamento,
    });

    const gestor = new GestorEquipamento();
    const equipamento = await gestor.obterEquipamento(1);

    expect(equipamento).toEqual(mockEquipamento);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/equipamentos/1"),
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
