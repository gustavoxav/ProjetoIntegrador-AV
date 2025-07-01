import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { GestorFuncionario } from "../src/funcionario/gestor-funcionario";
import { ErroDominio } from "../src/infra/ErroDominio";

describe("Login de Funcionário", () => {
  let gestor: GestorFuncionario;

  beforeEach(() => {
    global.fetch = vi.fn();
    gestor = new GestorFuncionario();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve fazer login com sucesso como Gerente", async () => {
    const mockGerente = {
      codigo: 1,
      nome: "Maria Gerente",
      cpf: "66666666666",
      cargo: "Gerente",
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockGerente,
    });

    const funcionario = await gestor.loginFuncionario("66666666666", "123456");

    expect(funcionario).toEqual(mockGerente);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/login"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          cpf: "66666666666",
          senha: "123456",
        }),
      })
    );
  });

  it("Deve fazer login com sucesso como Atendente", async () => {
    const mockAtendente = {
      codigo: 2,
      nome: "João Atendente",
      cpf: "77777777777",
      cargo: "Atendente",
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockAtendente,
    });

    const funcionario = await gestor.loginFuncionario("77777777777", "123456");

    expect(funcionario).toEqual(mockAtendente);
  });

  it("Deve fazer login com sucesso como Mecânico", async () => {
    const mockMecanico = {
      codigo: 3,
      nome: "Carlos Mecânico",
      cpf: "88888888888",
      cargo: "Mecanico",
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockMecanico,
    });

    const funcionario = await gestor.loginFuncionario("88888888888", "123456");

    expect(funcionario).toEqual(mockMecanico);
  });

  it("Deve lançar erro ao retornar erro no login", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("Erro ao ler JSON");
      },
    });

    await expect(
      gestor.loginFuncionario("99999999999", "123456")
    ).rejects.toBeInstanceOf(ErroDominio);
  });
});

describe("Logout de Funcionário", () => {
  let gestor: GestorFuncionario;

  beforeEach(() => {
    global.fetch = vi.fn();
    gestor = new GestorFuncionario();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve realizar logout com sucesso", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await expect(gestor.logoutFuncionario()).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/logout"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("Deve lançar erro ao retornar erro no logout", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("Erro ao ler JSON");
      },
    });

    await expect(gestor.logoutFuncionario()).rejects.toBeInstanceOf(
      ErroDominio
    );
  });
});
