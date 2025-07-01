import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "./routes";

dotenv.config();

test.describe("Testes para rotas disponíveis para GERENTE", () => {
  let tela: Routes;

  test.beforeEach(async ({ page }) => {
    tela = new Routes(page);
    await tela.abrir();
  });

  test("Deve verificar se o GERENTE tem acesso a rota /locacao-list", async () => {
    expect(await tela.acessarRota("/locacao-list")).toBe(true);
  });

  test("Deve verificar se o GERENTE tem acesso a rota /locacao-add", async () => {
    expect(await tela.acessarRota("/locacao-add")).toBe(true);
  });

  test("Deve verificar se o GERENTE tem acesso a rota /devolucao-list", async () => {
    expect(await tela.acessarRota("/devolucao-list")).toBe(true);
  });

  test("Deve verificar se o GERENTE tem acesso a rota /devolucao-add", async () => {
    expect(await tela.acessarRota("/devolucao-add")).toBe(true);
  });

  test("Deve verificar se o GERENTE tem acesso a rota /relatorio-devolucao", async () => {
    expect(await tela.acessarRota("/relatorio-devolucao")).toBe(true);
  });

  test("Deve verificar se o GERENTE tem acesso a rota /relatorio-itens-alugados", async () => {
    expect(await tela.acessarRota("/relatorio-itens-alugados")).toBe(true);
  });
});

test.describe("Testes para rotas disponíveis para ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  let tela: Routes;

  test.beforeEach(async ({ page }) => {
    tela = new Routes(page);
    await tela.abrir();
  });

  test("Deve verificar se o ATENDENTE tem acesso a rota /locacao-list", async () => {
    expect(await tela.acessarRota("/locacao-list")).toBe(true);
  });

  test("Deve verificar se o ATENDENTE tem acesso a rota /locacao-add", async () => {
    expect(await tela.acessarRota("/locacao-add")).toBe(true);
  });

  test("Deve verificar se o ATENDENTE tem acesso a rota /devolucao-list", async () => {
    expect(await tela.acessarRota("/devolucao-list")).toBe(true);
  });

  test("Deve verificar se o ATENDENTE tem acesso a rota /devolucao-add", async () => {
    expect(await tela.acessarRota("/devolucao-add")).toBe(true);
  });

  test("Deve verificar se o ATENDENTE NÃO tem acesso a rota /relatorio-devolucao", async () => {
    expect(await tela.naoAcessarRota("/relatorio-devolucao")).toBe(true);
  });

  test("Deve verificar se o ATENDENTE tem acesso a rota /relatorio-itens-alugados", async () => {
    expect(await tela.acessarRota("/relatorio-itens-alugados")).toBe(true);
  });
});

test.describe("Testes para rotas disponíveis para MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  let tela: Routes;

  test.beforeEach(async ({ page }) => {
    tela = new Routes(page);
    await tela.abrir();
  });

  test("Deve verificar se o MECANICO tem acesso a rota /locacao-list", async () => {
    expect(await tela.acessarRota("/locacao-list")).toBe(true);
  });

  test("Deve verificar se o MECANICO NÃO tem acesso a rota /locacao-add", async () => {
    expect(await tela.naoAcessarRota("/locacao-add")).toBe(true);
  });

  test("Deve verificar se o MECANICO tem acesso a rota /devolucao-list", async () => {
    expect(await tela.acessarRota("/devolucao-list")).toBe(true);
  });

  test("Deve verificar se o MECANICO NÃO tem acesso a rota /devolucao-add", async () => {
    expect(await tela.naoAcessarRota("/devolucao-add")).toBe(true);
  });

  test("Deve verificar se o MECANICO NÃO tem acesso a rota /relatorio-devolucao", async () => {
    expect(await tela.naoAcessarRota("/relatorio-devolucao")).toBe(true);
  });

  test("Deve verificar se o MECANICO NÃO tem acesso a rota /relatorio-itens-alugados", async () => {
    expect(await tela.naoAcessarRota("/relatorio-itens-alugados")).toBe(true);
  });
});