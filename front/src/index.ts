import page from "page";
import { initLocacaoList } from "./pages/locacao-list";
import { initLocacaoAdd } from "./pages/locacao-add";
import { initDevolucaoList } from "./pages/devolucao-list";
import { initDevolucaoAdd } from "./pages/devolucao-add";
import { initNotFound } from "./pages/not-found";

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

  page("/", () => carregarRota("/pages/locacao-list.html", initLocacaoList));
  page("/locacao-list", () =>
    carregarRota("/pages/locacao-list.html", initLocacaoList)
  );
  page("/locacao-add", () =>
    carregarRota("/pages/locacao-add.html", initLocacaoAdd)
  );
  page("/devolucao-list", () =>
    carregarRota("/pages/devolucao-list.html", initDevolucaoList)
  );
  page("/devolucao-add", () =>
    carregarRota("/pages/devolucao-add.html", initDevolucaoAdd)
  );
  page("*", () => carregarRota("/pages/not-found.html", initNotFound));

  page();
});
