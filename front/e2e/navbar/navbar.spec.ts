import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { Navbar } from "./navbar";

dotenv.config();

test.describe("Testes para Navbar", () => {
  let tela: Navbar;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new Navbar(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de listagem de locações ao abrir a aplicação", async () => {
    await expect(tela.page).toHaveURL(`${apiUrl}/`);
  });

  test("Deve navegar para a página de Nova Locação ao clicar na opção", async () => {
    await tela.navegarParaNovaLocacao();
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-add`);
  });

  test("Deve navegar para a página de Listagem de Devolução ao clicar na opção", async () => {
    await tela.navegarParalistagemDevolucao();
    await expect(tela.page).toHaveURL(`${apiUrl}/devolucao-list`);
  });

  test("Deve navegar para a página de Nova Devolução ao clicar na opção", async () => {
    await tela.navegarParaNovaDevolucao();
    await expect(tela.page).toHaveURL(`${apiUrl}/devolucao-add`);
  });
});
