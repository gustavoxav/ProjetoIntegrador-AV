import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara, aguardarElementoComReload } from "../../src/infra/utils";

dotenv.config();

export class LocacaoAdd {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(apiUrl);
    await this.page.waitForTimeout(2000);
    
    await aguardarElementoComReload(this.page, '#opt-nova-locacao');
    
    await navegarPara("#opt-nova-locacao", "locacao-add", this.page);
  }

  async preencherCliente(codigoCliente: string) {
    await this.page.fill('#cliente', codigoCliente);
    await this.page.waitForTimeout(1000);
    await this.page.click('#btn-buscar-clientes');
    
    await this.page.waitForTimeout(1000);
  }

  async definirHorasLocacao(horas: string) {
    await this.page.fill('#hora', horas);
  }

  async buscarEquipamento(nomeEquipamento: string) {
    await this.page.click('#equipamento');
    await this.page.waitForTimeout(1000);
    
    await this.page.fill('#equipamento', nomeEquipamento);
    await this.page.waitForTimeout(1000);
  }

  async salvarLocacao() {
    await this.page.click('#salvar');
  }

  async verificarCamposObrigatorios() {
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

  async verificarClienteEncontrado(nomeEsperado: string) {
    await this.page.waitForSelector('#mostrar-clientes .list-group-item', { timeout: 5000 });
    const primeiroCliente = this.page.locator('#mostrar-clientes .list-group-item').first();
    await expect(primeiroCliente).toContainText(nomeEsperado);
    return primeiroCliente;
  }

  async selecionarPrimeiroEquipamento() {
    const primeiroEquipamento = this.page.locator('#mostrar-equipamento .list-group-item').first();
    await primeiroEquipamento.click();
    await this.page.waitForTimeout(500);
    
    const botaoAdicionar = this.page.locator('#mostrar-equipamento button:has-text("Adicionar")');
    await botaoAdicionar.click();
    await this.page.waitForTimeout(500);
  }

  async verificarValorTotalMaiorQueZero() {
    const valorTotal = await this.page.textContent('#valor-total');
    const valor = parseFloat(valorTotal?.replace(',', '.') || '0');
    expect(valor).toBeGreaterThan(0);
  }

  async selecionarPrimeiroEquipamentoDisponivel() {
    await this.page.click('#equipamento');
    await this.page.waitForTimeout(1000);
    
    await this.page.waitForSelector('#mostrar-equipamento .list-group-item', { timeout: 5000 });
    
    const listaEquipamentos = this.page.locator('#mostrar-equipamento .list-group-item');
    const count = await listaEquipamentos.count();
    let equipamentoDisponivel: Locator | null = null;
    for (let i = 0; i < count; i++) {
      const item = listaEquipamentos.nth(i);
      const botaoAdicionar = item.locator('button:has-text("Adicionar")');
      if (await botaoAdicionar.isVisible() && await botaoAdicionar.isEnabled()) {
        equipamentoDisponivel = item;
        break;
      }
    }
    if (!equipamentoDisponivel) {
      throw new Error('Nenhum equipamento disponível para adicionar foi encontrado.');
    }
    await equipamentoDisponivel.click();
    await this.page.waitForTimeout(500);
    
    const botaoAdicionar = this.page.locator('#mostrar-equipamento button:has-text("Adicionar")');
    await botaoAdicionar.click();
    await this.page.waitForTimeout(500);
  }
} 