import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { RelatorioItens } from "./relatorio-itens";

dotenv.config();

test.describe("Testes para Relatório de Itens GERENTE", () => {
  let tela: RelatorioItens;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new RelatorioItens(page);
    await tela.abrir();
  });

  test("Deve carregar a página de relatório de itens com todos os campos obrigatórios", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/relatorio-itens-alugados`);
    await tela.verificarCamposObrigatorios();
    
    await expect(tela.page.locator('h2')).toContainText('Relatório de Itens Alugados');
  });

  test("Inputs de data devem estar preenchidos com o mês atual", async () => {
    const inputsComMesAtual = await tela.verificarInputsDataMesAtual();
    expect(inputsComMesAtual).toBe(true);
  });

  test("Input de data início deve ter o primeiro dia do mês atual", async () => {
    const inputInicioCorreto = await tela.verificarInputInicioMesAtual();
    expect(inputInicioCorreto).toBe(true);
  });

  test("Input de data fim deve ter o último dia do mês atual", async () => {
    const inputFimCorreto = await tela.verificarInputFimMesAtual();
    expect(inputFimCorreto).toBe(true);
  });

  test("Deve exibir o resumo do relatório", async () => {
    const resumoVisivel = await tela.verificarResumoRelatorio();
    expect(resumoVisivel).toBe(true);
  });

  test("Deve verificar valores dos inputs de data", async () => {
    const valorInicio = await tela.obterValorInputInicio();
    const valorFim = await tela.obterValorInputFim();
    
    expect(valorInicio).not.toBe('');
    expect(valorFim).not.toBe('');
    
    const formatoData = /^\d{4}-\d{2}-\d{2}$/;
    expect(valorInicio).toMatch(formatoData);
    expect(valorFim).toMatch(formatoData);
  });

  test("Deve criar relatório com datas específicas e verificar valores", async () => {
    const relatorioCreated = await tela.criarRelatorioComDatasCustomizadas('01/01/2024', '30/04/2025', '92');
    expect(relatorioCreated).toBe(true);
  });

  test("Deve preencher datas específicas e verificar gráfico", async () => {
    await tela.preencherDatasEBuscar('01/01/2024', '30/04/2025');
    const graficoExiste = await tela.verificarGraficoExiste();
    expect(graficoExiste).toBe(true);
  });

  test("Deve preencher datas específicas e verificar valor total", async () => {
    await tela.preencherDatasEBuscar('01/01/2024', '30/04/2025');
    const valorCorreto = await tela.verificarValorTotalGeral('92');
    expect(valorCorreto).toBe(true);
  });
}); 

test.describe("Testes para Relatório de Itens ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  let tela: RelatorioItens;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new RelatorioItens(page);
    await tela.abrir();
  });

  test("Deve carregar a página de relatório de itens com todos os campos obrigatórios", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/relatorio-itens-alugados`);
    await tela.verificarCamposObrigatorios();
    
    await expect(tela.page.locator('h2')).toContainText('Relatório de Itens Alugados');
  });

  test("Inputs de data devem estar preenchidos com o mês atual", async () => {
    const inputsComMesAtual = await tela.verificarInputsDataMesAtual();
    expect(inputsComMesAtual).toBe(true);
  });

  test("Input de data início deve ter o primeiro dia do mês atual", async () => {
    const inputInicioCorreto = await tela.verificarInputInicioMesAtual();
    expect(inputInicioCorreto).toBe(true);
  });

  test("Input de data fim deve ter o último dia do mês atual", async () => {
    const inputFimCorreto = await tela.verificarInputFimMesAtual();
    expect(inputFimCorreto).toBe(true);
  });

  test("Deve exibir o resumo do relatório", async () => {
    const resumoVisivel = await tela.verificarResumoRelatorio();
    expect(resumoVisivel).toBe(true);
  });

  test("Deve verificar valores dos inputs de data", async () => {
    const valorInicio = await tela.obterValorInputInicio();
    const valorFim = await tela.obterValorInputFim();
    
    expect(valorInicio).not.toBe('');
    expect(valorFim).not.toBe('');
    
    const formatoData = /^\d{4}-\d{2}-\d{2}$/;
    expect(valorInicio).toMatch(formatoData);
    expect(valorFim).toMatch(formatoData);
  });

  test("Deve criar relatório com datas específicas e verificar valores", async () => {
    const relatorioCreated = await tela.criarRelatorioComDatasCustomizadas('01/01/2024', '30/04/2025', '92');
    expect(relatorioCreated).toBe(true);
  });

  test("Deve preencher datas específicas e verificar gráfico", async () => {
    await tela.preencherDatasEBuscar('01/01/2024', '30/04/2025');
    const graficoExiste = await tela.verificarGraficoExiste();
    expect(graficoExiste).toBe(true);
  });

  test("Deve preencher datas específicas e verificar valor total", async () => {
    await tela.preencherDatasEBuscar('01/01/2024', '30/04/2025');
    const valorCorreto = await tela.verificarValorTotalGeral('92');
    expect(valorCorreto).toBe(true);
  });
});

test.describe("Testes para Relatório de Itens MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test("MECANICO não deve ter acesso à página de relatorio de itens", async ({ page }) => {
    await page.goto(`${apiUrl}/relatorio-itens-alugados`);
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(`${apiUrl}/relatorio-itens-alugados`);
    await expect(page).toHaveURL(`${apiUrl}/locacao-list`);
  });
});