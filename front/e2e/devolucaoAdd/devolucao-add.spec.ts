import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { DevolucaoAdd } from "./devolucao-add";

dotenv.config();

test.describe("Testes para Adicionar Devolução GERENTE", () => {
  let tela: DevolucaoAdd;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new DevolucaoAdd(page);
    await tela.abrir();
  });

  test("Deve carregar a página de adicionar devolução com todos os campos obrigatórios", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/devolucao-add`);
    await tela.verificarCamposObrigatorios();
    
    await expect(tela.page.locator('h1')).toContainText('Devolução de Locação');
  });

  test("Deve buscar e selecionar primeira locação e verificar se apareceu", async () => {
    await tela.buscarESelecionarPrimeiraLocacaoParaDevolver();
    
    const listaItens = tela.page.locator('#tabela-equipamentos td');
    await expect(listaItens.first()).toBeVisible();
  });

  test("GERENTE deve ter acesso ao botão Adicionar Avaria", async () => {
    await tela.buscarESelecionarPrimeiraLocacaoParaDevolver();

    const temBotaoAvaria = await tela.verificarBotaoAdicionarAvariaVisivel();
    expect(temBotaoAvaria).toBe(true);
  });

  test("GERENTE deve ter acesso ao botão Taxa de Limpeza", async () => {
    await tela.buscarESelecionarPrimeiraLocacaoParaDevolver();

    const temTaxaLimpeza = await tela.verificarTaxaLimpezaVisivel();
    expect(temTaxaLimpeza).toBe(true);
    
    const temTextoLimpeza = await tela.verificarTextoTaxaLimpeza();
    expect(temTextoLimpeza).toBe(true);
  });
}); 

test.describe("Testes para Adicionar Devolução ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  let tela: DevolucaoAdd;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new DevolucaoAdd(page);
    await tela.abrir();
  });

  test("Deve carregar a página de adicionar devolução com todos os campos obrigatórios", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/devolucao-add`);
    await tela.verificarCamposObrigatorios();
    
    await expect(tela.page.locator('h1')).toContainText('Devolução de Locação');
  });

  test("Deve buscar e selecionar primeira locação e verificar se apareceu", async () => {
    await tela.buscarESelecionarPrimeiraLocacaoParaDevolver();
    
    const listaItens = tela.page.locator('#tabela-equipamentos td');
    await expect(listaItens.first()).toBeVisible();
  });

  test("ATENDENTE NÃO deve ter acesso ao botão Adicionar Avaria", async () => {
    await tela.buscarESelecionarPrimeiraLocacaoParaDevolver();

    const naoTemBotaoAvaria = await tela.verificarBotaoAdicionarAvariaNaoVisivel();
    expect(naoTemBotaoAvaria).toBe(true);
  });

  test("ATENDENTE deve ter acesso ao botão Taxa de Limpeza", async () => {
    await tela.buscarESelecionarPrimeiraLocacaoParaDevolver();

    const temTaxaLimpeza = await tela.verificarTaxaLimpezaVisivel();
    expect(temTaxaLimpeza).toBe(true);
    
    const temTextoLimpeza = await tela.verificarTextoTaxaLimpeza();
    expect(temTextoLimpeza).toBe(true);
  });
}); 

test.describe("Testes para Adicionar Devolução MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test("Mecânico não deve ter acesso à página de adicionar devolução", async ({ page }) => {
    await page.goto(`${apiUrl}/devolucao-add`);
    await expect(page).not.toHaveURL(`${apiUrl}/devolucao-add`);
    await expect(page).toHaveURL(`${apiUrl}/locacao-list`);
  });
}); 