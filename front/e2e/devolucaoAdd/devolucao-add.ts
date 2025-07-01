import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara, aguardarElementoComReload } from "../../src/infra/utils";

dotenv.config();

export class DevolucaoAdd {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.waitForTimeout(1000);
    await this.page.goto(apiUrl);
    await this.page.waitForTimeout(2000);
    
    await aguardarElementoComReload(this.page, '#opt-nova-devolucao');
    
    await navegarPara("#opt-nova-devolucao", "devolucao-add", this.page);
  }

  async verificarCamposObrigatorios() {
    await this.page.waitForSelector('#input-buscar-locacao', { timeout: 5000 });
    await this.page.waitForSelector('#btn-buscar-locacoes', { timeout: 5000 });
    await this.page.waitForSelector('#cancelar-devolucao', { timeout: 5000 });
    await this.page.waitForSelector('#salvar-devolucao', { timeout: 5000 });
  }

  async buscarESelecionarPrimeiraLocacaoParaDevolver() {
    await this.page.waitForTimeout(1000);
    await this.page.click('#btn-buscar-locacoes');
    await this.page.waitForTimeout(2000);
    
    await this.page.waitForSelector('#tabela-locacoes-list tr:not(:has(td[colspan]))', { timeout: 5000 });
    
    const linhasLocacoes = this.page.locator('#tabela-locacoes-list tr:not(:has(td[colspan]))');
    const count = await linhasLocacoes.count();
    
    if (count === 0) {
      throw new Error('Nenhuma locação encontrada para devolução.');
    }
    
    let linhaSelecionada: Locator | null = null;
    for (let i = 0; i < count; i++) {
      const linha = linhasLocacoes.nth(i);
      const botaoSelecionar = linha.locator('td:last-child button:has-text("Selecionar")');
      
      const botaoVisivel = await botaoSelecionar.isVisible();
      
      if (botaoVisivel) {
        linhaSelecionada = linha;
        await botaoSelecionar.click();
        await this.page.waitForTimeout(1000);
        break;
      }
    }
    
    if (!linhaSelecionada) {
      for (let i = 0; i < count; i++) {
        const linha = linhasLocacoes.nth(i);
        const todosBotoes = linha.locator('td:last-child button');
        const countBotoes = await todosBotoes.count();
        
        for (let j = 0; j < countBotoes; j++) {
          const botao = todosBotoes.nth(j);
          const textoBotao = await botao.textContent();
        }
      }
      throw new Error('Nenhuma locação com botão "Selecionar" foi encontrada.');
    }
    
    const locacaoSelecionada = await this.page.locator('#horas-contratadas');
    await expect(locacaoSelecionada).toBeVisible();
    await this.page.waitForTimeout(1000);
    
    return linhaSelecionada;
  }

  async verificarBotaoAdicionarAvariaVisivel(): Promise<boolean> {
    try {
      await this.page.waitForSelector('#tabela-equipamentos tr:not(:has(td[colspan]))', { timeout: 5000 });
      
      const botoesAvaria = this.page.locator('#tabela-equipamentos button:has-text("Adicionar Avaria")');
      const count = await botoesAvaria.count();
      
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  async verificarBotaoAdicionarAvariaNaoVisivel(): Promise<boolean> {
    try {
      await this.page.waitForSelector('#tabela-equipamentos tr:not(:has(td[colspan]))', { timeout: 5000 });
      
      const botoesAvaria = this.page.locator('#tabela-equipamentos button:has-text("Adicionar Avaria")');
      const count = await botoesAvaria.count();
      
      return count === 0;
    } catch (error) {
      return true;
    }
  }

  async verificarTaxaLimpezaVisivel(): Promise<boolean> {
    try {
      await this.page.waitForSelector('#tabela-equipamentos tr:not(:has(td[colspan]))', { timeout: 5000 });

      const checkboxesLimpeza = this.page.locator('#tabela-equipamentos input[type="checkbox"].form-check-input');
      const count = await checkboxesLimpeza.count();
      
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  async verificarTextoTaxaLimpeza(): Promise<boolean> {
    try {
      await this.page.waitForSelector('#tabela-equipamentos tr:not(:has(td[colspan]))', { timeout: 5000 });
      
      const textoLimpeza = this.page.locator('#tabela-equipamentos span:has-text("+ 10%")');
      const count = await textoLimpeza.count();
      
      return count > 0;
    } catch (error) {
      return false;
    }
  }
} 