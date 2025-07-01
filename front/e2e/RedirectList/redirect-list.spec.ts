import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { LocacaoList, DevolucaoList } from "./redirect-list";

dotenv.config();

test.describe("Testes para Listagem de Locação GERENTE", () => {
  let tela: LocacaoList;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new LocacaoList(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de Nova Locação ao clicar na opção", async () => {
    await tela.navegarParaNovaLocacao();
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-add`);
  });

  test("Deve verificar se o último item da lista tem ID igual a 1", async () => {
    const idUltimoItem = await tela.obterIdUltimoItem();
    expect(idUltimoItem).toBe('1');
  });

  test("Deve navegar para página de Nova Devolução ao clicar no botão Devolver", async () => {
    await tela.clicarPrimeiroBotaoDevolver();
    await expect(tela.page).toHaveURL(/.*\/devolucao-add.*/);
  });
});

test.describe("Testes para Listagem de Locação ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  let tela: LocacaoList;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new LocacaoList(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de Nova Locação ao clicar na opção", async () => {
    await tela.navegarParaNovaLocacao();
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-add`);
  });

  test("Deve verificar se o último item da lista tem ID igual a 1", async () => {
    const idUltimoItem = await tela.obterIdUltimoItem();
    expect(idUltimoItem).toBe('1');
  });

  test("Deve navegar para página de Nova Devolução ao clicar no botão Devolver", async () => {
    await tela.clicarPrimeiroBotaoDevolver();
    await expect(tela.page).toHaveURL(/.*\/devolucao-add.*/);
  });
});

test.describe("Testes para Listagem de Locação MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  let tela: LocacaoList;

  test.beforeEach(async ({ page }) => {
    tela = new LocacaoList(page);
    await tela.abrir();
  });

  test("Mecânico não deve ver o botão de Nova Locação", async () => {
    const botaoNovaLocacao = tela.page.locator("#btn-nova-locacao");
    await expect(botaoNovaLocacao).not.toBeVisible();
  });

  test("Deve verificar se o último item da lista tem ID igual a 1", async () => {
    const idUltimoItem = await tela.obterIdUltimoItem();
    expect(idUltimoItem).toBe('1');
  });

  test("Mecânico não deve ver os botões de Devolver", async () => {
    const botoesDevolverNaoVisiveis = await tela.verificarBotaoDevolverNaoVisivel();
    expect(botoesDevolverNaoVisiveis).toBe(true);
  });
});

test.describe("Testes para Listagem de Devolução GERENTE", () => {
  let tela: DevolucaoList;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new DevolucaoList(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de Nova Devolução ao clicar no botão", async () => {
    await tela.navegarParaNovaDevolucao();
    await expect(tela.page).toHaveURL(`${apiUrl}/devolucao-add`);
  });

  test("Deve verificar se o último item da lista tem ID igual a 1", async () => {
    const idUltimoItem = await tela.obterIdUltimoItem();
    expect(idUltimoItem).toBe('1');
  });
});

test.describe("Testes para Listagem de Devolução ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  let tela: DevolucaoList;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new DevolucaoList(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de Nova Devolução ao clicar no botão", async () => {
    await tela.navegarParaNovaDevolucao();
    await expect(tela.page).toHaveURL(`${apiUrl}/devolucao-add`);
  });

  test("Deve verificar se o último item da lista tem ID igual a 1", async () => {
    const idUltimoItem = await tela.obterIdUltimoItem();
    expect(idUltimoItem).toBe('1');
  });
});

test.describe("Testes para Listagem de Devolução MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  let tela: DevolucaoList;

  test.beforeEach(async ({ page }) => {
    tela = new DevolucaoList(page);
    await tela.abrir();
  });

  test("Mecânico não deve ver o botão de Nova Devolução", async () => {
    const botaoNovaDevolucao = tela.page.locator("#btn-nova-devolucao");
    await expect(botaoNovaDevolucao).not.toBeVisible();
  });

  test("Deve verificar se o último item da lista tem ID igual a 1", async () => {
    const idUltimoItem = await tela.obterIdUltimoItem();
    expect(idUltimoItem).toBe('1');
  });
});
