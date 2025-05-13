import { RouteType } from "./types/rent";
import { initLocacaoList } from "./pages/locacao-list";
import { initLocacaoAdd } from "./pages/locacao-add";

document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  const footerContainer = document.getElementById("footer-container");
  const mainContainer = document.getElementById("main-controller");

  const routes = {
    "/": "/pages/locacao-list.html",
    "/locacao-add": "/pages/locacao-add.html",
    "/devolucao-list": "/pages/devolucao-list.html",
    "/devolucao-add": "/pages/devolucao-add.html",
  };

  // Page initialization functions
  const pageInitializers: Record<string, () => void> = {
    "/": initLocacaoList,
    "/locacao-list": initLocacaoList,
    "/locacao-add": initLocacaoAdd,
  };

  function carregadorElemento(section: HTMLElement | null, url: string) {
    if (!section) return;
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        section.innerHTML = html;
        // Initialize page-specific functionality
        const currentPath = window.location.pathname;
        const initializer = pageInitializers[currentPath];
        if (initializer) {
          initializer();
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar section', section, err);
      });
  }

  // Handle route changes
  window.addEventListener('routeChange', ((event: CustomEvent) => {
    const path = event.detail.path;
    const route = (Object.keys(routes).find((key) => path === key) ?? "/") as RouteType;
    const routePath = routes[route] ?? "/pages/locacao-list.html";
    carregadorElemento(mainContainer, routePath);
  }) as EventListener);

  // Initial page load
  const path = window.location.pathname;
  const route = (Object.keys(routes).find((key) => path === key) ?? "/") as RouteType;
  const routePath = routes[route] ?? "/pages/locacao-list.html";
  carregadorElemento(mainContainer, routePath);

  carregadorElemento(navbarContainer, "/components/navbar.html");
  carregadorElemento(footerContainer, "/components/footer.html");
});
