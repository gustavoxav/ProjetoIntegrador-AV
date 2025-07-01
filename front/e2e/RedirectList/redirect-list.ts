import { Page } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara } from "../../src/infra/utils";
dotenv.config();

export class LocacaoList {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(apiUrl);
  }

  async navegarParaNovaLocacao() {
    await this.page.waitForTimeout(500);
    await navegarPara("#btn-nova-locacao", "locacao-add", this.page);
  }

  async obterIdUltimoItem(): Promise<string> {
    await this.page.waitForTimeout(1000);
    await this.page.waitForSelector('#tabela-locacoes tr', { timeout: 1000 });
    const linhas = this.page.locator('#tabela-locacoes tr');
    const totalLinhas = await linhas.count();
    
    if (totalLinhas === 0) {
      throw new Error('Nenhuma locação encontrada na lista');
    }
    
    const ultimaLinha = linhas.nth(totalLinhas - 1);
    const primeiraColuna = ultimaLinha.locator('td').first();
    const id = await primeiraColuna.textContent();
    
    return id?.trim() || '';
  }

  async verificarBotaoDevolverNaoVisivel(): Promise<boolean> {
    await this.page.waitForTimeout(1000);
    await this.page.waitForSelector('#tabela-locacoes tr', { timeout: 1000 });
    
    const botoesDevolver = this.page.locator('a:has-text("Devolver"), button:has-text("Devolver")');
    const count = await botoesDevolver.count();
    
    return count === 0;
  }

  async clicarPrimeiroBotaoDevolver(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.page.waitForSelector('#tabela-locacoes tr', { timeout: 1000 });
    
    const primeiroBotaoDevolver = this.page.locator('a:has-text("Devolver")').first();
    
    await primeiroBotaoDevolver.waitFor({ state: 'visible', timeout: 5000 });
    
    await primeiroBotaoDevolver.click();
  }
}

export class DevolucaoList {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(`${apiUrl}/devolucao-list`);
  }

  async navegarParaNovaDevolucao() {
    await this.page.waitForTimeout(500);
    await navegarPara("#btn-nova-devolucao", "devolucao-add", this.page);
  }

  async obterIdUltimoItem(): Promise<string> {
    await this.page.waitForTimeout(1000);
    await this.page.waitForSelector('#tabela-devolucao tr', { timeout: 1000 });
    const linhas = this.page.locator('#tabela-devolucao tr');
    const totalLinhas = await linhas.count();
    
    if (totalLinhas === 0) {
      throw new Error('Nenhuma devolução encontrada na lista');
    }
    
    const ultimaLinha = linhas.nth(totalLinhas - 1);
    const primeiraColuna = ultimaLinha.locator('td').first();
    const id = await primeiraColuna.textContent();
    
    return id?.trim() || '';
  }
}
