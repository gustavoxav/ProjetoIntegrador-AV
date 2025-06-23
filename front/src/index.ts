import page from "page";
import { VisaoLocacaoEmHTML } from "./locacao/visao-locacao-html";
import { VisaoDevolucaoEmHTML } from "./devolucao/visao-devolucao-html";
import { VisaoFuncionarioEmHTML } from "./funcionario/visao-funcionario-html";
import { VisaoEquipamentoEmHTML } from "./equipamento/visao-equipamento-html";
import { AuthMiddleware } from "./infra/AuthMiddleware";

function carregadorElemento(section: HTMLElement | null, url: string) {
  if (!section) return;
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      section.innerHTML = html;
    })
    .catch((err) => {
      console.error("Erro ao carregar sessão", section, err);
    });
}

function carregarRota(htmlPath: string, initFn: () => void) {
  const mainContainer = document.getElementById("main-controller");
  carregadorElemento(mainContainer, htmlPath);
  setTimeout(() => {
    initFn();
  }, 50);
}

document.addEventListener("DOMContentLoaded", () => {
  carregadorElemento(
    document.getElementById("navbar-container"),
    "/components/navbar.html"
  );
  carregadorElemento(
    document.getElementById("footer-container"),
    "/components/footer.html"
  );

  // Rota de login - se tem cookie vai para /locacao-list, se não fica no login
  page("/", AuthMiddleware.controleLogin, () =>
    carregarRota("/pages/login.html", () => {
      new VisaoFuncionarioEmHTML().iniciarLogin();
    })
  );
  
  // Rotas protegidas - se não tem cookie vai para /
  page("/locacao-list", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/locacao-list.html", () => {
      new VisaoLocacaoEmHTML().iniciarList();
    })
  );
  page("/locacao-add", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/locacao-add.html", () => {
      new VisaoLocacaoEmHTML().iniciarAdd();
    })
  );
  page("/devolucao-list", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/devolucao-list.html", () => {
      new VisaoDevolucaoEmHTML().iniciarList();
    })
  );
  page("/devolucao-add", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/devolucao-add.html", () => {
      new VisaoDevolucaoEmHTML().iniciarAdd();
    })
  );
  page("/avaria-add", AuthMiddleware.protegerRota, () =>
    carregarRota("/pages/avarias-add.html", () => {
      new VisaoEquipamentoEmHTML().iniciarAdd();
    })
  );
  
  // Rota alternativa de login
  page("/login", AuthMiddleware.controleLogin, () =>
    carregarRota("/pages/login.html", () => {
      new VisaoFuncionarioEmHTML().iniciarLogin();
    })
  );
  page("*", () => carregarRota("/pages/not-found.html", () => {}));

  page();
});
