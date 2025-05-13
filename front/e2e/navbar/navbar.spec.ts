import { test, expect } from "@playwright/test";
import { Navbar } from "./navbar";

test.describe("Testes para Navbar", () => {
  let tela: Navbar;

  test.beforeEach(async ({ page }) => {
    tela = new Navbar(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de listagem de locações ao abrir a aplicação", async () => {
    await expect(tela.page).toHaveURL("http://localhost:5173/");
  });

  test("Deve navegar para a página de Nova Locação ao clicar na opção", async () => {
    await tela.navegarParaNovaLocacao();
    await expect(tela.page).toHaveURL("http://localhost:5173/locacao-add");
  });

  test("Deve navegar para a página de Listagem de Devolução ao clicar na opção", async () => {
    await tela.navegarParalistagemDevolucao();
    await expect(tela.page).toHaveURL("http://localhost:5173/devolucao-list");
  });

  test("Deve navegar para a página de Nova Devolução ao clicar na opção", async () => {
    await tela.navegarParaNovaDevolucao();
    await expect(tela.page).toHaveURL("http://localhost:5173/devolucao-add");
  });
});
