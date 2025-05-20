import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { NotFound } from "./not-found";

dotenv.config();

test.describe("Testes para tela de 404 (NotFound) ao abrir uma URL inexistente", () => {
  let tela: NotFound;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new NotFound(page);
    await tela.abrir();
  });

  test("Deve exibir o elemento de 404 (NotFound) com id 'not-found-page'", async () => {
    await expect(tela.page.locator("#not-found-page")).toBeVisible();
  });

  test("Deve navegar para a página inicial ao clicar no botão 'Voltar para a Home'", async () => {
    await tela.navegarParaHome();
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`);
  });
});
