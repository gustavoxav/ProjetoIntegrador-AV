import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { LocacaoAdd } from "./locacao-add";

dotenv.config();

test.describe("Testes para Adicionar Locação", () => {
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

  test("Deve carregar lista de funcionários e permitir seleção", async () => {
    await tela.page.waitForSelector('#funcionario', { timeout: 10000 });
    
    const selectFuncionario = tela.page.locator('#funcionario');
    await expect(selectFuncionario).toBeVisible();
    
    const defaultOption = tela.page.locator('#funcionario option[disabled]');
    await expect(defaultOption).toContainText('Selecione um funcionário');
  });

  test("Deve impedir submissão do formulário quando campos obrigatórios estão vazios", async () => {
    await tela.salvarLocacao();
    
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-add`);
  });
}); 