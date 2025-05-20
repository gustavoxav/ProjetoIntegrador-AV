import { Page } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara } from "../../src/infra/utils";

dotenv.config();

export class NotFound {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(`${apiUrl}/teste-not-found`);
  }

    async navegarParaHome() {
      await navegarPara("#return-home-button", "locacao-list", this.page);
    }
}
