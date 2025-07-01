import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { Navbar } from "./navbar";

dotenv.config();

test.describe("Testes para Navbar GERENTE", () => {
  let tela: Navbar;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new Navbar(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de listagem de locações ao abrir a aplicação", async () => {
    await tela.page.waitForTimeout(900);
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`);
  });

  const opcoesComAcesso = [
    { seletor: "#opt-list-locacao", rota: "/locacao-list" },
    { seletor: "#opt-nova-locacao", rota: "/locacao-add" },
    { seletor: "#opt-list-devolucao", rota: "/devolucao-list" },
    { seletor: "#opt-nova-devolucao", rota: "/devolucao-add" },
    { seletor: "#opt-relatorio-devolucao", rota: "/relatorio-devolucao" },
    { seletor: "#opt-relatorio-itens", rota: "/relatorio-itens-alugados" }
  ];

  for (const opcao of opcoesComAcesso) {
    test(`Deve ter a opção ${opcao.seletor}`, async () => {
      await expect(await tela.temOpcao(opcao.seletor)).toBe(true);
    });

    test(`Deve navegar para a página de ${opcao.rota} ao clicar na opção ${opcao.seletor}`, async () => {
      await tela.navegarPara(opcao.seletor);
      await expect(tela.page).toHaveURL(`${apiUrl}${opcao.rota}`);
    });
  }
});

test.describe("Testes para Navbar ATENDENTE", () => {
  test.use({ storageState: 'playwright/.auth/atendente.json' });
  
  let tela: Navbar;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new Navbar(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de listagem de locações ao abrir a aplicação", async () => {
    await tela.page.waitForTimeout(900);
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`);
  });

  const opcoesComAcesso = [
    { seletor: "#opt-list-locacao", rota: "/locacao-list" },
    { seletor: "#opt-nova-locacao", rota: "/locacao-add" },
    { seletor: "#opt-list-devolucao", rota: "/devolucao-list" },
    { seletor: "#opt-nova-devolucao", rota: "/devolucao-add" },
    { seletor: "#opt-relatorio-itens", rota: "/relatorio-itens-alugados" }
  ];

  const opcoesSemAcesso = [
    { seletor: "#opt-relatorio-devolucao", rota: "/relatorio-devolucao" }
  ];

  for (const opcao of opcoesComAcesso) {
    test(`Deve ter a opção ${opcao.seletor}`, async () => {
      await expect(await tela.temOpcao(opcao.seletor)).toBe(true);
    });

    test(`Deve navegar para a página de ${opcao.rota} ao clicar na opção ${opcao.seletor}`, async () => {
      await tela.navegarPara(opcao.seletor);
      await expect(tela.page).toHaveURL(`${apiUrl}${opcao.rota}`);
    });
  }

  for (const opcao of opcoesSemAcesso) {
    test(`Não deve ter a opção ${opcao.seletor}`, async () => {
      await expect(await tela.naoTemOpcao(opcao.seletor)).toBe(true);
    });
  }
});

test.describe("Testes para Navbar MECANICO", () => {
  test.use({ storageState: 'playwright/.auth/mecanico.json' });
  
  let tela: Navbar;
  const apiUrl = process.env.VITE_BASE_URL ?? "";

  test.beforeEach(async ({ page }) => {
    tela = new Navbar(page);
    await tela.abrir();
  });

  test("Deve navegar para a página de listagem de locações ao abrir a aplicação", async () => {
    await tela.page.waitForTimeout(900);
    await expect(tela.page).toHaveURL(`${apiUrl}/locacao-list`);
  });

  const opcoesComAcesso = [
    { seletor: "#opt-list-locacao", rota: "/locacao-list" },
    { seletor: "#opt-list-devolucao", rota: "/devolucao-list" },
  ];

  const opcoesSemAcesso = [
    { seletor: "#opt-relatorio-devolucao", rota: "/relatorio-devolucao" },
    { seletor: "#opt-nova-locacao", rota: "/locacao-add" },
    { seletor: "#opt-nova-devolucao", rota: "/devolucao-add" },
    { seletor: "#opt-relatorio-itens", rota: "/relatorio-itens-alugados" }
  ];

  for (const opcao of opcoesComAcesso) {
    test(`Deve ter a opção ${opcao.seletor}`, async () => {
      await expect(await tela.temOpcao(opcao.seletor)).toBe(true);
    });

    test(`Deve navegar para a página de ${opcao.rota} ao clicar na opção ${opcao.seletor}`, async () => {
      await tela.navegarPara(opcao.seletor);
      await expect(tela.page).toHaveURL(`${apiUrl}${opcao.rota}`);
    });
  }

  for (const opcao of opcoesSemAcesso) {
    test(`Não deve ter a opção ${opcao.seletor}`, async () => {
      await expect(await tela.naoTemOpcao(opcao.seletor)).toBe(true);
    });
  }
});
