import page from "page";
import { VisaoLocacaoEmHTML } from "./locacao/visao-locacao-html";
import { VisaoDevolucaoEmHTML } from "./devolucao/visao-devolucao-html";
import { VisaoFuncionarioEmHTML } from "./funcionario/visao-funcionario-html";
import { VisaoEquipamentoEmHTML } from "./equipamento/visao-equipamento-html";

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

  page("/", () =>
    carregarRota("/pages/login.html", () => {
      new VisaoFuncionarioEmHTML().iniciarLogin();
    })
  );
  page("/locacao-list", () =>
    carregarRota("/pages/locacao-list.html", () => {
      new VisaoLocacaoEmHTML().iniciarList();
    })
  );
  page("/locacao-add", () =>
    carregarRota("/pages/locacao-add.html", () => {
      new VisaoLocacaoEmHTML().iniciarAdd();
    })
  );
  page("/devolucao-list", () =>
    carregarRota("/pages/devolucao-list.html", () => {
      new VisaoDevolucaoEmHTML().iniciarList();
    })
  );
  page("/devolucao-add", () =>
    carregarRota("/pages/devolucao-add.html", () => {
      new VisaoDevolucaoEmHTML().iniciarAdd();
    })
  );
  page("/avaria-add", () =>
    carregarRota("/pages/avarias-add.html", () => {
      new VisaoEquipamentoEmHTML().iniciarAdd();
    })
  );
  page("/login", () =>
    carregarRota("/pages/login.html", () => {
      new VisaoFuncionarioEmHTML().iniciarLogin();
    })
  );
  page("*", () => carregarRota("/pages/not-found.html", () => {}));

  page();
});
