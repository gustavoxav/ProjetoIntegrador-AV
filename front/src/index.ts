import { RouteType } from "./types/rent";

document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  const footerContainer = document.getElementById("footer-container");
  const mainContainer = document.getElementById("main-controller");

  function carregadorElemento(section: HTMLElement | null, url: string) {
    if (!section) return;
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        section.innerHTML = html;
      })
      .catch((err) => {
        console.error(`Erro ao carregar section`, section, err);
      });
  }

  const routes = {
    "/": "/pages/locacao-list.html",
    "/locacao-add": "/pages/locacao-add.html",
    "/devolucao-list": "/pages/devolucao-list.html",
    "/devolucao-add": "/pages/devolucao-add.html",
  };

  const path = window.location.pathname;
  const route = (Object.keys(routes).find((key) => path === key) ??
    "/") as RouteType;
  console.log(path, route, routes[route]);
  const routePath = routes[route] ?? "/pages/locacao-add.html";
  carregadorElemento(mainContainer, routePath);

  carregadorElemento(navbarContainer, "/components/navbar.html");
  carregadorElemento(footerContainer, "/components/footer.html");
});
