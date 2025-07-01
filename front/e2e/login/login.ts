import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export class Login {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(apiUrl);
  }

  async preencherLogin(cpf: string, senha: string) {
    await this.page.fill("#cpf", cpf);
    await this.page.fill("#senha", senha);
    await this.page.click("#realizar-login");
  }

  async verificarCampoLogin(cpf: string, senha: string) {
    const cpfInput = this.page.locator("#cpf");
    const senhaInput = this.page.locator("#senha");
    await expect(cpfInput).toHaveValue(cpf);
    await expect(senhaInput).toHaveValue(senha);
  }

  async verificarCamposObrigatorios() {
    await this.page.waitForSelector("#cpf");
    await this.page.waitForSelector("#senha");
  }

  async verificarMensagemSucesso() {
    await this.page.waitForSelector("output.alert-success", { timeout: 5000 });
    return await this.page.textContent("output.alert-success");
  }

  async verificarMensagemErro() {
    await this.page.waitForSelector("output.alert-danger", { timeout: 5000 });
    return await this.page.textContent("output.alert-danger");
  }
}
