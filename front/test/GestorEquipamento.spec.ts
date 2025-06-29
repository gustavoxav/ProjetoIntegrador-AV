import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorEquipamento } from "../src/equipamento/gestor-equipamento";
import { ErroDominio } from "../src/infra/ErroDominio";

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

  it("Deve retornar todos os equipamentos corretamente", async () => {
    const mockEquipamentos = [
      {
        id: 1,
        descricao: "1",
        avarias: "Nenhuma",
        disponivel: true,
      },
      {
        id: 2,
        descricao: "2",
        avarias: "Nenhuma",
        disponivel: false,
      },
    ];

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockEquipamentos,
    });

    const gestor = new GestorEquipamento();
    const equipamentos = await gestor.obterTodosEquipamentos();

    expect(equipamentos).toEqual(mockEquipamentos);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/equipamentos"),
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

  it("Deve lançar erro quando falha ao buscar um equipamento específico", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    const gestor = new GestorEquipamento();

    await expect(gestor.obterEquipamento(999)).rejects.toBeInstanceOf(ErroDominio);
  });

  it("Deve lançar erro quando falha ao buscar todos os equipamentos", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const gestor = new GestorEquipamento();

    await expect(gestor.obterTodosEquipamentos()).rejects.toBeInstanceOf(ErroDominio);
  });
});
