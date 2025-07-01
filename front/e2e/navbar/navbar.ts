import { Page } from "@playwright/test";
import dotenv from "dotenv";
import { navegarPara, aguardarElementoComReload } from "../../src/infra/utils";

dotenv.config();
export class Navbar {
  constructor(public page: Page) {}

  async abrir() {
    const apiUrl = process.env.VITE_BASE_URL ?? "";
    await this.page.goto(apiUrl);
  }

  async navegarPara(seletor: string, rota: string = "") {
    await this.page.waitForTimeout(900);
    
    await aguardarElementoComReload(this.page, seletor, 2, 3000);
    
    await navegarPara(seletor, rota, this.page);
  }

  async temOpcao(seletor: string): Promise<boolean> {
    try {
      await this.page.waitForTimeout(900);
      
      await aguardarElementoComReload(this.page, seletor, 2, 3000);
      
      const elemento = await this.page.locator(seletor);
      return await elemento.isVisible();
    } catch (error) {
      return false;
    }
  }

  async naoTemOpcao(seletor: string): Promise<boolean> {
    try {
      await this.page.waitForTimeout(900);
      const elemento = await this.page.locator(seletor);
      const isVisible = await elemento.isVisible({ timeout: 1000 });
      return !isVisible;
    } catch (error) {
      return true;
    }
  }
}
