import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { LocacaoAdd } from "./locacao-add";

dotenv.config();

test.describe("Testes para Adicionar Locação GERENTE", () => {
  let tela: LocacaoAdd;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new LocacaoAdd(page);
    await tela.abrir();
  });

  test("Deve carregar a página de adicionar locação com todos os campos obrigatórios", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-add`);
    await tela.verificarCamposObrigatorios();
    
    await expect(tela.page.locator('h1')).toContainText('Cadastro de Locação');
    
    const horasInput = tela.page.locator('#hora');
    await expect(horasInput).toHaveValue('2');
  });

  test("Deve permitir preencher e buscar cliente", async () => {
    await tela.preencherCliente('3');
    
    const clienteInput = tela.page.locator('#cliente');
    await expect(clienteInput).toHaveValue('3');
    
    const botaoBuscar = tela.page.locator('#btn-buscar-clientes');
    await expect(botaoBuscar).toBeVisible();
    await expect(botaoBuscar).toBeEnabled();
  });

  test("Deve verificar o cliente que aparece ao buscar", async () => {
    await tela.preencherCliente('1');    
    await tela.verificarClienteEncontrado('Gustavo Xavier Saldanha');
  });

  test("Deve permitir buscar equipamentos e verificar interface", async () => {
    await tela.definirHorasLocacao('4');
    
    await tela.buscarEquipamento('equipamento');
    
    const equipamentoInput = tela.page.locator('#equipamento');
    await expect(equipamentoInput).toHaveValue('equipamento');
    
    const botaoBuscarEquip = tela.page.locator('#btn-buscar-equipamento');
    await expect(botaoBuscarEquip).toBeVisible();
  });

  test("Deve exibir resumo da locação com valores iniciais zerados", async () => {
    await expect(tela.page.locator('#subtotal-section')).toBeVisible();
    
    const valores = await tela.verificarCalculoValores();
    expect(valores.subtotal).toBe('0,00');
    expect(valores.valorTotal).toBe('0,00');
    
    const tabelaVazia = tela.page.locator('#tabela-equipamentos td');
    await expect(tabelaVazia).toContainText('Nenhum equipamento selecionado');
  });

  test("Deve ter botões de ação funcionais", async () => {
    const botaoCancelar = tela.page.locator('#cancelar');
    const botaoSalvar = tela.page.locator('#salvar');
    
    await expect(botaoCancelar).toBeVisible();
    await expect(botaoSalvar).toBeVisible();
    
    await expect(botaoCancelar).toContainText('Cancelar');
    await expect(botaoSalvar).toContainText('Adicionar');
  });

  test("Deve permitir preencher a hora de locação", async () => {
    await tela.definirHorasLocacao('11');
    
    const horasInput = tela.page.locator('#hora');
    await expect(horasInput).toHaveValue('11');
  });

  test("Deve criar uma locação completa", async () => {
    await tela.preencherCliente('1');
    await tela.verificarClienteEncontrado('Gustavo Xavier Saldanha');
    
    await tela.definirHorasLocacao('4');
    
    await tela.selecionarPrimeiroEquipamentoDisponivel();
    
    await tela.verificarValorTotalMaiorQueZero();
    
    const datas = await tela.verificarDatasAutomaticas();
    expect(datas.dataLocacao).not.toBe('-');
    expect(datas.dataDevolucao).not.toBe('-');
    
    await tela.salvarLocacao();
    
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`, { timeout: 5000 });
  });
}); 

test.describe("Testes para Adicionar Locação ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  let tela: LocacaoAdd;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new LocacaoAdd(page);
    await tela.abrir();
  });

  test("Deve carregar a página de adicionar locação com todos os campos obrigatórios", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-add`);
    await tela.verificarCamposObrigatorios();
    
    await expect(tela.page.locator('h1')).toContainText('Cadastro de Locação');
    
    const horasInput = tela.page.locator('#hora');
    await expect(horasInput).toHaveValue('2');
  });

  test("Deve permitir preencher e buscar cliente", async () => {
    await tela.preencherCliente('3');
    
    const clienteInput = tela.page.locator('#cliente');
    await expect(clienteInput).toHaveValue('3');
    
    const botaoBuscar = tela.page.locator('#btn-buscar-clientes');
    await expect(botaoBuscar).toBeVisible();
    await expect(botaoBuscar).toBeEnabled();
  });

  test("Deve permitir buscar equipamentos e verificar interface", async () => {
    await tela.definirHorasLocacao('4');
    
    await tela.buscarEquipamento('equipamento');
    
    const equipamentoInput = tela.page.locator('#equipamento');
    await expect(equipamentoInput).toHaveValue('equipamento');
    
    const botaoBuscarEquip = tela.page.locator('#btn-buscar-equipamento');
    await expect(botaoBuscarEquip).toBeVisible();
  });

  test("Deve exibir resumo da locação com valores iniciais zerados", async () => {
    await expect(tela.page.locator('#subtotal-section')).toBeVisible();
    
    const valores = await tela.verificarCalculoValores();
    expect(valores.subtotal).toBe('0,00');
    expect(valores.valorTotal).toBe('0,00');
    
    const tabelaVazia = tela.page.locator('#tabela-equipamentos td');
    await expect(tabelaVazia).toContainText('Nenhum equipamento selecionado');
  });

  test("Deve ter botões de ação funcionais", async () => {
    const botaoCancelar = tela.page.locator('#cancelar');
    const botaoSalvar = tela.page.locator('#salvar');
    
    await expect(botaoCancelar).toBeVisible();
    await expect(botaoSalvar).toBeVisible();
    
    await expect(botaoCancelar).toContainText('Cancelar');
    await expect(botaoSalvar).toContainText('Adicionar');
  });

  test("Deve verificar o cliente que aparece ao buscar", async () => {
    await tela.preencherCliente('1');    
    await tela.verificarClienteEncontrado('Gustavo Xavier Saldanha');
  });

  test("Deve criar uma locação completa", async () => {
    await tela.preencherCliente('1');
    await tela.verificarClienteEncontrado('Gustavo Xavier Saldanha');
    
    await tela.definirHorasLocacao('4');
    
    await tela.selecionarPrimeiroEquipamentoDisponivel();
    
    await tela.verificarValorTotalMaiorQueZero();
    
    const datas = await tela.verificarDatasAutomaticas();
    expect(datas.dataLocacao).not.toBe('-');
    expect(datas.dataDevolucao).not.toBe('-');
    
    await tela.salvarLocacao();
    
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`, { timeout: 5000 });
  });
}); 

test.describe("Testes para Adicionar Locação MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test("Mecânico não deve ter acesso à página de adicionar locação", async ({ page }) => {
    await page.goto(`${apiUrl}/locacao-add`);
    await expect(page).not.toHaveURL(`${apiUrl}/locacao-add`);
    await expect(page).toHaveURL(`${apiUrl}/locacao-list`);
  });
}); 