import { Page } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara } from "../../src/infra/utils";

dotenv.config();
export class Navbar {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(apiUrl);
  }

  async navegarParaListagemLocacao() {
    await navegarPara("#opt-list-locacao", "", this.page);
  }

  async navegarParaNovaLocacao() {
    await navegarPara("#opt-nova-locacao", "locacao-add", this.page);
  }

  async navegarParalistagemDevolucao() {
    await navegarPara("#opt-list-devolucao", "devolucao-list", this.page);
  }

  async navegarParaNovaDevolucao() {
    await navegarPara("#opt-nova-devolucao", "devolucao-add", this.page);
  }
}
