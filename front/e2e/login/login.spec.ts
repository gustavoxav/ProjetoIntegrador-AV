import { test, expect } from "@playwright/test";
import { Login } from "./login";
import dotenv from "dotenv";

test.use({ storageState: { cookies: [], origins: [] } });

dotenv.config();

test.describe("Fluxo de Login", () => {
  let tela: Login;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new Login(page);
    await tela.abrir();
  });

  const usuarios = [
    {
      cpf: "11111111111",
      senha: "123456",
      cargo: "Patrícia Oliveira - Gerente",
    },
    {
      cpf: "22222222222",
      senha: "123456",
      cargo: "Renato Silva - Atendente",
    },
    {
      cpf: "33333333333",
      senha: "123456",
      cargo: "Juliana Castro - Mecanico",
    },
  ];

  for (const usuario of usuarios) {
    test(`Login correto - ${usuario.cargo} (${usuario.cpf})`, async () => {
      await tela.preencherLogin(usuario.cpf, usuario.senha);

      await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`, { timeout: 10000 });

      const cargoLocator = tela.page.locator("#usuario-logado");
      await expect(cargoLocator).toHaveText(usuario.cargo, { timeout: 5000 });
    });
  }

  test("Login falha - CPF correto e senha incorreta", async () => {
    await tela.preencherLogin("11111111111", "senhaErrada");

    const erro = await tela.verificarMensagemErro();
    expect(erro).toContain("Erro ao realizar login");
  });

  test("Login falha - CPF incorreto e senha correta", async () => {
    await tela.preencherLogin("00000000000", "123456");

    const erro = await tela.verificarMensagemErro();
    expect(erro).toContain("Erro ao realizar login");
  });

  test("Login falha - Ambos incorretos", async () => {
    await tela.preencherLogin("00000000000", "senhaErrada");

    const erro = await tela.verificarMensagemErro();
    expect(erro).toContain("Erro ao realizar login");
  });

  test("Login em sequência com múltiplos usuários", async ({ page }) => {
    for (const usuario of usuarios) {
      await tela.preencherLogin(usuario.cpf, usuario.senha);

      await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`, { timeout: 10000 });

      const cargoLocator = tela.page.locator("#usuario-logado");
      await expect(cargoLocator).toHaveText(usuario.cargo, { timeout: 5000 });

      const logout = tela.page.locator("#btn-logout");
      if (await logout.isVisible()) {
        await logout.click();
      }
    }
  });
});
