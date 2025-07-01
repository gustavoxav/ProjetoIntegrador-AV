import { Page } from "@playwright/test";
import dotenv from "dotenv";


dotenv.config();

export class Routes {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(`${apiUrl}/locacao-list`);
  }

  async acessarRota(rota: string): Promise<boolean> {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    
    try {
      await this.page.goto(`${apiUrl}${rota}`);
      await this.page.waitForTimeout(1000);

      const urlAtual = this.page.url();
      return urlAtual.includes(rota);
    } catch (error) {
      return false;
    }
  }

  async naoAcessarRota(rota: string): Promise<boolean> {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    
    try {
      await this.page.goto(`${apiUrl}${rota}`);
      await this.page.waitForTimeout(1000);

      const urlAtual = this.page.url();
      return !urlAtual.includes(rota);
    } catch (error) {
      return true;
    }
  }
}
