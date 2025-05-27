import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara } from "../../src/infra/utils";

dotenv.config();

export class LocacaoAdd {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(apiUrl);
    await navegarPara("#opt-nova-locacao", "locacao-add", this.page);
  }

  async selecionarPrimeiroFuncionario() {
    await this.page.waitForSelector('#funcionario', { timeout: 5000 });
    const selectFuncionario = this.page.locator('#funcionario');
    
    await this.page.waitForSelector('#funcionario option[value]:not([value=""])', { timeout: 5000 });
    
    const firstOption = await this.page.locator('#funcionario option[value]:not([value=""])').first();
    const value = await firstOption.getAttribute('value');
    if (value) {
      await selectFuncionario.selectOption(value);
    }
  }

  async preencherCliente(codigoCliente: string) {
    await this.page.fill('#cliente', codigoCliente);
    await this.page.click('#btn-buscar-clientes');
    
    await this.page.waitForTimeout(1000);
  }

  async verificarCampoClientePreenchido(valor: string) {
    const clienteInput = this.page.locator('#cliente');
    await expect(clienteInput).toHaveValue(valor);
  }

  async definirHorasLocacao(horas: string) {
    await this.page.fill('#hora', horas);
  }

  async buscarEquipamento(nomeEquipamento: string) {
    await this.page.fill('#equipamento', nomeEquipamento);
    await this.page.click('#btn-buscar-equipamento');
    
    await this.page.waitForTimeout(1000);
  }

  async salvarLocacao() {
    await this.page.click('#salvar');
  }

  async verificarCamposObrigatorios() {
    await this.page.waitForSelector('#funcionarios-container');
    await this.page.waitForSelector('#cliente');
    await this.page.waitForSelector('#hora');
    await this.page.waitForSelector('#equipamento');
    await this.page.waitForSelector('#salvar');
  }

  async verificarCalculoValores() {
    const subtotal = await this.page.textContent('#subtotal-itens');
    const valorTotal = await this.page.textContent('#valor-total');
    return { subtotal, valorTotal };
  }

  async verificarDatasAutomaticas() {
    const dataLocacao = await this.page.textContent('#data-locacao');
    const dataDevolucao = await this.page.textContent('#data-devolucao');
    return { dataLocacao, dataDevolucao };
  }

  async verificarMensagemSucesso() {
    await this.page.waitForSelector('output.alert-success', { timeout: 5000 });
    return await this.page.textContent('output.alert-success');
  }

  async verificarMensagemErro() {
    await this.page.waitForSelector('output.alert-danger', { timeout: 5000 });
    return await this.page.textContent('output.alert-danger');
  }
} 