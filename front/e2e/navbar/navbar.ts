import { Page } from "@playwright/test";

export class Navbar {

  constructor(public page: Page) {}

  async abrir() {
    await this.page.goto("http://localhost:5173");
  }

async navegarParaListagemLocacao() {
    await this.page.locator("#opt-list-locacao").click();
    await this.page.waitForURL("**/");
  }

  async navegarParaNovaLocacao() {
    await this.page.locator("#opt-nova-locacao").click();
    await this.page.waitForURL("**/locacao-add");
  }

  async navegarParalistagemDevolucao() {
    await this.page.locator("#opt-list-devolucao").click();
    await this.page.waitForURL("**/devolucao-list");
  }

  async navegarParaNovaDevolucao() {
    await this.page.locator("#opt-nova-devolucao").click();
    await this.page.waitForURL("**/devolucao-add");
  }
}
