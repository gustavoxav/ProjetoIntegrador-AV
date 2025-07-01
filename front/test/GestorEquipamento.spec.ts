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

    await expect(gestor.obterEquipamento(999)).rejects.toBeInstanceOf(
      ErroDominio
    );
  });

  it("Deve lançar erro quando falha ao buscar todos os equipamentos", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const gestor = new GestorEquipamento();

    await expect(gestor.obterTodosEquipamentos()).rejects.toBeInstanceOf(
      ErroDominio
    );
  });
});

const funcionarioMock = {
  codigo: 1,
  nome: "João",
  cpf: "12345678900",
  cargo: "Atendente",
};

describe("Registro de Avaria", () => {
  let gestor: GestorEquipamento;

  beforeEach(() => {
    global.fetch = vi.fn();
    gestor = new GestorEquipamento();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve registrar avaria com sucesso", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    await expect(
      gestor.registrarAvaria({
        codigo: 1,
        descricao: "A roda quebrou",
        registradoPor: funcionarioMock,
      })
    ).resolves.toBeUndefined();
  });

  it("Deve lançar erro se o equipamento não for informado", async () => {
    const chamada = gestor.registrarAvaria({
      codigo: 0,
      descricao: "Problema",
      registradoPor: funcionarioMock,
    });

    await expect(chamada).rejects.toBeInstanceOf(ErroDominio);

    try {
      await chamada;
    } catch (erro) {
      expect((erro as ErroDominio).getProblemas()).toContain(
        "Equipamento não informado"
      );
    }
  });

  it("Deve lançar erro se a descrição não for informada", async () => {
    const chamada = gestor.registrarAvaria({
      codigo: 1,
      descricao: "",
      registradoPor: funcionarioMock,
    });

    await expect(chamada).rejects.toBeInstanceOf(ErroDominio);

    try {
      await chamada;
    } catch (erro) {
      expect((erro as ErroDominio).getProblemas()).toContain(
        "Descrição não informada"
      );
    }
  });

  it("Deve lançar erro se a API retornar status diferente de 200", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ erro: "Erro interno do servidor" }),
    });

    const chamada = gestor.registrarAvaria({
      codigo: 1,
      descricao: "Problema X",
      registradoPor: funcionarioMock,
    });

    await expect(chamada).rejects.toBeInstanceOf(ErroDominio);

    try {
      await chamada;
    } catch (erro) {
      expect((erro as ErroDominio).getProblemas()).toContain(
        "Erro interno do servidor"
      );
    }
  });

  it("Deve lançar erro se houver falha de rede", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        throw new Error("Falha de rede");
      }
    );

    const chamada = gestor.registrarAvaria({
      codigo: 1,
      descricao: "Problema qualquer",
      registradoPor: funcionarioMock,
    });

    await expect(chamada).rejects.toBeInstanceOf(ErroDominio);

    try {
      await chamada;
    } catch (erro) {
      expect((erro as ErroDominio).getProblemas()).toContain("Falha de rede");
    }
  });
});
