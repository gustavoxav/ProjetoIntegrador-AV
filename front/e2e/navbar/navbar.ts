import { Page } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();
export class Navbar {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(apiUrl);
  }

  private async navegarPara(seletor: string, urlEsperada: string) {
    await this.page.locator(seletor).click();
    await this.page.waitForURL(`**/${urlEsperada}`);
  }

  async navegarParaListagemLocacao() {
    await this.navegarPara("#opt-list-locacao", "");
  }

  async navegarParaNovaLocacao() {
    await this.navegarPara("#opt-nova-locacao", "locacao-add");
  }

  async navegarParalistagemDevolucao() {
    await this.navegarPara("#opt-list-devolucao", "devolucao-list");
  }

  async navegarParaNovaDevolucao() {
    await this.navegarPara("#opt-nova-devolucao", "devolucao-add");
  }
}
