import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { RelatorioDevolucao } from "./relatorio-devolucao";

dotenv.config();

test.describe("Testes para Relatório de Devolução GERENTE", () => {
  let tela: RelatorioDevolucao;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new RelatorioDevolucao(page);
    await tela.abrir();
  });

  test("Deve carregar a página de relatório de devolução com todos os campos obrigatórios", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/relatorio-devolucao`);
    await tela.verificarCamposObrigatorios();
    
    await expect(tela.page.locator('h2')).toContainText('Relatório Devolução');
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
    const relatorioCreated = await tela.criarRelatorioComDatasCustomizadas('01/01/2024', '30/04/2025', 'R$ 6435,20');
    expect(relatorioCreated).toBe(true);
  });

  test("Deve preencher datas específicas e verificar gráfico", async () => {
    await tela.preencherDatasEBuscar('01/01/2024', '30/04/2025');
    const graficoExiste = await tela.verificarGraficoExiste();
    expect(graficoExiste).toBe(true);
  });

  test("Deve preencher datas específicas e verificar valor total", async () => {
    await tela.preencherDatasEBuscar('01/01/2024', '30/04/2025');
    const valorCorreto = await tela.verificarValorTotalGeral('R$ 6435,20');
    expect(valorCorreto).toBe(true);
  });
}); 

test.describe("Testes para Relatório de Devolução ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test("ATENDENTE não deve ter acesso à página de relatorio de devolução", async ({ page }) => {
    await page.goto(`${apiUrl}/relatorio-devolucao`);
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(`${apiUrl}/relatorio-devolucao`);
    await expect(page).toHaveURL(`${apiUrl}/locacao-list`);
  });
}); 

test.describe("Testes para Relatório de Devolução MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test("MECANICO não deve ter acesso à página de relatorio de devolução", async ({ page }) => {
    await page.goto(`${apiUrl}/relatorio-devolucao`);
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(`${apiUrl}/relatorio-devolucao`);
    await expect(page).toHaveURL(`${apiUrl}/locacao-list`);
  });
});