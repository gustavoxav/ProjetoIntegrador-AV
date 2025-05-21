import { VisaoLocacaoEmHTML } from "../visao/visao-locacao-html";

export function initLocacaoList() {
  const addButton = document.getElementById("addButton");
  new VisaoLocacaoEmHTML();

  if (addButton) {
    addButton.addEventListener("click", () => {
      window.history.pushState({}, "", "/locacao-add");
      window.dispatchEvent(
        new CustomEvent("routeChange", {
          detail: { path: "/locacao-add" },
        })
      );
    });
  }
}
