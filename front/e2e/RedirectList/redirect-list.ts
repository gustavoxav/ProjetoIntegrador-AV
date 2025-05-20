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
    await navegarPara("#btn-nova-locacao", "locacao-add", this.page);
  }
}

export class DevolucaoList {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(`${apiUrl}/devolucao-list`);
  }

  async navegarParaNovaDevolucao() {
    await navegarPara("#btn-nova-devolucao", "devolucao-add", this.page);
  }
}
