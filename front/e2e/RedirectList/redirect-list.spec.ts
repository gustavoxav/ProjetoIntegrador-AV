import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { LocacaoList, DevolucaoList } from "./redirect-list";

dotenv.config();

test.describe("Testes para Listagem de Locação", () => {
  let tela: LocacaoList;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new LocacaoList(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de Nova Locação ao clicar na opção", async () => {
    await tela.navegarParaNovaLocacao();
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-add`);
  });
});

test.describe("Testes para Listagem de Devolução", () => {
  let tela: DevolucaoList;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new DevolucaoList(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de Nova Devolução ao clicar no botão", async () => {
    await tela.navegarParaNovaDevolucao();
    await expect(tela.page).toHaveURL(`${apiUrl}/devolucao-add`);
  });
});
